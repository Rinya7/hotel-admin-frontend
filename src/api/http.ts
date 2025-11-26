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

/**
 * Маскирует чувствительные поля в данных запроса для безопасного логирования
 * @param data - данные запроса
 * @returns данные с замаскированными чувствительными полями
 */
function maskSensitiveData(data: unknown): unknown {
  if (!data || typeof data !== "object") {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((item) => maskSensitiveData(item));
  }

  const masked = { ...(data as Record<string, unknown>) };
  const sensitiveFields = ["password", "token", "accessToken", "refreshToken", "secret", "apiKey", "wifiPassword"];

  for (const field of sensitiveFields) {
    if (field in masked && masked[field] !== undefined && masked[field] !== null) {
      masked[field] = "***MASKED***";
    }
  }

  return masked;
}

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

  // Убеждаемся, что Content-Type установлен для POST/PUT/PATCH
  if (config.method && ["post", "put", "patch"].includes(config.method.toLowerCase())) {
    if (!config.headers) {
      config.headers = new AxiosHeaders();
    }
    
    // Устанавливаем Content-Type если его нет
    if (config.headers instanceof AxiosHeaders) {
      if (!config.headers.has("Content-Type")) {
        config.headers.set("Content-Type", "application/json");
      }
    } else {
      const headers = config.headers as Record<string, string>;
      if (!headers["Content-Type"] && !headers["content-type"]) {
        headers["Content-Type"] = "application/json";
      }
    }

    // Логируем данные запроса только в development режиме (с маскировкой чувствительных полей)
    // Не логируем запросы к /auth/login для безопасности
    const isAuthLogin = config.url?.includes("/auth/login");
    if (import.meta.env.DEV && !isAuthLogin) {
      const maskedData = maskSensitiveData(config.data);
      
      // Маскируем Authorization header в логах
      const safeHeaders = { ...config.headers };
      if (safeHeaders && typeof safeHeaders === "object") {
        if ("Authorization" in safeHeaders || "authorization" in safeHeaders) {
          const authKey = "Authorization" in safeHeaders ? "Authorization" : "authorization";
          safeHeaders[authKey] = "***MASKED***";
        }
      }
      
      console.log(`[HTTP REQUEST] ${config.method.toUpperCase()} ${config.url}`, {
        data: maskedData,
        dataStringified: JSON.stringify(maskedData),
        headers: safeHeaders,
      });
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

    // Не логируем ошибки аутентификации в консоль (безопасность)
    // Проверяем как относительный, так и абсолютный URL
    const isAuthEndpoint = url.includes("/auth/login") || url.endsWith("/auth/login");
    
    if (!isAuthEndpoint) {
      // Детальне логування помилок (тільки в DEV, з маскировкою токенів)
      if (import.meta.env.DEV) {
        // Маскируем Authorization header, если он есть
        const safeHeaders = { ...error.config?.headers };
        if (safeHeaders && typeof safeHeaders === "object") {
          if ("Authorization" in safeHeaders || "authorization" in safeHeaders) {
            const authKey = "Authorization" in safeHeaders ? "Authorization" : "authorization";
            safeHeaders[authKey] = "***MASKED***";
          }
        }

        console.error(`❌ [HTTP ERROR] ${method} ${url} → ${status}`, {
          status,
          statusText: error.response?.statusText,
          data: errorData,
          message: error.message,
          config: {
            method: error.config?.method,
            url: error.config?.url,
            headers: safeHeaders,
          },
        });
      } else {
        // В production логируем только базовую информацию без деталей
        console.error(`❌ [HTTP ERROR] ${method} ${url} → ${status}`);
      }

      // Додатково логуємо деталі помилки, якщо вони є (тільки в DEV)
      if (import.meta.env.DEV && errorData && typeof errorData === "object") {
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
    }

    // ❗ Не скидаємо сторінку, якщо це помилка логіну — інакше не побачиш повідомлення «Невірний логін…»
    const isLoginRequest = url.includes("/auth/login");

    if ((status === 401 || status === 403) && !isLoginRequest) {
      // Виводимо детальну інформацію про помилку аутентифікації (тільки в DEV)
      if (import.meta.env.DEV) {
        console.error(`[AUTH ERROR] Authentication failed (${status}) for ${method} ${url}`, {
          status,
          statusText: error.response?.statusText,
          data: errorData,
          message: error.message,
        });
      }
      
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
