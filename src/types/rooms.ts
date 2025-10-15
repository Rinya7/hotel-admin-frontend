// Статус комнаты
export type RoomStatus = "free" | "booked" | "occupied";

export interface Room {
  id: number;
  roomNumber: string; // номер комнаты как строка, например "101"
  floor: number;
  capacity: number;
  status: RoomStatus;
  checkInHour?: number;
  checkOutHour?: number;
  wifiName?: string;
  wifiPassword?: string;
  qrBarUrl?: string;
  mapPosition?: string;
}

export interface CreateRoomRequest {
  roomNumber: string;
  floor: number;
  capacity: number;
}

export interface UpdateRoomRequest {
  floor?: number;
  capacity?: number;
  status?: RoomStatus;
  checkInHour?: number | null;
  checkOutHour?: number | null;
  wifiName?: string;
  wifiPassword?: string;
  qrBarUrl?: string;
  mapPosition?: string;
}

export interface UpdateRoomStatusRequest {
  status: RoomStatus;
}

export interface AvailabilityQuery {
  from: string; // YYYY-MM-DD
  to: string; // YYYY-MM-DD
  details?: boolean;
}

export interface RoomAvailabilityConflict {
  id: number;
  status: "booked" | "occupied" | "completed" | "cancelled";
  mainGuestName: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  balance: string | number;
}

export interface RoomAvailabilityItem {
  roomId: number;
  roomNumber: string;
  floor: number;
  capacity: number;
  currentStatus: RoomStatus;
  available: boolean;
  conflictsCount: number;
  conflicts?: RoomAvailabilityConflict[];
}

export interface RoomsStats {
  free: number;
  booked: number;
  occupied: number;
}

export interface BulkPolicyHoursRequest {
  checkInHour: number | null;
  checkOutHour: number | null;
}

// Тип для массового обновления Wi-Fi данных
export interface BulkWiFiRequest {
  wifiName: string;
  wifiPassword: string;
}
