import type { Room } from "./rooms";

export type StayStatus = "booked" | "occupied" | "completed" | "cancelled";

export interface StayGuest {
  id?: number;
  fullName: string;
  documentType?: string | null;
  documentNumber?: string | null;
  birthDate?: string | null;
  notes?: string | null;
}

export interface StayGuestPayload {
  fullName: string;
  documentType?: string | null;
  documentNumber?: string | null;
  birthDate?: string | null;
  notes?: string | null;
}

export interface Stay {
  id: number;
  room: {
    id: number;
    roomNumber: string;
    status: Room["status"];
  };
  mainGuestName: string;
  extraGuestNames?: string[];
  guests?: StayGuest[];
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  balance: string | number;
  status: StayStatus;
  createdBy?: string;
  updatedBy?: string;
  updatedByRole?: "guest" | "admin" | "editor";
}

export interface CreateStayRequest {
  mainGuestName: string;
  extraGuestNames?: string[];
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  status?: StayStatus;
  balance?: string | number;
}

export interface UpdateStayStatusRequest {
  status: StayStatus;
  comment?: string | null;
}

export interface CheckInRequest {
  comment?: string;
  guests: StayGuestPayload[];
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

export interface UpdateStayByDatesRequest {
  mainGuestName?: string;
  extraGuestNames?: string[];
  newCheckIn?: string;
  newCheckOut?: string;
  balance?: string | number;
}

export interface TodayStay {
  stayId: number;
  status: StayStatus;
  room: {
    id: number;
    number: string;
    floor: number;
  };
  mainGuestName: string;
  checkIn: string;
  checkOut: string;
}

export interface StayListItem {
  stayId: number;
  status: StayStatus;
  room: {
    id: number;
    number: string;
    floor: number;
  };
  mainGuestName: string;
  checkIn: string;
  checkOut: string;
  balance: string | number;
}

export interface StayStatusLog {
  id?: number;
  oldStatus: StayStatus;
  newStatus: StayStatus;
  changedAt: string;
  changedBy?: string | null;
  changedByRole?: "guest" | "admin" | "editor" | null;
  comment?: string | null;
  entityLabel?: string;
  entityLink?: string;
}

export interface StayRoomSyncResponse {
  message: string;
  stay: Stay;
  room: Room;
}

/**
 * Stay, який потребує дії від адміністратора.
 * Використовується для відображення просрочених check-in/check-out.
 */
export interface StayNeedsAction {
  id: number;
  roomNumber: string;
  mainGuestName: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  status: "booked" | "occupied"; // не змінюється
  needsAction: true;
  needsActionReason: "missed_checkin" | "missed_checkout";
}

export interface ResolveNoShowRequest {
  comment?: string;
}

export interface ResolveCheckInNowRequest {
  comment?: string;
}

export interface ResolveCheckOutNowRequest {
  comment?: string;
}

export interface ResolveEditDatesRequest {
  checkIn?: string; // YYYY-MM-DD
  checkOut?: string; // YYYY-MM-DD
}

export interface ResolveExtendStayRequest {
  checkOut: string; // YYYY-MM-DD
}

