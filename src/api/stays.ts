//src/api/stays.ts — проживание
import http from "./http";
import type {
  Stay,
  CreateStayRequest,
  CheckInRequest,
  CheckOutRequest,
  CloseStayRequest,
  UpdateStayByDatesRequest,
  UpdateStayStatusRequest,
  TodayStay,
  StayStatusLog,
  StayRoomSyncResponse,
  CancelStayRequest,
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
  try {
    const { data } = await http.get<Stay[]>("/rooms/stays/current");
    return Array.isArray(data) ? data : [];
  } catch (error) {
    // Не логуємо помилки для порожньої бази (це нормальна ситуація)
    // Логуємо тільки несподівані помилки
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as { response?: { status?: number } };
      // Якщо сервер повернув 200 з порожнім масивом - це нормально
      if (axiosError.response?.status === 200) {
        return [];
      }
      // Для інших помилок логуємо тільки якщо це не 500 (може бути порожня база)
      if (axiosError.response && axiosError.response.status !== 500) {
        console.warn(
          "Помилка при отриманні current stays:",
          axiosError.response.status
        );
      }
    }
    // Повертаємо порожній масив замість викидання помилки
    return [];
  }
}

// Создание проживания для комнаты
export async function createStayForRoom(
  roomNumber: string,
  payload: CreateStayRequest
): Promise<Stay> {
  // Бэкенд возвращает { message: string, stay: Stay }
  const { data } = await http.post<{ message: string; stay: Stay }>(
    `/rooms/number/${encodeURIComponent(roomNumber)}/stays`,
    payload
  );
  return data.stay;
}

// Ручной check-in (booked -> occupied)
export async function checkInStay(
  id: number,
  payload: CheckInRequest
): Promise<StayRoomSyncResponse> {
  const { data } = await http.patch<StayRoomSyncResponse>(
    `/stays/${id}/checkin`,
    payload
  );
  return data;
}

// Ручной check-out (occupied -> completed)
export async function checkOutStay(
  id: number,
  payload?: CheckOutRequest
): Promise<StayRoomSyncResponse> {
  const { data } = await http.patch<StayRoomSyncResponse>(
    `/stays/${id}/checkout`,
    payload
  );
  return data;
}

// Отмена бронирования (booked -> cancelled)
export async function cancelStay(
  id: number,
  payload?: CancelStayRequest
): Promise<StayRoomSyncResponse> {
  const { data } = await http.patch<StayRoomSyncResponse>(
    `/stays/${id}/cancel`,
    payload
  );
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
  try {
    const { data } = await http.get<{ count: number; items: TodayStay[] }>(
      "/stays/today/arrivals"
    );
    return Array.isArray(data?.items) ? data.items : [];
  } catch (error) {
    // Не логуємо помилки для порожньої бази (це нормальна ситуація)
    // Якщо сервер повернув помилку з полем items - використовуємо його
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response?: { status?: number; data?: { items?: TodayStay[] } };
      };
      if (Array.isArray(axiosError.response?.data?.items)) {
        return axiosError.response.data.items;
      }
      // Логуємо тільки якщо це не 500 (може бути порожня база) або не 200
      if (
        axiosError.response &&
        axiosError.response.status !== 500 &&
        axiosError.response.status !== 200
      ) {
        console.warn(
          "Помилка при отриманні arrivals today:",
          axiosError.response.status
        );
      }
    }
    // Повертаємо порожній масив замість викидання помилки
    return [];
  }
}

// Сегодняшние выезды
export async function getTodayDepartures(): Promise<TodayStay[]> {
  try {
    const { data } = await http.get<{ count: number; items: TodayStay[] }>(
      "/stays/today/departures"
    );
    return Array.isArray(data?.items) ? data.items : [];
  } catch (error) {
    // Не логуємо помилки для порожньої бази (це нормальна ситуація)
    // Якщо сервер повернув помилку з полем items - використовуємо його
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response?: { status?: number; data?: { items?: TodayStay[] } };
      };
      if (Array.isArray(axiosError.response?.data?.items)) {
        return axiosError.response.data.items;
      }
      // Логуємо тільки якщо це не 500 (може бути порожня база) або не 200
      if (
        axiosError.response &&
        axiosError.response.status !== 500 &&
        axiosError.response.status !== 200
      ) {
        console.warn(
          "Помилка при отриманні departures today:",
          axiosError.response.status
        );
      }
    }
    // Повертаємо порожній масив замість викидання помилки
    return [];
  }
}

// Обновление проживания по датам
export async function updateStayByDates(
  roomNumber: string,
  checkIn: string,
  checkOut: string,
  payload: UpdateStayByDatesRequest
): Promise<Stay> {
  const params = new URLSearchParams({ checkIn, checkOut });
  const { data } = await http.put<{ message: string; stay: Stay }>(
    `/rooms/number/${encodeURIComponent(
      roomNumber
    )}/stays?${params.toString()}`,
    payload
  );
  return data.stay;
}

// Обновление статуса проживания (PUT /stays/:id/status)
// Автоматически синхронизирует статус комнаты
export async function updateStayStatus(
  id: number,
  payload: UpdateStayStatusRequest
): Promise<{
  message: string;
  stay: Stay;
  room: { id: number; roomNumber: string; status: string };
  logs: StayStatusLog[];
}> {
  const { data } = await http.put<{
    message: string;
    stay: Stay;
    room: { id: number; roomNumber: string; status: string };
    logs: StayStatusLog[];
  }>(`/stays/${id}/status`, payload);
  return data;
}

// Поиск проживаний по имени гостя или пользователю
export async function searchStays(params: {
  guest?: string;
  changedBy?: string;
}): Promise<Stay[]> {
  const queryParams = new URLSearchParams();
  if (params.guest) queryParams.append("guest", params.guest);
  if (params.changedBy) queryParams.append("changedBy", params.changedBy);

  const { data } = await http.get<Stay[]>(
    `/stays/search?${queryParams.toString()}`
  );
  return data;
}

// Отримати проживання за ID
export async function getStayById(stayId: number): Promise<Stay> {
  const { data } = await http.get<Stay>(`/stays/${stayId}`);
  return data;
}

// Отримати історію змін статусів проживання
export async function fetchStayHistory(stayId: number): Promise<{
  stayId: number;
  mainGuestName: string;
  logs: StayStatusLog[];
}> {
  const { data } = await http.get<{
    stayId: number;
    mainGuestName: string;
    logs: StayStatusLog[];
  }>(`/stays/${stayId}/history`);
  return data;
}
