// frontend/src/types/entities.ts

// Статуси кімнати — рівно як у бекенді
export type RoomStatus = "free" | "occupied" | "cleaning";

// Статуси проживання (Stay) — як у документації
export type StayStatus = "booked" | "occupied" | "completed" | "cancelled";

export interface Room {
  id: number;
  roomNumber: string; // "101"
  floor: number;
  capacity: number;
  status: RoomStatus; // 'free' | 'occupied' | 'cleaning'
  wifiName?: string;
  qrBarUrl?: string;
  mapPosition?: string;
}

export interface StayGuest {
  id?: number;
  fullName: string;
  documentType?: string | null;
  documentNumber?: string | null;
  birthDate?: string | null;
  notes?: string | null;
}

export interface Stay {
  id: number;
  room: { id: number; roomNumber: string; status: RoomStatus }; // приклад для списків
  mainGuestName: string;
  checkIn: string; // ISO
  checkOut: string; // ISO
  balance: string; // або number, залежно від бекенда
  status: StayStatus;
  extraGuestNames?: string[];
  guests?: StayGuest[];
}
