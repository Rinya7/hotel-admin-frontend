// Універсальний тип для audit log
export interface AuditLog {
  type?: "room" | "stay"; // тип логу (для універсального endpoint)
  oldStatus?: string;
  newStatus?: string;
  changedAt: string;
  changedBy?: string | null;
  changedByRole?: string | null;
  entityLabel?: string; // наприклад: ім'я гостя або номер кімнати
  entityLink?: string | null; // посилання для переходу
  comment?: string | null;
  stayCheckIn?: string | null;
  stayCheckOut?: string | null;
  roomNumber?: string | null;
  stayId?: number | null;
}

