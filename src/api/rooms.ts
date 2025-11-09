//src/api/rooms.ts — комнаты, статистика, доступность
import http from "./http";
import type {
  Room,
  CreateRoomRequest,
  UpdateRoomRequest,
  UpdateRoomStatusRequest,
  AvailabilityQuery,
  RoomAvailabilityItem,
  RoomsStats,
  BulkPolicyHoursRequest,
  BulkWiFiRequest,
  RoomHistoryResponse,
} from "@/types/rooms";

export async function getRooms(): Promise<Room[]> {
  const { data } = await http.get<Room[]>("/rooms");
  return data;
}

export async function createRoom(payload: CreateRoomRequest): Promise<Room> {
  const { data } = await http.post<Room>("/rooms", payload);
  return data;
}

export async function updateRoomByNumber(
  roomNumber: string,
  payload: UpdateRoomRequest
): Promise<Room> {
  const { data } = await http.put<Room>(
    `/rooms/number/${encodeURIComponent(roomNumber)}`,
    payload
  );
  return data;
}

export async function updateRoomStatus(
  roomNumber: string,
  payload: UpdateRoomStatusRequest
): Promise<{ message: string; number: string; status: Room["status"] }> {
  const { data } = await http.put(
    `/rooms/number/${encodeURIComponent(roomNumber)}/status`,
    payload
  );
  return data;
}

export async function getRoomsAvailability(
  q: AvailabilityQuery
): Promise<RoomAvailabilityItem[]> {
  const params = new URLSearchParams({ from: q.from, to: q.to });
  if (q.details) params.set("details", "1");
  const { data } = await http.get<RoomAvailabilityItem[]>(
    `/rooms/availability?${params.toString()}`
  );
  return data;
}

export async function getRoomsStats(): Promise<RoomsStats> {
  const { data } = await http.get<RoomsStats>("/rooms/stats");
  return {
    free: data?.free ?? 0,
    occupied: data?.occupied ?? 0,
    cleaning: data?.cleaning ?? 0,
  };
}

export async function updateBulkPolicyHours(
  payload: BulkPolicyHoursRequest
): Promise<{ message: string }> {
  const { data } = await http.put<{ message: string }>(
    "/rooms/policy-hours/bulk",
    payload
  );
  return data;
}

// Массовое обновление Wi-Fi данных для всех комнат
export async function updateBulkWiFi(
  payload: BulkWiFiRequest
): Promise<{ message: string }> {
  const { data } = await http.put<{ message: string }>(
    "/rooms/wifi/bulk",
    payload
  );
  return data;
}

// Отримати історію змін статусів кімнати
export async function fetchRoomHistory(
  roomNumber: string
): Promise<RoomHistoryResponse> {
  try {
    const { data } = await http.get<RoomHistoryResponse>(
      `/rooms/number/${encodeURIComponent(roomNumber)}/history`
    );
    return data;
  } catch (error) {
    // Не логуємо помилки для порожньої бази (це нормальна ситуація)
    // Повертаємо порожній результат
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as { response?: { status?: number } };
      // Логуємо тільки якщо це не 404 (може бути порожня база) або не 200
      if (
        axiosError.response &&
        axiosError.response.status !== 404 &&
        axiosError.response.status !== 200
      ) {
        console.warn(
          "Помилка при отриманні room history:",
          axiosError.response.status
        );
      }
    }
    // Повертаємо порожній результат (той самий формат, що й при успіху)
    return {
      roomId: 0,
      roomNumber,
      logs: [],
    };
  }
}

export async function markRoomCleaned(
  roomId: number,
  notes?: string
): Promise<{ message: string; room: Room }> {
  const { data } = await http.patch<{ message: string; room: Room }>(
    `/rooms/${roomId}/cleaned`,
    notes && notes.trim().length > 0 ? { notes } : undefined
  );
  return data;
}
