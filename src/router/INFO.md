# Router (Маршрутизація)

## Призначення папки

Папка містить конфігурацію Vue Router - визначення маршрутів додатку, захист маршрутів на основі ролей, навігаційні guards.

## Структура

```
src/router/
├── index.ts          # Конфігурація роутера
└── typings.d.ts      # Типи для meta полів
```

## Файли

### index.ts

**Призначення:** Головний файл конфігурації Vue Router.

**Що містить:**

1. **Імпорти компонентів:**
   - Lazy loading для оптимізації
   - Views та Layouts

2. **Визначення маршрутів:**
   - Публічні маршрути (login)
   - Маршрути для admin/editor (з AdminLayout)
   - Маршрути для superadmin (з SuperAdminLayout)

3. **Navigation Guards:**
   - Перевірка авторизації
   - Перевірка ролей
   - Перенаправлення на логін

**Структура маршрутів:**

```typescript
const routes = [
  // Публічний логін
  { name: "login", path: "/login", component: Login, meta: { public: true } },
  
  // Admin/Editor маршрути
  {
    path: "/",
    component: AdminLayout,
    meta: { roles: ["admin", "editor"] },
    children: [
      { name: "dashboard", path: "", component: Dashboard },
      { name: "rooms", path: "rooms", component: RoomsList },
      // ...
    ],
  },
  
  // Superadmin маршрути
  {
    path: "/sa",
    component: SuperAdminLayout,
    meta: { roles: ["superadmin"] },
    children: [
      { name: "sa-dashboard", path: "", component: SaDashboard },
      // ...
    ],
  },
];
```

**Navigation Guards:**

- `beforeEach` - перевірка перед кожним переходом
- Перевірка токену
- Перевірка ролі користувача
- Перенаправлення на логін якщо неавторизований

### typings.d.ts

**Призначення:** TypeScript типи для meta полів роутів.

**Що містить:**

```typescript
declare module "vue-router" {
  interface RouteMeta {
    public?: boolean;
    roles?: readonly UserRole[];
  }
}
```

**Використання:**

- Дозволяє типізувати meta поля в роутах
- Автодоповнення в IDE

## Маршрути

### Публічні маршрути

- `/login` - сторінка логіну (доступна без авторизації)

### Admin/Editor маршрути

- `/` - Dashboard
- `/rooms` - Список кімнат
- `/rooms/:roomNumber/stays` - Проживання по кімнаті
- `/rooms/:roomNumber/stays/:id/checkin` - Форма заселення
- `/audit` - Аудит центр

### Superadmin маршрути

- `/sa` - Dashboard superadmin
- `/sa/hotels` - Список готелів
- `/sa/hotels/:id` - Деталі готелю

## Принципи

- **Lazy loading** - компоненти завантажуються при потребі
- **Захист маршрутів** - перевірка авторизації та ролей
- **Мета-дані** - використання meta для конфігурації
- **Типізація** - всі маршрути типізовані

## Додавання нового маршруту

1. Імпортувати компонент (lazy loading)
2. Додати маршрут в масив routes
3. Вказати layout (якщо потрібно)
4. Додати meta.roles для захисту
5. Додати в navigation (якщо потрібно)

---

**Останнє оновлення:** 2025-01-XX




