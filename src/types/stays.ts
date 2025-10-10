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
  mainGuestName: string;
  extraGuestNames?: string[]; // исправлено: extraGuests -> extraGuestNames
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  status?: StayStatus; // по умолчанию можно отправлять "booked"
  balance?: string | number; // может быть строкой или числом
}

export interface UpdateStayStatusRequest {
  status: StayStatus; // например booked -> occupied -> completed/cancelled
}

// Операции с проживаниями
export interface CheckInRequest {
  force?: boolean;
}

export interface CheckOutRequest {
  force?: boolean;
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
