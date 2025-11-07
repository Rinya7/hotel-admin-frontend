import type { Room } from "./rooms";

export type StayStatus = "booked" | "occupied" | "completed" | "cancelled";

export interface Stay {
  id: number;
  room: {
    id: number;
    roomNumber: string;
    status: "free" | "booked" | "occupied" | "cleaning";
  };
  mainGuestName: string;
  extraGuests?: string[];
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  balance: string | number;
  status: StayStatus;
  // Аудит: хто створив і хто змінював
  createdBy?: string;
  updatedBy?: string;
  updatedByRole?: "guest" | "admin" | "editor";
}

export interface CreateStayRequest {
  mainGuestName: string;
  extraGuestNames?: string[]; // исправлено: extraGuests -> extraGuestNames
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  status?: StayStatus; // по умолчанию можно отправлять "booked"
  balance?: string | number; // может быть строкой или числом
}

export interface UpdateStayStatusRequest {
  status: StayStatus; // например booked -> occupied -> completed/cancelled
  comment?: string | null;
}

// Операции с проживаниями
export interface CheckInRequest {
  comment?: string;
}

export interface CheckOutRequest {
  comment?: string;
}

export interface CancelStayRequest {
  comment?: string;
}

export interface CloseStayRequest {
  status: "completed" | "cancelled";
}

// Обновление проживания по датам
export interface UpdateStayByDatesRequest {
  mainGuestName?: string;
  extraGuestNames?: string[];
  newCheckIn?: string;
  newCheckOut?: string;
  balance?: string | number;
}

// Типы для today arrivals/departures (отличаются от обычного Stay)
export interface TodayStay {
  stayId: number;
  status: StayStatus;
  room: {
    id: number;
    number: string; // не roomNumber!
    floor: number;
  };
  mainGuestName: string;
  checkIn: string;
  checkOut: string;
}

// Історія змін статусів Stay
export interface StayStatusLog {
  id?: number;
  oldStatus: StayStatus;
  newStatus: StayStatus;
  changedAt: string;
  changedBy?: string | null;
  changedByRole?: "guest" | "admin" | "editor" | null;
  comment?: string | null;
  // Додаткові поля для універсального AuditLogViewer
  entityLabel?: string;
  entityLink?: string;
}

export interface StayRoomSyncResponse {
  message: string;
  stay: Stay;
  room: Room;
}
