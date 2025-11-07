// src/api/audit.ts — універсальні audit logs
import http from "./http";
import type { AuditLog } from "@/types/common";

export interface AuditLogsQuery {
  type?: "room" | "stay";
  user?: string;
  role?: "guest" | "admin" | "editor" | "system";
  from?: string; // ISO date string
  to?: string; // ISO date string
}

/**
 * Отримати audit logs з можливістю фільтрації
 * GET /audit/logs?type=room|stay&user=frontdesk-1&role=editor&from=2025-08-01&to=2025-09-01
 */
export async function getAuditLogs(
  params?: AuditLogsQuery
): Promise<AuditLog[]> {
  try {
    const queryParams = new URLSearchParams();
    if (params?.type) queryParams.append("type", params.type);
    if (params?.user) queryParams.append("user", params.user);
    if (params?.role) queryParams.append("role", params.role);
    if (params?.from) queryParams.append("from", params.from);
    if (params?.to) queryParams.append("to", params.to);

    const { data } = await http.get<AuditLog[]>(
      `/audit/logs${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
    );
    
    // Завжди повертаємо масив (навіть якщо порожній)
    return Array.isArray(data) ? data : [];
  } catch (error: unknown) {
    // Не логуємо помилки для порожньої бази (це нормальна ситуація)
    // Якщо помилка 404 або інша - повертаємо порожній масив
    // Frontend сам відобразить відповідне повідомлення
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as { response?: { status?: number; data?: unknown } };
      if (axiosError.response?.status === 404) {
        // Endpoint не знайдено - повертаємо порожній масив
        // Не логуємо, бо це може бути просто порожня база
        return [];
      }
      // Якщо сервер повернув дані з помилкою, але з полем logs (наприклад, 500 з logs: [])
      if (
        axiosError.response?.data &&
        typeof axiosError.response.data === "object" &&
        "logs" in axiosError.response.data &&
        Array.isArray(axiosError.response.data.logs)
      ) {
        return axiosError.response.data.logs as AuditLog[];
      }
      
      // Якщо статус 500, але є дані - спробуємо їх використати
      if (axiosError.response?.status === 500 && axiosError.response?.data) {
        const errorData = axiosError.response.data;
        if (typeof errorData === "object" && "logs" in errorData && Array.isArray(errorData.logs)) {
          return errorData.logs as AuditLog[];
        }
      }
    }
    
    // У всіх інших випадках повертаємо порожній масив
    return [];
  }
}

