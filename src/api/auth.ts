//src/api/auth.ts — логин
import http from "./http";
import type { LoginRequest, LoginEnvelope } from "@/types/auth";

export async function loginApi(payload: LoginRequest): Promise<LoginEnvelope> {
  const { data } = await http.post<LoginEnvelope>("/auth/login", payload);
  return data;
}
