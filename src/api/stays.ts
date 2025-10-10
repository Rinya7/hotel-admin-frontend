//src/api/stays.ts — проживание
import http from "./http";
import type {
  Stay,
  CreateStayRequest,
  UpdateStayStatusRequest,
} from "@/types/stays";

export async function listStaysByRoom(roomNumber: string): Promise<Stay[]> {
  const { data } = await http.get<Stay[]>(`/stays`, { params: { roomNumber } });
  return data;
}

export async function getCurrentStays(): Promise<Stay[]> {
  const { data } = await http.get<Stay[]>("/stays/current");
  return data;
}

export async function createStay(payload: CreateStayRequest): Promise<Stay> {
  const { data } = await http.post<Stay>("/stays", payload);
  return data;
}

export async function updateStayStatus(
  id: number,
  payload: UpdateStayStatusRequest
): Promise<Stay> {
  const { data } = await http.put<Stay>(`/stays/${id}/status`, payload);
  return data;
}
