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
