// frontend/src/types/entities.ts

// Статуси кімнати — рівно як у бекенді
export type RoomStatus = "free" | "booked" | "occupied" | "cleaning";

// Статуси проживання (Stay) — як у документації
export type StayStatus = "booked" | "occupied" | "completed" | "cancelled";

export interface Room {
  id: number;
  roomNumber: string; // "101"
  floor: number;
  capacity: number;
  status: RoomStatus; // 'free' | 'booked' | 'occupied' | 'cleaning'
  wifiName?: string;
  qrBarUrl?: string;
  mapPosition?: string;
}

export interface Stay {
  id: number;
  room: { id: number; roomNumber: string; status: RoomStatus }; // приклад для списків
  mainGuestName: string;
  checkIn: string; // ISO
  checkOut: string; // ISO
  balance: string; // або number, залежно від бекенда
  status: StayStatus;
}
