// frontend/src/types/auth.ts
export type UserRole = "superadmin" | "admin" | "editor";

// Тіло запиту логіну
export interface LoginRequest {
  username: string;
  password: string;
}

// Відповідь логіну: профіль + токен (Варіант B)
export interface LoginPayload {
  token: string;
  username: string;
  role: UserRole;
  adminId?: number;
  hotelName?: string;
}

export interface LoginEnvelope {
  payload: LoginPayload; // ⬅️ те, що реально повертає бек
}

// Для зручності можемо використовувати той самий тип як UserProfile
export interface UserProfile extends LoginPayload {}
