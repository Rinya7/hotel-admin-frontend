//// frontend/src/api/http.ts
//import axios from "axios";
//// ⬇️ тип імпортуємо type-only
//import type { AxiosInstance } from "axios";
//import { useUiStore } from "../stores/ui"; // ✅ можна безпечно імпортувати — Pinia вже ініціалізована в main.ts

//const http: AxiosInstance = axios.create({
//  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000",
//  timeout: 15_000,
//});

//// Додаємо токен у кожен запит, якщо є
//http.interceptors.request.use((config) => {
//  const token = localStorage.getItem("token");

//  if (token && config.headers) {
//    config.headers.Authorization = `Bearer ${token}`;
//  }
//  // UI: старт глобального лоадера
//  const ui = useUiStore();
//  ui.start();
//  return config;
//});

//// Якщо 401 — чистимо локалку і на /login
//http.interceptors.response.use(
//  (response) => {
//    const ui = useUiStore();
//    ui.stop();
//    return response;
//  },
//  (err) => {
//    const ui = useUiStore();
//    ui.stop();
//    if (err?.response?.status === 401) {
//      localStorage.clear();
//      window.location.href = "/login";
//    }
//    return Promise.reject(err);
//  }
//);

//export default http;
// frontend/src/api/http.ts
import axios, {
  AxiosHeaders,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosError,
} from "axios";
import { useUiStore } from "../stores/ui";

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

    // ❗ Не скидаємо сторінку, якщо це помилка логіну — інакше не побачиш повідомлення «Невірний логін…»
    const isLoginRequest = url.includes("/auth/login");

    if (status === 401 && !isLoginRequest) {
      localStorage.clear();
      // тут краще router.replace, але щоб уникнути циклічних імпортів у http.ts — робимо м’який редірект:
      window.location.assign("/login");
    }

    return Promise.reject(error);
  }
);

export default http;
