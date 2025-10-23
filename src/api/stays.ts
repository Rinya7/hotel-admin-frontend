//src/api/stays.ts — проживание
import http from "./http";
import type {
  Stay,
  CreateStayRequest,
  CheckInRequest,
  CheckOutRequest,
  CloseStayRequest,
  UpdateStayByDatesRequest,
  TodayStay,
} from "@/types/stays";

// История проживаний по комнате
export async function listStaysByRoom(roomNumber: string): Promise<Stay[]> {
  const { data } = await http.get<Stay[]>(
    `/rooms/number/${encodeURIComponent(roomNumber)}/stays`
  );
  return data;
}

// Все активные проживания (booked/occupied)
export async function getCurrentStays(): Promise<Stay[]> {
  const { data } = await http.get<Stay[]>("/rooms/stays/current");
  return data;
}

// Создание проживания для комнаты
export async function createStayForRoom(
  roomNumber: string,
  payload: CreateStayRequest
): Promise<Stay> {
  const { data } = await http.post<Stay>(
    `/rooms/number/${encodeURIComponent(roomNumber)}/stays`,
    payload
  );
  return data;
}

// Ручной check-in (booked -> occupied)
export async function checkInStay(
  id: number,
  payload?: CheckInRequest
): Promise<Stay> {
  const { data } = await http.post<Stay>(`/stays/${id}/check-in`, payload);
  return data;
}

// Ручной check-out (occupied -> completed)
export async function checkOutStay(
  id: number,
  payload?: CheckOutRequest
): Promise<Stay> {
  const { data } = await http.post<Stay>(`/stays/${id}/check-out`, payload);
  return data;
}

// Отмена бронирования (booked -> cancelled)
export async function cancelStay(id: number): Promise<Stay> {
  const { data } = await http.post<Stay>(`/stays/${id}/cancel`);
  return data;
}

// Закрытие проживания по датам (completed/cancelled)
export async function closeStayByDates(
  roomNumber: string,
  checkIn: string,
  checkOut: string,
  payload: CloseStayRequest
): Promise<Stay> {
  const params = new URLSearchParams({ checkIn, checkOut });
  const { data } = await http.put<Stay>(
    `/rooms/number/${encodeURIComponent(
      roomNumber
    )}/stays/close?${params.toString()}`,
    payload
  );
  return data;
}

// Список проживаний по статусу
export async function getStaysByStatus(status: string): Promise<Stay[]> {
  const { data } = await http.get<Stay[]>(`/stays/status/${status}`);
  return data;
}

// Сегодняшние заезды
export async function getTodayArrivals(): Promise<TodayStay[]> {
  const { data } = await http.get<{ count: number; items: TodayStay[] }>(
    "/stays/today/arrivals"
  );
  return data.items;
}

// Сегодняшние выезды
export async function getTodayDepartures(): Promise<TodayStay[]> {
  const { data } = await http.get<{ count: number; items: TodayStay[] }>(
    "/stays/today/departures"
  );
  return data.items;
}

// Обновление проживания по датам
export async function updateStayByDates(
  roomNumber: string,
  checkIn: string,
  checkOut: string,
  payload: UpdateStayByDatesRequest
): Promise<Stay> {
  const params = new URLSearchParams({ checkIn, checkOut });
  const { data } = await http.put<Stay>(
    `/rooms/number/${encodeURIComponent(
      roomNumber
    )}/stays?${params.toString()}`,
    payload
  );
  return data;
}
