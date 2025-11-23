//src/api/stays.ts — проживание
import http from "./http";
import type {
  Stay,
  StayListItem,
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
  StayNeedsAction,
  ResolveNoShowRequest,
  ResolveCheckInNowRequest,
  ResolveCheckOutNowRequest,
  ResolveEditDatesRequest,
  ResolveExtendStayRequest,
} from "@/types/stays";

// История проживаний по комнате
export async function listStaysByRoom(roomNumber: string): Promise<Stay[]> {
  try {
    const { data } = await http.get<Stay[]>(
      `/rooms/number/${encodeURIComponent(roomNumber)}/stays`
    );
    return data;
  } catch (error) {
    console.error(`[API] listStaysByRoom error for room ${roomNumber}:`, error);
    throw error;
  }
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
export async function getStaysByStatus(status: string): Promise<StayListItem[]> {
  const { data } = await http.get(
    `/stays/status/${status}`
  );

  if (data && Array.isArray((data as { items?: unknown }).items)) {
    const { items } = data as { items: StayListItem[] };
    return items ?? [];
  }

  if (Array.isArray(data)) {
    return (data as Stay[]).map((stay) => ({
      stayId: stay.id,
      status: stay.status,
      room: {
        id: stay.room.id,
        number: (stay.room as { roomNumber?: string; number?: string }).roomNumber ??
          (stay.room as { number?: string }).number ??
          "?",
        floor: (stay.room as { floor?: number }).floor ?? 0,
      },
      mainGuestName: stay.mainGuestName,
      checkIn: stay.checkIn,
      checkOut: stay.checkOut,
      balance: stay.balance,
    }));
  }

  return [];
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
  try {
    const { data } = await http.get<Stay>(`/stays/${stayId}`);
    return data;
  } catch (error) {
    console.error(`[API] getStayById error for stay ${stayId}:`, error);
    throw error;
  }
}

// Отримати історію змін статусів проживання
export async function fetchStayHistory(stayId: number): Promise<{
  stayId: number;
  mainGuestName: string;
  logs: StayStatusLog[];
}> {
  try {
    const { data } = await http.get<{
      stayId: number;
      mainGuestName: string;
      logs: StayStatusLog[];
    }>(`/stays/${stayId}/history`);
    return data;
  } catch (error) {
    console.error(`[API] fetchStayHistory error for stay ${stayId}:`, error);
    throw error;
  }
}

// Отримати список stays, які потребують дії (needsAction = true)
export async function getNeedsActionStays(): Promise<StayNeedsAction[]> {
  const { data } = await http.get<{ count: number; items: StayNeedsAction[] }>(
    "/stays/needs-action"
  );
  return Array.isArray(data?.items) ? data.items : [];
}

// Тестовий endpoint для ручного запуску перевірки просрочених stays
export async function testAutoCheck(): Promise<{
  message: string;
  stats: { missedCheckIns: number; missedCheckOuts: number; total: number };
}> {
  const { data } = await http.post<{
    message: string;
    stats: { missedCheckIns: number; missedCheckOuts: number; total: number };
  }>("/stays/test-auto-check");
  return data;
}

// Скасувати stay (зміна статусу на cancelled)
export async function resolveNoShow(
  stayId: number,
  payload?: ResolveNoShowRequest
): Promise<StayRoomSyncResponse> {
  const { data } = await http.post<StayRoomSyncResponse>(
    `/stays/${stayId}/resolve/no-show`,
    payload ?? {}
  );
  return data;
}

// Виконати check-in зараз (occupied)
export async function resolveCheckInNow(
  stayId: number,
  payload?: ResolveCheckInNowRequest
): Promise<StayRoomSyncResponse> {
  const { data } = await http.post<StayRoomSyncResponse>(
    `/stays/${stayId}/resolve/check-in-now`,
    payload ?? {}
  );
  return data;
}

// Виконати check-out зараз (completed)
export async function resolveCheckOutNow(
  stayId: number,
  payload?: ResolveCheckOutNowRequest
): Promise<StayRoomSyncResponse> {
  const { data } = await http.post<StayRoomSyncResponse>(
    `/stays/${stayId}/resolve/check-out-now`,
    payload ?? {}
  );
  return data;
}

// Оновити дати stay (check-in або check-out)
export async function resolveEditDates(
  stayId: number,
  payload: ResolveEditDatesRequest
): Promise<{ message: string; stay: Stay }> {
  const { data } = await http.post<{ message: string; stay: Stay }>(
    `/stays/${stayId}/resolve/edit-dates`,
    payload
  );
  return data;
}

// Продовжити stay (оновлює checkOut)
export async function resolveExtendStay(
  stayId: number,
  payload: ResolveExtendStayRequest
): Promise<{ message: string; stay: Stay }> {
  const { data } = await http.post<{ message: string; stay: Stay }>(
    `/stays/${stayId}/resolve/extend-stay`,
    payload
  );
  return data;
}
