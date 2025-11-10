//src/api/auth.ts — логин
import http from "./http";
import type { LoginRequest, LoginEnvelope } from "@/types/auth";
import type {
  CreateEditorRequest,
  CreateEditorResponse,
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
