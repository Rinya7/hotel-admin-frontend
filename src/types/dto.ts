//типи для створення/оновлення
// src/types/dto.ts

// --- AUTH DTOs ---
export interface CreateAdminRequest {
  username: string;
  password: string;
  confirmPassword: string;
  hotel_name: string;
  address: string;
  full_name?: string | null;
  phone?: string | null;
  email?: string | null;
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
  address?: string;
  full_name?: string | null;
  phone?: string | null;
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
    address: string | null;
    full_name: string | null;
    phone: string | null;
    email: string | null;
    logo_url: string | null;
    checkInHour: number | null;
    checkOutHour: number | null;
    wifiName: string | null;
    wifiPassword: string | null;
    updatedAt: string;
  };
}
