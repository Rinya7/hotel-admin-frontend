# API Quick Reference - Hotel Management

## Быстрый справочник по API endpoints

### 🔐 Аутентификация

```typescript
// Вход в систему
import { loginApi } from "@/api/auth";
await loginApi({ username: "user", password: "pass" });
```

### 🏨 Комнаты

```typescript
import {
  getRooms,
  createRoom,
  updateRoomByNumber,
  updateRoomStatus,
  getRoomsStats,
  updateBulkPolicyHours,
} from "@/api/rooms";

// Получить все комнаты
const rooms = await getRooms();

// Создать комнату
const newRoom = await createRoom({
  roomNumber: "101",
  floor: 1,
  capacity: 2,
});

// Обновить комнату
await updateRoomByNumber("101", { floor: 2, capacity: 4 });

// Изменить статус
await updateRoomStatus("101", { status: "occupied" });

// Статистика
const stats = await getRoomsStats();

// Массовое обновление времени
await updateBulkPolicyHours({
  checkInHour: 15,
  checkOutHour: 11,
});
```

### 🛏️ Проживания

```typescript
import {
  listStaysByRoom,
  createStayForRoom,
  getCurrentStays,
  checkInStay,
  checkOutStay,
  cancelStay,
  closeStayByDates,
  getStaysByStatus,
  getTodayArrivals,
  getTodayDepartures,
} from "@/api/stays";

// История проживаний комнаты
const stays = await listStaysByRoom("101");

// Создать проживание
const newStay = await createStayForRoom("101", {
  mainGuestName: "John Doe",
  extraGuestNames: ["Jane Doe"],
  checkIn: "2025-01-15",
  checkOut: "2025-01-20",
  status: "booked",
  balance: 500,
});

// Текущие проживания
const current = await getCurrentStays();

// Операции с проживаниями
await checkInStay(123); // booked -> occupied
await checkOutStay(123); // occupied -> completed
await cancelStay(123); // booked -> cancelled

// Закрыть проживание по датам
await closeStayByDates("101", "2025-01-15", "2025-01-20", {
  status: "completed",
});

// Фильтрация
const booked = await getStaysByStatus("booked");
const arrivals = await getTodayArrivals();
const departures = await getTodayDepartures();
```

### 👑 Суперадмин

```typescript
// В store/superadmin.ts уже реализованы все методы:
import { useSuperHotelsStore } from "@/stores/superadmin";

const store = useSuperHotelsStore();

// Загрузить всех пользователей
await store.fetchAll();

// Создать отель
await store.createHotelAdmin({
  username: "hotel-aurora",
  password: "pass123",
  confirmPassword: "pass123",
  hotel_name: "Aurora Hotel",
  address: "123 Main St",
});

// Обновить отель
await store.updateHotel("hotel-aurora", {
  hotel_name: "New Name",
  address: "New Address",
});

// Блокировка/разблокировка
await store.block("hotel-aurora");
await store.unblock("hotel-aurora");

// Удаление
await store.removeUser("hotel-aurora");
```

## 📋 Основные типы данных

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
  room: { id: number; roomNumber: string; status: string };
  mainGuestName: string;
  extraGuestNames?: string[];
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  balance: string | number;
  status: "booked" | "occupied" | "completed" | "cancelled";
}
```

## 🔄 Статусы и переходы

### Статусы комнат

- `free` - свободна
- `booked` - забронирована
- `occupied` - занята

### Статусы проживаний

- `booked` - забронировано
- `occupied` - заселено (check-in)
- `completed` - завершено (check-out)
- `cancelled` - отменено

### Переходы статусов проживаний

- `booked` → `occupied` (check-in)
- `occupied` → `completed` (check-out)
- `booked` → `cancelled` (отмена)
- Любой → `completed`/`cancelled` (закрытие по датам)

## ⚠️ Важные замечания

1. **Все API запросы** автоматически добавляют JWT токен в заголовки
2. **Глобальный лоадер** показывается автоматически во время запросов
3. **401/403 ошибки** автоматически редиректят на /login
4. **roomNumber** всегда передается в URL, не в теле запроса
5. **extraGuestNames** (не extraGuests) - правильное название поля
6. **balance** может быть строкой или числом
7. **Даты** всегда в формате YYYY-MM-DD

## 🚀 Примеры использования в компонентах

### Создание проживания

```vue
<script setup>
import { createStayForRoom } from "@/api/stays";

const form = reactive({
  mainGuestName: "",
  extraGuestNames: [],
  checkIn: "",
  checkOut: "",
  status: "booked",
  balance: 0,
});

async function createStay() {
  const stay = await createStayForRoom(roomNumber.value, form);
  // Обработка результата
}
</script>
```

### Управление статусами

```vue
<script setup>
import { checkInStay, checkOutStay, cancelStay } from "@/api/stays";

async function changeStatus(stay, newStatus) {
  switch (newStatus) {
    case "occupied":
      await checkInStay(stay.id);
      break;
    case "completed":
      await checkOutStay(stay.id);
      break;
    case "cancelled":
      await cancelStay(stay.id);
      break;
  }
}
</script>
```













