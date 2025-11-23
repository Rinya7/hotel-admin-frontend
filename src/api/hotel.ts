// API для получения информации об отеле и редакторах
import http from "./http";
import type { PublicAdminUser, EditorProfile } from "@/types/hotel";

/**
 * Получить информацию о текущем админе (отеле) и его редакторах
 * GET /auth/profile - для админа возвращает полную информацию об админе и его редакторах
 * Для редактора возвращает EditorProfile с информацией о редакторе, об отеле и об админе
 */
export async function getHotelProfile(): Promise<PublicAdminUser> {
  const { data } = await http.get<PublicAdminUser>("/auth/profile");
  return data;
}

/**
 * Получить профиль редактора (информация о редакторе, об отеле и об админе)
 * GET /auth/profile - для редактора возвращает EditorProfile
 */
export async function getEditorProfile(): Promise<EditorProfile> {
  const { data } = await http.get<EditorProfile>("/auth/profile");
  return data;
}

/**
 * Получить список редакторов (для обратной совместимости)
 * GET /auth/users - для админа возвращает только список редакторов
 */
export async function getEditors(): Promise<PublicAdminUser["editors"]> {
  const { data } = await http.get<PublicAdminUser["editors"]>("/auth/users");
  return data;
}

