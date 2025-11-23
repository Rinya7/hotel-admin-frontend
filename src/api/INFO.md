# API (HTTP клієнт та API виклики)

## Призначення папки

Папка містить HTTP клієнт та функції для викликів до backend API. Централізована обробка запитів з автоматичним додаванням токенів, обробкою помилок та глобальним loader.

## Структура

```
src/api/
├── http.ts          # Axios інстанс з interceptors
├── auth.ts          # API виклики для авторизації
├── rooms.ts         # API виклики для кімнат
├── stays.ts         # API виклики для проживань
└── audit.ts         # API виклики для аудиту
```

## Файли

### http.ts

**Призначення:** Налаштування Axios HTTP клієнта з interceptors для автоматичної обробки запитів та відповідей.

**Що робить:**

1. **Request Interceptor:**
   - Додає JWT токен з localStorage до заголовків
   - Запускає глобальний loader під час запиту
   - Обробка типів заголовків (AxiosHeaders)

2. **Response Interceptor:**
   - Приховує loader після отримання відповіді
   - Обробка помилок:
     - 401 (Unauthorized) - вихід з системи, перенаправлення на логін
     - 403 (Forbidden) - показ помилки доступу
     - Інші помилки - показ повідомлення про помилку

3. **Налаштування:**
   - Base URL з env змінної `VITE_API_URL`
   - Timeout: 15 секунд

**Експортує:**

- `http` - налаштований Axios інстанс

**Використання:**

```typescript
import http from "@/api/http";

const response = await http.get("/rooms");
```

### auth.ts

**Призначення:** API функції для авторизації та управління користувачами.

**Функції:**

- `loginApi(credentials)` - логін користувача
- Використовує http клієнт з автоматичною обробкою

**Використання:**

```typescript
import { loginApi } from "@/api/auth";

const result = await loginApi({ username, password });
```

### rooms.ts

**Призначення:** API функції для роботи з кімнатами.

**Функції:**

- `getRooms()` - отримати список кімнат
- `createRoom(data)` - створити кімнату
- `updateRoom(roomNumber, data)` - оновити кімнату
- `deleteRoom(roomNumber)` - видалити кімнату
- `updateRoomStatus(roomNumber, status)` - змінити статус
- `getRoomStats()` - статистика кімнат
- `getRoomAvailability()` - доступність кімнат
- `bulkSetPolicyHours(data)` - масове встановлення годин
- `bulkSetWiFi(data)` - масове встановлення Wi-Fi

**Використання:**

```typescript
import { getRooms, createRoom } from "@/api/rooms";

const rooms = await getRooms();
```

### stays.ts

**Призначення:** API функції для роботи з проживаннями.

**Функції:**

- `getStaysByRoom(roomNumber)` - отримати проживання по кімнаті
- `createStay(roomNumber, data)` - створити проживання
- `updateStay(roomNumber, stayId, data)` - оновити проживання
- `closeStay(roomNumber, data)` - закрити проживання
- `checkInStay(stayId)` - заселити
- `checkOutStay(stayId)` - виселити
- `cancelStay(stayId)` - скасувати
- `getStaysByStatus(status)` - отримати по статусу
- `getArrivalsToday()` - сьогоднішні заїзди
- `getDeparturesToday()` - сьогоднішні виїзди
- `searchStays(query)` - пошук проживань

**Використання:**

```typescript
import { getStaysByRoom, createStay } from "@/api/stays";

const stays = await getStaysByRoom("101");
```

### audit.ts

**Призначення:** API функції для роботи з аудит логами.

**Функції:**

- `getAuditLogs(params)` - отримати логи з фільтрами
  - Параметри: type, user, role, from, to

**Використання:**

```typescript
import { getAuditLogs } from "@/api/audit";

const logs = await getAuditLogs({ type: "room", from: "2025-01-01" });
```

## Важливі моменти

- **Автоматичне додавання токенів** - всі запити автоматично отримують JWT токен
- **Глобальний loader** - автоматично показується під час запитів
- **Обробка помилок** - централізована обробка 401/403 помилок
- **Типізація** - всі функції типізовані відповідно до backend API
- **Base URL** - налаштовується через env змінну

---

**Останнє оновлення:** 2025-01-XX




