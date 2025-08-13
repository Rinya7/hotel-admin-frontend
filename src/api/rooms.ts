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
} from "../types/rooms";

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
  return data;
}
