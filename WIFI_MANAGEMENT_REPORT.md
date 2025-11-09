# Wi-Fi Management Feature Report

## Дата: 15 октября 2025

## Описание

Добавлен функционал управления Wi-Fi на дашборд админа, аналогично существующей функции Policy Hours. Администратор теперь может массово обновлять логин (название сети) и пароль Wi-Fi для всех комнат отеля.

## Изменения в Frontend

### 1. Типы (`admin-frontend/src/types/rooms.ts`)

- Добавлен интерфейс `BulkWiFiRequest` для массового обновления Wi-Fi:
  ```typescript
  export interface BulkWiFiRequest {
    wifiName: string;
    wifiPassword: string;
  }
  ```

### 2. API (`admin-frontend/src/api/rooms.ts`)

- Добавлена функция `updateBulkWiFi()` для массового обновления Wi-Fi данных:
  - Эндпоинт: `PUT /rooms/wifi/bulk`
  - Параметры: `wifiName`, `wifiPassword`

### 3. Dashboard (`admin-frontend/src/views/Dashboard.vue`)

#### Добавлено состояние:

- `showWiFi` - флаг отображения модального окна
- `savingWiFi` - флаг процесса сохранения
- `wifiForm` - реактивная форма с полями `wifiName` и `wifiPassword`

#### UI компоненты:

1. **Секция отображения Wi-Fi данных** (в Room Management):

   - Отображение текущего названия сети (SSID)
   - Отображение пароля (замаскированный как •••••••• для безопасности)
   - Кнопка "Edit Wi-Fi" для админов

2. **Модальное окно редактирования**:
   - Поле для ввода названия Wi-Fi сети
   - Поле для ввода пароля (видимый текст для удобства редактирования)
   - Валидация: оба поля обязательны и не пустые
   - Предупреждение о том, что изменения применятся ко всем комнатам
   - Кнопки "Cancel" и "Save Wi-Fi Credentials"

#### Функции:

- `saveWiFi()` - сохранение Wi-Fi данных через API
- `isWiFiValid` - computed свойство для валидации формы
- Автоматическая загрузка текущих значений из первой комнаты с установленным Wi-Fi

## Изменения в Backend

### 1. Контроллер (`hotel-backend/src/controllers/roomPolicy.controller.ts`)

- Добавлен интерфейс `BulkWiFiBody`
- Добавлена функция `bulkSetRoomWiFi()`:
  - Проверка прав доступа (admin или editor)
  - Валидация: оба поля обязательны и не пустые
  - Проверка длины (максимум 100 символов)
  - Массовое обновление всех комнат отеля через QueryBuilder
  - Возвращает количество обновленных записей

### 2. Роуты (`hotel-backend/src/routes/roomPolicy.routes.ts`)

- Добавлен роут `PUT /rooms/wifi/bulk`
- Защита: `authenticateToken` + `isEditorOrAdmin`

### 3. OpenAPI документация

#### `hotel-backend/openapi/openapi.base.yaml`:

- Добавлен тег "Wi-Fi Management"
- Добавлена схема `BulkWiFiRequest`:
  - `wifiName`: string, maxLength 100
  - `wifiPassword`: string, maxLength 100
- Добавлен путь `/rooms/wifi/bulk`

#### `hotel-backend/openapi/paths/wifi.yaml` (новый файл):

- Полная спецификация эндпоинта
- Примеры запросов и ответов
- Описание ошибок (400, 403)

## Безопасность

1. Пароль Wi-Fi не отображается в ответе API (заменяется на "\*\*\*")
2. В UI пароль скрыт точками (••••••••) при отображении
3. Доступ к редактированию только для администраторов
4. Валидация длины полей на фронте и бэке

## Особенности реализации

1. **Массовое обновление**: изменения применяются ко всем комнатам отеля за один запрос
2. **Консистентность с Policy Hours**: аналогичная архитектура и UX
3. **Строгая типизация**: никаких `any`, все типы определены явно
4. **Валидация**: на всех уровнях (форма, API, база данных)

## Тестирование

Для тестирования функционала:

1. Войдите как администратор отеля
2. На дашборде найдите секцию "Wi-Fi Credentials"
3. Нажмите кнопку "Edit Wi-Fi"
4. Введите название сети и пароль
5. Сохраните изменения
6. Проверьте, что данные обновились для всех комнат

## API Endpoint

```
PUT /rooms/wifi/bulk
Authorization: Bearer <token>

Request Body:
{
  "wifiName": "HotelGuest",
  "wifiPassword": "SecurePassword123"
}

Response (200):
{
  "message": "Wi-Fi credentials updated successfully",
  "updated": 25,
  "applied": {
    "wifiName": "HotelGuest",
    "wifiPassword": "***"
  }
}
```

## Совместимость

- TypeScript strict mode ✓
- ESLint без ошибок ✓
- Dark mode поддержка ✓
- Responsive design ✓











