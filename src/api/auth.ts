//src/api/auth.ts — логин
import http from "./http";
import type { LoginRequest, LoginEnvelope } from "@/types/auth";
import type {
  CreateEditorRequest,
  CreateEditorResponse,
  UpdateEditorRequest,
  UpdateEditorResponse,
} from "@/types/dto";

export async function loginApi(payload: LoginRequest): Promise<LoginEnvelope> {
  const { data } = await http.post<LoginEnvelope>("/auth/login", payload);
  return data;
}

export async function createEditor(
  payload: CreateEditorRequest
): Promise<CreateEditorResponse> {
  const { data } = await http.post<CreateEditorResponse>(
    "/auth/create-editor",
    payload
  );
  return data;
}

/**
 * Обновление данных редактора
 * @param username - имя пользователя редактора
 * @param payload - данные для обновления
 */
export async function updateEditor(
  username: string,
  payload: UpdateEditorRequest
): Promise<UpdateEditorResponse> {
  const { data } = await http.put<UpdateEditorResponse>(
    `/auth/editor/${username}`,
    payload
  );
  return data;
}

/**
 * Блокировка редактора (admin only, только своих редакторов)
 * @param username - имя пользователя редактора
 */
export async function blockEditor(username: string): Promise<{ message: string }> {
  const { data } = await http.put<{ message: string }>(
    `/auth/editor/${username}/block`
  );
  return data;
}

/**
 * Разблокировка редактора (admin only, только своих редакторов)
 * @param username - имя пользователя редактора
 */
export async function unblockEditor(username: string): Promise<{ message: string }> {
  const { data } = await http.put<{ message: string }>(
    `/auth/editor/${username}/unblock`
  );
  return data;
}

/**
 * Удаление пользователя (admin → своих редакторов; superadmin → любого)
 * @param username - имя пользователя для удаления
 */
export async function deleteEditor(username: string): Promise<{ message: string }> {
  const { data } = await http.delete<{ message: string }>(
    `/auth/delete/${username}`
  );
  return data;
}
