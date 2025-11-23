# Stores (Pinia stores - глобальний стан)

## Призначення папки

Папка містить Pinia stores для управління глобальним станом додатку. Stores зберігають дані, які потрібні в різних частинах додатку.

## Структура

```
src/stores/
├── auth.ts          # Стан авторизації
├── superadmin.ts    # Стан superadmin функціональності
└── ui.ts            # UI стан (loader, тема, тощо)
```

## Файли

### auth.ts

**Призначення:** Store для управління станом авторизації та користувача.

**Що містить:**

**State:**
- `token` - JWT токен (з localStorage)
- `role` - роль користувача (superadmin, admin, editor)
- `username` - ім'я користувача
- `adminId` - ID власника готелю
- `hotelName` - назва готелю
- `profileLoaded` - прапор завантаження профілю
- `defaultCheckInHour` - година заїзду за замовчуванням
- `defaultCheckOutHour` - година виїзду за замовчуванням

**Actions:**
- `login(credentials)` - логін користувача
- `logout()` - вихід з системи
- `loadProfile()` - завантажити профіль користувача

**Getters:**
- `isAuthenticated` - чи авторизований користувач
- `isSuperadmin` - чи є superadmin
- `isAdmin` - чи є admin
- `isEditor` - чи є editor

**Використання:**

```typescript
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

// Логін
await authStore.login({ username, password });

// Перевірка ролі
if (authStore.isSuperadmin) {
  // Логіка для superadmin
}
```

### superadmin.ts

**Призначення:** Store для управління станом superadmin функціональності.

**Що містить:**

**State:**
- `hotels` - список готелів
- `selectedHotel` - вибраний готель
- `loading` - стан завантаження
- `error` - помилка

**Actions:**
- `fetchHotels()` - завантажити список готелів
- `createHotel(data)` - створити готель
- `updateHotel(id, data)` - оновити готель
- `selectHotel(id)` - вибрати готель

**Використання:**

```typescript
import { useSuperadminStore } from "@/stores/superadmin";

const superadminStore = useSuperadminStore();

// Завантажити готелі
await superadminStore.fetchHotels();
```

### ui.ts

**Призначення:** Store для управління UI станом (loader, тема, тощо).

**Що містить:**

**State:**
- `isLoading` - чи показувати глобальний loader
- `theme` - поточна тема (light/dark)

**Actions:**
- `setLoading(loading)` - встановити стан завантаження
- `toggleTheme()` - перемкнути тему

**Використання:**

```typescript
import { useUiStore } from "@/stores/ui";

const uiStore = useUiStore();

// Показати loader
uiStore.setLoading(true);
```

## Принципи роботи з stores

- **Один store на модуль** - кожен store відповідає за свій модуль
- **Реактивність** - зміни в store автоматично оновлюють компоненти
- **Типізація** - всі state, actions, getters типізовані
- **Збереження** - важливі дані (token, role) зберігаються в localStorage

## Створення нового store

1. Створити файл з ім'ям store
2. Використати `defineStore` з Pinia
3. Визначити state, actions, getters
4. Додати TypeScript типи
5. Використати в компонентах через `useStore()`

**Приклад:**

```typescript
import { defineStore } from "pinia";

export const useMyStore = defineStore("myStore", {
  state: () => ({
    data: null,
  }),
  actions: {
    async fetchData() {
      // Логіка
    },
  },
  getters: {
    hasData: (state) => state.data !== null,
  },
});
```

---

**Останнє оновлення:** 2025-01-XX




