// src/types/hotel.ts
// Строгі типи об'єктів, що повертає бекенд для супер-адміна (/auth/users).

export type Role = "superadmin" | "admin" | "editor";

// Користувач-адмін (власник готелю), який віддається супер-адміну
export interface PublicAdminUser {
  id: number;
  username: string;
  role: Role; // "admin"
  hotel_name: string | null;
  address: string | null;
  full_name: string | null;
  logo_url: string | null;
  phone: string | null;
  email: string | null;
  isBlocked: boolean;
  checkInHour: number | null; // політики готелю на рівні admin
  checkOutHour: number | null;
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
  editorsCount: number; // кількість редакторів
  editors: Array<{
    id: number;
    username: string;
    role: Role; // завжди "editor"
    full_name: string | null;
    phone: string | null;
    email: string | null;
    isBlocked: boolean;
    createdAt: string;
    updatedAt: string;
  }>;
}

// Відповідь беку для супер-адміна: масив PublicAdminUser
export type SuperAdminUsersResponse = PublicAdminUser[];

// Ключі для сортування (лише те, що показуємо у таблиці/картці)
export type HotelSortKey =
  | "hotel_name"
  | "address"
  | "username"
  | "createdAt"
  | "editorsCount"
  | "isBlocked";

export type SortDir = "asc" | "desc";
