//типи для створення/оновлення
// src/types/dto.ts

// --- AUTH DTOs ---
export interface CreateAdminRequest {
  username: string;
  password: string;
  confirmPassword: string;
  hotel_name: string;
  // Детальная структура адреса
  street: string; // Обязательное поле
  buildingNumber?: string | null;
  apartmentNumber?: string | null;
  country?: string | null; // Код страны (ISO 3166-1 alpha-2)
  province?: string | null;
  postalCode?: string | null;
  latitude?: string | number | null; // Координаты могут быть строкой или числом (автоматически из Google)
  longitude?: string | number | null;
  full_name?: string | null;
  // Телефон разделен на код страны и номер
  phoneCountryCode?: string | null; // Например, +39
  phoneNumber?: string | null;
  phone?: string | null; // Для обратной совместимости
  email?: string | null;
  logo_url?: string | null;
  checkInHour?: number | null;
  checkOutHour?: number | null;
  defaultWifiName?: string | null;
  defaultWifiPassword?: string | null;
}

export interface CreateAdminResponse {
  message: string;
  adminId: number;
  policy: {
    checkInHour: number;
    checkOutHour: number;
  };
}

export interface CreateEditorRequest {
  username: string;
  password: string;
  confirmPassword: string;
  full_name?: string | null;
  phone?: string | null;
  phoneCountryCode?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
}

export interface CreateEditorResponse {
  message: string;
  token: string;
}

// Оновлення даних готелю (супер-адмін)
// Усі поля опційні — редагуємо тільки те, що передали
export interface UpdateHotelAdminRequest {
  hotel_name?: string;
  // Детальная структура адреса
  street?: string | null;
  buildingNumber?: string | null;
  apartmentNumber?: string | null;
  country?: string | null;
  province?: string | null;
  postalCode?: string | null;
  latitude?: string | number | null;
  longitude?: string | number | null;
  full_name?: string | null;
  phoneCountryCode?: string | null;
  phoneNumber?: string | null;
  phone?: string | null; // Для обратной совместимости
  email?: string | null;
  logo_url?: string | null;
  checkInHour?: number | null;
  checkOutHour?: number | null;
  defaultWifiName?: string | null;
  defaultWifiPassword?: string | null;
}

export interface UpdateHotelAdminResponse {
  message: string;
  admin: {
    id: number;
    username: string;
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
    full_name: string | null;
    phoneCountryCode: string | null;
    phoneNumber: string | null;
    phone: string | null; // Для обратной совместимости
    email: string | null;
    logo_url: string | null;
    checkInHour: number | null;
    checkOutHour: number | null;
    wifiName: string | null;
    wifiPassword: string | null;
    updatedAt: string;
  };
}
