// frontend/src/stores/auth.ts
import { defineStore } from "pinia";
import http from "@/api/http";
import type {
  LoginRequest,
  LoginEnvelope,
  LoginPayload,
  UserRole,
} from "../types/auth";

interface AuthState {
  token: string | null;
  role: UserRole | null;
  username: string | null;
  adminId?: number;
  hotelName?: string | null;
  profileLoaded: boolean; // прапор: коли true — хедер/guard уже мають валідні дані для відображення
  // Базовые policy hours отеля (дефолтные для всех комнат)
  defaultCheckInHour: number | null;
  defaultCheckOutHour: number | null;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    token: localStorage.getItem("token"),
    role: (localStorage.getItem("role") as UserRole | null) ?? null,
    username: localStorage.getItem("username"),
    adminId: localStorage.getItem("adminId")
      ? Number(localStorage.getItem("adminId"))
      : undefined,
    // важливо: якщо ключу немає — буде null; якщо лежав "null" рядком — приберемо в login()
    hotelName: localStorage.getItem("hotelName") ?? null,
    profileLoaded: Boolean(localStorage.getItem("token")), // якщо токен є — вважаємо, що профіль відомий
    // Базовые policy hours отеля
    defaultCheckInHour: localStorage.getItem("defaultCheckInHour")
      ? Number(localStorage.getItem("defaultCheckInHour"))
      : null,
    defaultCheckOutHour: localStorage.getItem("defaultCheckOutHour")
      ? Number(localStorage.getItem("defaultCheckOutHour"))
      : null,
  }),

  // ⬇️ Додаємо акуратний getter — тепер router може читати auth.isLogged
  getters: {
    // Є токен — вважаємо залогіненим
    isLogged: (state): boolean => Boolean(state.token),
    // Зручний вивід у хедері   показати в хедері як ім'я
    displayName: (state): string => state.username ?? state.hotelName ?? "—",
    // Зручні геттери для ролей (для роут-гайдів/умовного рендерингу)
    isSuperadmin: (s): boolean => s.role === "superadmin",
    isAdmin: (s): boolean => s.role === "admin",
    isEditor: (s): boolean => s.role === "editor",
  },

  actions: {
    // 1) Логін: бек повертає envelope з payload — розпаковуємо
    async login(payload: LoginRequest): Promise<void> {
      // 1) логінимося
      const { data } = await http.post<LoginEnvelope>("/auth/login", payload);
      // 2) розпаковуємо внутрішні дані (response) — тут лежать token/role/...
      const p: LoginPayload = data.payload;
      // Зберігаємо у стейт
      this.token = p.token;
      this.role = p.role;
      this.username = p.username;
      this.adminId = p.adminId;
      this.hotelName = p.hotelName;

      // Сохраняем базовые policy hours отеля
      this.defaultCheckInHour = p.policy?.checkInHour ?? null;
      this.defaultCheckOutHour = p.policy?.checkOutHour ?? null;

      // Дублюємо в localStorage, щоб пережити перезавантаження
      localStorage.setItem("token", p.token);
      localStorage.setItem("role", p.role);
      localStorage.setItem("username", p.username);
      if (p.adminId !== undefined) {
        localStorage.setItem("adminId", String(p.adminId));
      } else {
        localStorage.removeItem("adminId");
      }
      if (p.hotelName !== undefined && p.hotelName !== null) {
        localStorage.setItem("hotelName", p.hotelName);
      } else {
        localStorage.removeItem("hotelName"); // не зберігаємо "null" як текст
      }

      // Сохраняем policy hours в localStorage
      if (this.defaultCheckInHour !== null) {
        localStorage.setItem(
          "defaultCheckInHour",
          String(this.defaultCheckInHour)
        );
      } else {
        localStorage.removeItem("defaultCheckInHour");
      }
      if (this.defaultCheckOutHour !== null) {
        localStorage.setItem(
          "defaultCheckOutHour",
          String(this.defaultCheckOutHour)
        );
      } else {
        localStorage.removeItem("defaultCheckOutHour");
      }

      // 4) Дуже важливо: тепер UI та guards знають, що профіль «готовий»
      this.profileLoaded = true;
    },

    logout(): void {
      this.$reset();
      localStorage.clear();
      window.location.href = "/login";
    },

    // Принудительный выход при истечении токена
    forceLogout(): void {
      console.warn("Token expired: forcing logout");
      this.$reset();
      localStorage.clear();
      window.location.href = "/login";
    },
  },
});
