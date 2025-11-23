//export default http;
// frontend/src/api/http.ts
import axios, {
  AxiosHeaders,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosError,
} from "axios";
import { useUiStore } from "@/stores/ui";
import { useAuthStore } from "@/stores/auth";

const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000",
  timeout: 15_000,
});

// ➜ Запит: додаємо токен і запускаємо глобальний лоадер
http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("token");

  // 1) Гарантуємо, що headers існує і має коректний тип
  //    (в Axios v1 це або AxiosHeaders, або сирий об'єкт типу RawAxiosRequestHeaders)
  if (!config.headers) {
    config.headers = new AxiosHeaders(); // ✅ не {}
  }

  // 2) Ставимо Authorization з урахуванням типу заголовків
  if (token) {
    if (config.headers instanceof AxiosHeaders) {
      // Випадок 1: це екземпляр AxiosHeaders
      config.headers.set("Authorization", `Bearer ${token}`);
    } else {
      // Випадок 2: "сирий" об'єкт заголовків
      (
        config.headers as Record<string, string>
      ).Authorization = `Bearer ${token}`;
    }
  }

  useUiStore().start(); // показуємо глобальний лоадер
  return config;
});

// ➜ Відповідь/помилка: зупиняємо лоадер; 401 — редіректимо, але не для /auth/login
http.interceptors.response.use(
  (response) => {
    useUiStore().stop();
    return response;
  },
  (error: AxiosError) => {
    useUiStore().stop();

    const status = error.response?.status ?? 0;
    const url = error.config?.url ?? "";
    const method = error.config?.method?.toUpperCase() ?? "UNKNOWN";
    const errorData = error.response?.data;

    // Детальне логування помилок
    console.error(`❌ [HTTP ERROR] ${method} ${url} → ${status}`, {
      status,
      statusText: error.response?.statusText,
      data: errorData,
      message: error.message,
      config: {
        method: error.config?.method,
        url: error.config?.url,
        headers: error.config?.headers,
      },
    });

    // Додатково логуємо деталі помилки, якщо вони є
    if (errorData && typeof errorData === "object") {
      if ("message" in errorData) {
        console.error(`   Error message: ${errorData.message}`);
      }
      if ("error" in errorData) {
        console.error(`   Error details: ${errorData.error}`);
      }
      if ("errors" in errorData) {
        console.error(`   Validation errors:`, errorData.errors);
      }
    }

    // ❗ Не скидаємо сторінку, якщо це помилка логіну — інакше не побачиш повідомлення «Невірний логін…»
    const isLoginRequest = url.includes("/auth/login");

    if ((status === 401 || status === 403) && !isLoginRequest) {
      // Виводимо детальну інформацію про помилку аутентифікації
      console.error(`[AUTH ERROR] Authentication failed (${status}) for ${method} ${url}`, {
        status,
        statusText: error.response?.statusText,
        data: errorData,
        message: error.message,
      });
      
      // Додаємо затримку перед редиректом, щоб користувач міг побачити помилку
      const delay = 5000; // 5 секунд затримки
      setTimeout(() => {
        // Используем store для корректного сброса состояния
        const authStore = useAuthStore();
        authStore.forceLogout();
      }, delay);
    }

    return Promise.reject(error);
  }
);

export default http;
