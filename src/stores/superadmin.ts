// src/stores/superadmin
// Pinia-стора для супер-адміна: список готелів (адмінів),
// локальний пошук/сортування і дії: блок/розблок/видалення.

import { defineStore } from "pinia";
import http from "@/api/http"; // 👈 використовуємо твій axios-інстанс
import type {
  PublicAdminUser,
  SuperAdminUsersResponse,
  HotelSortKey,
  SortDir,
} from "@/types/hotel";
import type {
  CreateAdminRequest,
  CreateAdminResponse,
  UpdateHotelAdminRequest,
  UpdateHotelAdminResponse,
} from "@/types/dto";

export interface HotelsState {
  loading: boolean;
  error: string | null;
  raw: PublicAdminUser[]; // оригінальний список із сервера
  query: string; // рядок пошуку
  sortKey: HotelSortKey;
  sortDir: SortDir;
}

function normalize(text: string): string {
  return text.toLowerCase();
}

function getSortValue(
  h: PublicAdminUser,
  key: HotelSortKey
): string | number | boolean {
  // Аксесори під кожен дозволений ключ
  switch (key) {
    case "hotel_name":
      return (h.hotel_name ?? "").toLowerCase();
    case "address":
      return (h.address ?? "").toLowerCase();
    case "username":
      return h.username.toLowerCase();
    case "createdAt":
      // ISO-рядок можна порівнювати лексикографічно; для швидкості — в число time
      return Date.parse(h.createdAt) || 0;
    case "editorsCount":
      return h.editorsCount;
    case "isBlocked":
      return h.isBlocked;
  }
}
function compareValues(
  a: string | number | boolean,
  b: string | number | boolean,
  dir: SortDir
): number {
  const mul = dir === "asc" ? 1 : -1;

  // Приводимо до однакового типу порівняння
  if (typeof a === "string" && typeof b === "string") {
    return a.localeCompare(b) * mul;
  }
  if (typeof a === "number" && typeof b === "number") {
    return (a - b) * mul;
  }
  if (typeof a === "boolean" && typeof b === "boolean") {
    return (Number(a) - Number(b)) * mul;
  }
  // Якщо типи різні — приводимо до рядка як fallback (рідкісний кейс)
  return String(a).localeCompare(String(b)) * mul;
}

export const useSuperHotelsStore = defineStore("super-hotels", {
  state: (): HotelsState => ({
    loading: false,
    error: null,
    raw: [],
    query: "",
    sortKey: "hotel_name",
    sortDir: "asc",
  }),
  getters: {
    filtered(state): PublicAdminUser[] {
      if (!state.query.trim()) return state.raw;
      const q = normalize(state.query);
      return state.raw.filter((r) => {
        const fields: Array<string> = [
          r.hotel_name ?? "",
          r.address ?? "",
          r.username,
          r.full_name ?? "",
          r.email ?? "",
          r.phone ?? "",
        ];
        return fields.some((f) => normalize(f).includes(q));
      });
    },
    sorted(): PublicAdminUser[] {
      const key = this.sortKey;
      const dir = this.sortDir;
      const list = [...this.filtered];
      return list.sort((a, b) =>
        compareValues(getSortValue(a, key), getSortValue(b, key), dir)
      );
    },
    /** Загальна кількість готелів (адмінів-власників) */
    totalHotels(state): number {
      return state.raw.length;
    },

    /** Сумарна кількість редакторів по всіх готелях */
    totalEditors(state): number {
      return state.raw.reduce((acc, h) => acc + (h.editorsCount ?? 0), 0);
    },

    /** Скільки заблоковано готелів */
    blockedHotels(state): number {
      return state.raw.filter((h) => h.isBlocked).length;
    },

    /** Скільки активних (не заблокованих) */
    activeHotels(): number {
      return this.totalHotels - this.blockedHotels;
    },

    /** Середнє число редакторів на готель (округлено до 1 знаку) */
    avgEditorsPerHotel(): number {
      if (this.totalHotels === 0) return 0;
      const avg = this.totalEditors / this.totalHotels;
      return Math.round(avg * 10) / 10;
    },

    /** Останні N готелів за датою створення */
    latestHotels:
      (state) =>
      (limit = 5): PublicAdminUser[] => {
        return [...state.raw]
          .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
          .slice(0, limit);
      },
  },
  actions: {
    setQuery(q: string): void {
      this.query = q;
    },
    setSort(key: HotelSortKey): void {
      if (this.sortKey === key) {
        this.sortDir = this.sortDir === "asc" ? "desc" : "asc";
      } else {
        this.sortKey = key;
        this.sortDir = "asc";
      }
    },

    /** Створити нового адміна (готель). Потрібно бути супер-адміном. */
    async createHotelAdmin(payload: CreateAdminRequest): Promise<void> {
      // Мінімальна перевірка на фронті — паролі збігаються
      if (payload.password !== payload.confirmPassword) {
        throw new Error("Паролі не збігаються");
      }
      // 👇 чітко кажемо: очікуємо CreateAdminResponse
      await http.post<CreateAdminResponse>("/auth/create-admin", payload);

      // Після створення — оновимо список, щоб статистика/таблиця відразу підхопилися
      await this.fetchAll();
    },

    /** Оновити дані готелю (за username), тільки супер-адмін */
    async updateHotel(
      username: string,
      patch: UpdateHotelAdminRequest
    ): Promise<void> {
      // Мінімальна фронт-валідація годин (якщо передані)
      const isHourOrNull = (v: unknown): v is number | null =>
        v === null ||
        (Number.isInteger(v) && (v as number) >= 0 && (v as number) <= 23);

      if (
        typeof patch.checkInHour !== "undefined" &&
        !isHourOrNull(patch.checkInHour)
      ) {
        throw new Error("checkInHour має бути 0..23 або null");
      }
      if (
        typeof patch.checkOutHour !== "undefined" &&
        !isHourOrNull(patch.checkOutHour)
      ) {
        throw new Error("checkOutHour має бути 0..23 або null");
      }

      const res = await http.put<UpdateHotelAdminResponse>(
        `/auth/admin/${encodeURIComponent(username)}`,
        patch
      );

      // Оптимістично оновимо локальний кеш
      const updated = res.data.admin;
      const idx = this.raw.findIndex((u) => u.username === username);
      if (idx >= 0) {
        const old = this.raw[idx];
        this.raw[idx] = {
          ...old,
          hotel_name: updated.hotel_name,
          address: updated.address,
          full_name: updated.full_name,
          phone: updated.phone,
          email: updated.email,
          logo_url: updated.logo_url,
          checkInHour: updated.checkInHour,
          checkOutHour: updated.checkOutHour,
          updatedAt: updated.updatedAt,
        };
      }
    },

    /** Завантажити всіх адмінів-«власників» (готелі) для супер-адміна */
    async fetchAll(): Promise<void> {
      this.loading = true;
      this.error = null;
      try {
        // Бекенд: GET /auth/users — для superadmin повертає масив PublicAdminUser
        const res = await http.get<SuperAdminUsersResponse>("/auth/users");
        this.raw = res.data;
      } catch (e) {
        this.error = e instanceof Error ? e.message : "Unknown error";
      } finally {
        this.loading = false;
      }
    },

    /** Взяти готель з кешу за id */
    byId(id: number): PublicAdminUser | undefined {
      return this.raw.find((x) => x.id === id);
    },

    /** Блокувати адміна і всіх його редакторів */
    async block(username: string): Promise<void> {
      await http.put(`/auth/block/${encodeURIComponent(username)}`);
      // оптимістично оновимо локально
      const target = this.raw.find((u) => u.username === username);
      if (target) {
        target.isBlocked = true;
        // також помітимо редакторів (опційно)
        target.editors.forEach((e) => (e.isBlocked = true));
      }
    },

    /** Розблокувати адміна і всіх його редакторів */
    async unblock(username: string): Promise<void> {
      await http.put(`/auth/unblock/${encodeURIComponent(username)}`);
      const target = this.raw.find((u) => u.username === username);
      if (target) {
        target.isBlocked = false;
        target.editors.forEach((e) => (e.isBlocked = false));
      }
    },

    /** Видалити користувача (супер-адмін може видалити будь-кого) */
    async removeUser(username: string): Promise<void> {
      await http.delete(`/auth/delete/${encodeURIComponent(username)}`);
      this.raw = this.raw.filter((u) => u.username !== username);
    },
  },
});
