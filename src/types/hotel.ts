// src/types/hotel.ts
// Строгі типи об'єктів, що повертає бекенд для супер-адміна (/auth/users).

export type Role = "superadmin" | "admin" | "editor";

// Користувач-адмін (власник готелю), який віддається супер-адміну
export interface PublicAdminUser {
  id: number;
  username: string;
  role: Role; // "admin"
  hotel_name: string | null;
  // Детальная структура адреса
  street: string | null;
  buildingNumber: string | null;
  apartmentNumber: string | null;
  country: string | null;
  province: string | null;
  postalCode: string | null;
  latitude: string | null;
  longitude: string | null;
  // Телефон разделен на код и номер
  phoneCountryCode: string | null;
  phoneNumber: string | null;
  full_name: string | null;
  logo_url: string | null;
  phone: string | null;
  email: string | null;
  isBlocked: boolean;
  checkInHour: number | null; // політики готелю на рівні admin
  checkOutHour: number | null;
  defaultWifiName: string | null; // Wi-Fi налаштування за замовчуванням
  defaultWifiPassword: string | null;
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
  editorsCount: number; // кількість редакторів
  editors: Array<{
    id: number;
    username: string;
    role: Role; // завжди "editor"
    full_name: string | null;
    phoneCountryCode: string | null;
    phoneNumber: string | null;
    phone: string | null; // Для обратной совместимости
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
  | "street" // Сортируем по улице вместо старого address
  | "username"
  | "createdAt"
  | "editorsCount"
  | "isBlocked";

export type SortDir = "asc" | "desc";

// Профиль редактора: информация о редакторе, об отеле и об админе
export interface EditorProfile {
  editor: {
    id: number;
    username: string;
    role: Role; // "editor"
    full_name: string | null;
    phoneCountryCode: string | null;
    phoneNumber: string | null;
    phone: string | null;
    email: string | null;
    isBlocked: boolean;
    createdAt: string;
    updatedAt: string;
  };
  hotel: {
    hotel_name: string | null;
    street: string | null;
    buildingNumber: string | null;
    apartmentNumber: string | null;
    country: string | null;
    province: string | null;
    postalCode: string | null;
    latitude: string | null;
    longitude: string | null;
    logo_url: string | null;
    checkInHour: number | null;
    checkOutHour: number | null;
  };
  admin: {
    id: number;
    username: string;
    full_name: string | null;
    phoneCountryCode: string | null;
    phoneNumber: string | null;
    phone: string | null;
    email: string | null;
  };
}
