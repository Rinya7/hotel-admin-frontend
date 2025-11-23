# API Documentation - Hotel Management System

## Обзор

Данная документация описывает все API endpoints, используемые в admin-frontend для взаимодействия с hotel-backend.

**Base URL:** `http://localhost:3000` (настраивается через `VITE_API_URL`)

## Аутентификация

### POST /auth/login

**Описание:** Вход в систему (admin | editor)

**Request Body:**

```typescript
{
  username: string;
  password: string;
}
```

**Response:**

```typescript
{
  payload: {
    token: string;        // JWT (48h)
    username: string;
    role: "superadmin" | "admin" | "editor";
    adminId: number;      // ID владельца отеля
    hotelName?: string;   // Название отеля (для admin)
    policy?: {            // Политика времени отеля
      checkInHour: number;
      checkOutHour: number;
    };
  }
}
```

**Использование в коде:**

```typescript
import { loginApi } from "@/api/auth";
const result = await loginApi({
  username: "hotel-aurora",
  password: "S3cure!Pass",
});
```

---

## Управление комнатами

### GET /rooms

**Описание:** Список комнат текущего отеля

**Headers:** `Authorization: Bearer <token>`

**Response:** `Room[]`

**Использование:**

```typescript
import { getRooms } from "@/api/rooms";
const rooms = await getRooms();
```

### POST /rooms

**Описание:** Создание новой комнаты

**Request Body:**

```typescript
{
  roomNumber: string;
  floor: number;
  capacity: number;
  checkInHour?: number;     // 0-23, опционально
  checkOutHour?: number;    // 0-23, опционально
  wifiName?: string;
  wifiPassword?: string;
  qrBarUrl?: string;
  mapPosition?: string;
}
```

**Использование:**

```typescript
import { createRoom } from "@/api/rooms";
const newRoom = await createRoom({
  roomNumber: "101",
  floor: 1,
  capacity: 2,
});
```

### PUT /rooms/number/{roomNumber}

**Описание:** Полное редактирование комнаты по номеру

**Parameters:** `roomNumber` - номер комнаты

**Request Body:** `UpdateRoomRequest` (все поля опциональны)

**Использование:**

```typescript
import { updateRoomByNumber } from "@/api/rooms";
const updated = await updateRoomByNumber("101", {
  floor: 2,
  capacity: 4,
  wifiName: "HotelWiFi",
});
```

### PUT /rooms/number/{roomNumber}/status

**Описание:** Ручное изменение статуса комнаты

**Request Body:**

```typescript
{
  status: "free" | "booked" | "occupied";
}
```

**Использование:**

```typescript
import { updateRoomStatus } from "@/api/rooms";
await updateRoomStatus("101", { status: "occupied" });
```

### GET /rooms/stats

**Описание:** Статистика по статусам комнат

**Response:**

```typescript
{
  free: number;
  booked: number;
  occupied: number;
}
```

### GET /rooms/status/{status}

**Описание:** Получить комнаты по статусу

**Parameters:** `status` - "free" | "booked" | "occupied"

**Response:** `Room[]`

**Использование:**

```typescript
// Примечание: функция может быть добавлена в будущем
// Пока можно использовать прямой запрос:
import http from "@/api/http";
const { data } = await http.get<Room[]>("/rooms/status/occupied");
```

### PUT /rooms/policy-hours/bulk

**Описание:** Массовое задание времени заселения/выезда для всех комнат отеля

**Request Body:**

```typescript
{
  checkInHour: number | null; // 0-23 или null (следовать дефолтам отеля)
  checkOutHour: number | null; // 0-23 или null (следовать дефолтам отеля)
}
```

**Использование:**

```typescript
import { updateBulkPolicyHours } from "@/api/rooms";
await updateBulkPolicyHours({
  checkInHour: 15, // 15:00
  checkOutHour: 11, // 11:00
});
```

### PUT /rooms/wifi/bulk

**Описание:** Массовое задание WiFi данных для всех комнат отеля

**Request Body:**

```typescript
{
  wifiName: string | null;      // Название WiFi сети или null (оставить как есть)
  wifiPassword: string | null;   // Пароль WiFi или null (оставить как есть)
}
```

**Использование:**

```typescript
import { updateBulkWiFi } from "@/api/rooms";
await updateBulkWiFi({
  wifiName: "Hotel_Free_WiFi",
  wifiPassword: "SecurePassword123",
});
```

### GET /rooms/availability

**Описание:** Доступность всех комнат в диапазоне дат

**Query Parameters:**

- `from` (required): дата начала (YYYY-MM-DD)
- `to` (required): дата окончания (YYYY-MM-DD)
- `details` (optional): "1" для получения детальной информации о конфликтах

**Использование:**

```typescript
import { getRoomsAvailability } from "@/api/rooms";
const availability = await getRoomsAvailability({
  from: "2025-01-15",
  to: "2025-01-20",
  details: true,
});
```

### GET /rooms/number/{roomNumber}/availability

**Описание:** Доступность одной комнаты в диапазоне дат

**Parameters:** `roomNumber` - номер комнаты

**Query Parameters:**

- `from` (required): дата начала (YYYY-MM-DD)
- `to` (required): дата окончания (YYYY-MM-DD)

**Использование:**

```typescript
// Примечание: функция может быть добавлена в будущем
// Пока можно использовать прямой запрос:
import http from "@/api/http";
const params = new URLSearchParams({ from: "2025-01-15", to: "2025-01-20" });
const { data } = await http.get(`/rooms/number/101/availability?${params}`);
```

---

## Управление проживаниями (Stays)

### GET /rooms/number/{roomNumber}/stays

**Описание:** История проживаний по комнате

**Parameters:** `roomNumber` - номер комнаты

**Query Parameters (опционально):**

- `from`: дата начала фильтра (YYYY-MM-DD)
- `to`: дата окончания фильтра (YYYY-MM-DD)

**Использование:**

```typescript
import { listStaysByRoom } from "@/api/stays";
const stays = await listStaysByRoom("101");
```

### POST /rooms/number/{roomNumber}/stays

**Описание:** Создание бронирования/заселения для комнаты

**Request Body:**

```typescript
{
  mainGuestName: string;
  extraGuestNames?: string[];    // Дополнительные гости
  checkIn: string;               // YYYY-MM-DD
  checkOut: string;              // YYYY-MM-DD
  balance?: string | number;     // Баланс
  status?: "booked" | "occupied"; // По умолчанию "booked"
}
```

**Использование:**

```typescript
import { createStayForRoom } from "@/api/stays";
const newStay = await createStayForRoom("101", {
  mainGuestName: "John Doe",
  extraGuestNames: ["Jane Doe"],
  checkIn: "2025-01-15",
  checkOut: "2025-01-20",
  status: "booked",
  balance: 500,
});
```

### PUT /rooms/number/{roomNumber}/stays

**Описание:** Редактирование проживания по датам заезда/выезда

**Parameters:** `roomNumber` - номер комнаты

**Query Parameters:**
- `checkIn`: дата заезда (YYYY-MM-DD) - для идентификации проживания
- `checkOut`: дата выезда (YYYY-MM-DD) - для идентификации проживания

**Request Body:** `UpdateStayRequest` (все поля опциональны)

```typescript
{
  mainGuestName?: string;
  extraGuestNames?: string[];
  checkIn?: string;              // YYYY-MM-DD (новая дата заезда)
  checkOut?: string;             // YYYY-MM-DD (новая дата выезда)
  balance?: string | number;
  status?: "booked" | "occupied";
}
```

**Использование:**

```typescript
import { updateStayByDates } from "@/api/stays";
const updated = await updateStayByDates(
  "101",                    // roomNumber
  "2025-01-15",           // Исходная дата заезда (для поиска)
  "2025-01-20",           // Исходная дата выезда (для поиска)
  {                        // Новые данные
    mainGuestName: "Jane Smith",
    checkIn: "2025-01-16",  // Новая дата заезда
    checkOut: "2025-01-21", // Новая дата выезда
    balance: 600,
  }
);
```

### GET /rooms/stays/current

**Описание:** Все активные проживания (booked/occupied)

**Использование:**

```typescript
import { getCurrentStays } from "@/api/stays";
const currentStays = await getCurrentStays();
```

### POST /stays/{id}/check-in

**Описание:** Ручной check-in (booked → occupied)

**Request Body (опционально):**

```typescript
{
  force?: boolean;  // Принудительный check-in
}
```

**Использование:**

```typescript
import { checkInStay } from "@/api/stays";
const updated = await checkInStay(123);
```

### POST /stays/{id}/check-out

**Описание:** Ручной check-out (occupied → completed)

**Request Body (опционально):**

```typescript
{
  force?: boolean;  // Принудительный check-out
}
```

**Использование:**

```typescript
import { checkOutStay } from "@/api/stays";
const updated = await checkOutStay(123);
```

### POST /stays/{id}/cancel

**Описание:** Отмена бронирования (booked → cancelled)

**Использование:**

```typescript
import { cancelStay } from "@/api/stays";
const updated = await cancelStay(123);
```

### PUT /rooms/number/{roomNumber}/stays/close

**Описание:** Закрытие проживания по датам (completed/cancelled)

**Query Parameters:**

- `checkIn`: дата заезда (YYYY-MM-DD)
- `checkOut`: дата выезда (YYYY-MM-DD)

**Request Body:**

```typescript
{
  status: "completed" | "cancelled";
}
```

**Использование:**

```typescript
import { closeStayByDates } from "@/api/stays";
const updated = await closeStayByDates("101", "2025-01-15", "2025-01-20", {
  status: "completed",
});
```

### GET /stays/status/{status}

**Описание:** Список проживаний по статусу

**Parameters:** `status` - "booked" | "occupied" | "completed" | "cancelled"

**Использование:**

```typescript
import { getStaysByStatus } from "@/api/stays";
const bookedStays = await getStaysByStatus("booked");
```

### GET /stays/today/arrivals

**Описание:** Сегодняшние заезды (checkIn = today)

**Использование:**

```typescript
import { getTodayArrivals } from "@/api/stays";
const arrivals = await getTodayArrivals();
```

### GET /stays/today/departures

**Описание:** Сегодняшние выезды (checkOut = today)

**Использование:**

```typescript
import { getTodayDepartures } from "@/api/stays";
const departures = await getTodayDepartures();
```

---

## Аудит

### GET /audit/logs

**Описание:** Об'єднані логи змін статусів кімнат та проживань (тільки для admin та editor)

**Query Parameters (всі опціональні):**
- `type` - "room" | "stay" (фільтр по типу)
- `user` - ім'я користувача (часткове співпадіння)
- `role` - "admin" | "editor" | "guest" | "system" (фільтр по ролі)
- `from` - початкова дата (ISO format: YYYY-MM-DDTHH:mm:ssZ)
- `to` - кінцева дата (ISO format: YYYY-MM-DDTHH:mm:ssZ)

**Response:**
```typescript
Array<{
  type: "room" | "stay";
  entityLabel: string;        // "Room 102" або "John Doe"
  entityLink: string | null;  // "/rooms/102/stays" або "/stays/77"
  oldStatus: string;
  newStatus: string;
  changedAt: string;          // ISO date
  changedBy: string;          // username або "system"
  changedByRole: string;      // "admin" | "editor" | "guest" | "system"
}>
```

**Использование:**
```typescript
import http from "@/api/http";

// Всі логи
const logs = await http.get("/audit/logs");

// Фільтр по типу
const roomLogs = await http.get("/audit/logs?type=room");

// Фільтр по користувачу
const userLogs = await http.get("/audit/logs?user=frontdesk-1");

// Фільтр по діапазону дат
const dateLogs = await http.get(
  "/audit/logs?from=2025-01-01T00:00:00Z&to=2025-01-31T23:59:59Z"
);
```

**Примітки:**
- Логи автоматично фільтруються по готелю поточного користувача
- Сортування за датою (новіші спочатку)
- Доступ тільки для admin та editor

---

## Суперадмин функции

### GET /auth/users

**Описание:** Список всех пользователей (только для superadmin)

**Response:** `PublicAdminUser[]`

**Использование:**

```typescript
// В store/superadmin.ts
const users = await http.get<PublicAdminUser[]>("/auth/users");
```

### POST /auth/create-admin

**Описание:** Создание нового админа (только superadmin)

**Request Body:**

```typescript
{
  username: string;
  password: string;
  confirmPassword: string;
  hotel_name: string;
  address: string;
  full_name?: string;
  phone?: string;
  email?: string;
  checkInHour?: number;          // 0-23, опционально
  checkOutHour?: number;         // 0-23, опционально
  defaultWifiName?: string | null;      // Название WiFi сети по умолчанию
  defaultWifiPassword?: string | null;  // Пароль WiFi по умолчанию
}
```

### PUT /auth/admin/{username}

**Описание:** Обновление данных отеля (только superadmin)

**Parameters:** `username` - имя пользователя админа

**Request Body:** Все поля опциональны

```typescript
{
  hotel_name?: string;
  address?: string;
  full_name?: string;
  phone?: string;
  email?: string;
  logo_url?: string;
  checkInHour?: number | null;          // 0-23 или null (сбросить на дефолт)
  checkOutHour?: number | null;         // 0-23 или null (сбросить на дефолт)
  defaultWifiName?: string | null;      // Название WiFi сети
  defaultWifiPassword?: string | null;   // Пароль WiFi
}
```

**Использование:**

```typescript
// В store/superadmin.ts
await store.updateHotel("hotel-aurora", {
  hotel_name: "Aurora Grand Hotel",
  checkInHour: 15,
  checkOutHour: 11,
  defaultWifiName: "Aurora_Free_WiFi",
  defaultWifiPassword: "SecurePassword123",
});
```

### POST /auth/create-editor

**Описание:** Создание редактора (только admin)

**Request Body:**

```typescript
{
  username: string;
  password: string;
  confirmPassword: string;
  full_name?: string;
  phone?: string;
  email?: string;
}
```

### PUT /auth/block/{username}

**Описание:** Блокировка админа и всех его редакторов

### PUT /auth/unblock/{username}

**Описание:** Разблокировка админа и всех его редакторов

### DELETE /auth/delete/{username}

**Описание:** Удаление пользователя

---

## Типы данных

### Room

```typescript
interface Room {
  id: number;
  roomNumber: string;
  floor: number;
  capacity: number;
  status: "free" | "booked" | "occupied";
  checkInHour?: number;
  checkOutHour?: number;
  wifiName?: string;
  wifiPassword?: string;
  qrBarUrl?: string;
  mapPosition?: string;
}
```

### Stay

```typescript
interface Stay {
  id: number;
  room: {
    id: number;
    roomNumber: string;
    status: "free" | "booked" | "occupied";
  };
  mainGuestName: string;
  extraGuestNames?: string[];
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  balance: string | number;
  status: "booked" | "occupied" | "completed" | "cancelled";
}
```

### PublicAdminUser (для суперадмина)

```typescript
interface PublicAdminUser {
  id: number;
  username: string;
  role: "admin";
  hotel_name: string | null;
  address: string | null;
  full_name: string | null;
  logo_url: string | null;
  phone: string | null;
  email: string | null;
  isBlocked: boolean;
  checkInHour: number | null;
  checkOutHour: number | null;
  createdAt: string;
  updatedAt: string;
  editorsCount: number;
  editors: Array<{
    id: number;
    username: string;
    role: "editor";
    full_name: string | null;
    phone: string | null;
    email: string | null;
    isBlocked: boolean;
    createdAt: string;
    updatedAt: string;
  }>;
}
```

---

## Обработка ошибок

Все API функции используют axios interceptors для:

- Автоматического добавления JWT токена в заголовки
- Показа глобального лоадера во время запросов
- Автоматического редиректа на /login при 401/403 ошибках
- Обработки ошибок сети

**Пример обработки ошибок:**

```typescript
try {
  const rooms = await getRooms();
} catch (error) {
  console.error("Failed to load rooms:", error);
  // Ошибка уже обработана в interceptor
}
```

---

## Настройка

**Environment Variables:**

- `VITE_API_URL` - URL бэкенда (по умолчанию: http://localhost:3000)

**HTTP Client Configuration:**

- Timeout: 15 секунд
- Base URL: из environment переменной
- Автоматическое добавление Authorization header
- Автоматический показ/скрытие лоадера
