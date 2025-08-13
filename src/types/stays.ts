export type StayStatus = "booked" | "occupied" | "completed" | "cancelled";

export interface Stay {
  id: number;
  room: {
    id: number;
    roomNumber: string;
    status: "free" | "booked" | "occupied";
  };
  mainGuestName: string;
  extraGuests?: string[];
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  balance: string | number;
  status: StayStatus;
}

export interface CreateStayRequest {
  roomNumber: string; // по нашей логике создаём stay по номеру комнаты
  mainGuestName: string;
  extraGuests?: string[];
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  status?: StayStatus; // по умолчанию можно отправлять "booked"
  balance?: number;
}

export interface UpdateStayStatusRequest {
  status: StayStatus; // например booked -> occupied -> completed/cancelled
}
