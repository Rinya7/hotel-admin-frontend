// src/api/guest.ts
// API функції для роботи з гостьовим доступом

import http from "./http";

/**
 * Відповідь при генерації токену доступу для гостя
 */
export interface GenerateTokenResponse {
  message: string;
  token: string;
  url: string;
}

/**
 * Інформація про токен доступу
 */
export interface GuestAccessTokenInfo {
  id: number;
  token: string;
  createdAt: string;
  expiresAt: string | null;
  revokedAt: string | null;
  lastUsedAt: string | null;
}

/**
 * Генерувати або отримати лінк доступу для гостя
 * @param stayId - ID проживання
 * @returns Токен та URL для доступу
 */
export async function generateGuestAccessLink(
  stayId: number
): Promise<GenerateTokenResponse> {
  const { data } = await http.post<GenerateTokenResponse>(
    `/guest/stays/${stayId}/link`
  );
  return data;
}

/**
 * Отримати список активних токенів для проживання
 * @param stayId - ID проживання
 * @returns Список токенів
 */
export async function getGuestAccessTokens(
  stayId: number
): Promise<GuestAccessTokenInfo[]> {
  const { data } = await http.get<GuestAccessTokenInfo[]>(
    `/guest/stays/${stayId}/tokens`
  );
  return data;
}




