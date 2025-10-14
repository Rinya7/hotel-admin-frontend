// 🇺🇦 Базові ключі для інтерфейсу. Можеш додавати свої секції.
// ВАЖЛИВО: as const — щоб TypeScript сприймав це як "літерал", а не як розмитий об'єкт.
const uk = {
  app: {
    name: "HoteLotse",
  },
  nav: {
    login: "Вхід",
    rooms: "Кімнати",
    dashboard: "Панель",
  },
  login: {
    title: "Вхід до системи",
    username: "Логін",
    password: "Пароль",
    submit: "Увійти",
  },
  rooms: {
    title: "Список кімнат",
    freeCount: "Вільні: {count}",
    plural: "{count} кімната | {count} кімнати | {count} кімнат",
    status: {
      free: "Вільний",
      booked: "Заброньовано",
      occupied: "Заселено",
    },
    floorN: "Поверх {n}",
    capacityN: "{n} місць",
  },
  common: {
    language: "Мова",
    save: "Зберегти",
    cancel: "Скасувати",
    loading: "Завантаження…",
  },
  dates: {
    today: "Сьогодні",
  },
  validation: {
    required: "Це поле обов'язкове",
    invalidLogin: "Невірний логін або пароль",
  },
  roomForm: {
    sections: {
      basicInfo: "Основна інформація",
      additional: "Додаткова інформація",
    },
    fields: {
      roomNumber: "Номер кімнати",
      floor: "Поверх",
      capacity: "Місткість",
      wifiName: "Назва WiFi",
      wifiPassword: "Пароль WiFi",
      qrBarUrl: "QR/Bar URL",
      mapPosition: "Позиція на карті",
    },
    messages: {
      creating: "Створення кімнати...",
      createRoom: "Створити кімнату",
      success: "Кімнату успішно створено!",
      error: "Не вдалося створити кімнату",
      roomNumberRequired: "Номер кімнати обов'язковий",
      invalidFloor: "Поверх повинен бути від 1 до 50",
      invalidCapacity: "Місткість повинна бути від 1 до 10",
      roomExists: "Кімната з таким номером вже існує",
      validationError: "Перевірте введені дані",
      permissionDenied: "У вас немає дозволу на створення кімнат",
      serverError: "Помилка сервера. Спробуйте пізніше",
    },
  },
  hotelForm: {
    title: "Створення готелю",
    sections: {
      basicInfo: "Основна інформація",
      security: "Безпека",
      contactInfo: "Контактна інформація",
      checkinPolicies: "Політики заселення",
      wifiInfo: "Дані Wi‑Fi",
    },
    fields: {
      username: "Логін (username)",
      hotelName: "Назва готелю",
      address: "Адреса",
      password: "Пароль",
      confirmPassword: "Підтвердження пароля",
      fullName: "Імʼя власника",
      email: "Email",
      phone: "Телефон",
      checkInHour: "Check-in (0..23)",
      checkOutHour: "Check-out (0..23)",
      wifiName: "Назва WiFi",
      wifiPassword: "Пароль WiFi",
    },
    placeholders: {
      checkInDefault: "14",
      checkOutDefault: "10",
      wifiName: "Наприклад: Hotel_Free",
      wifiPassword: "Пароль від мережі Wi‑Fi",
    },
    messages: {
      creating: "Створюємо...",
      createHotel: "Створити готель",
      success: "Готель успішно створено",
      error: "Не вдалося створити готель",
      passwordsMismatch: "Паролі не збігаються",
      invalidHour:
        "Година має бути цілим числом у діапазоні 0..23 або порожнім",
    },
  },
  editHotelDialog: {
    title: "Редагувати готель",
    fields: {
      hotelName: "Назва готелю",
      address: "Адреса",
      fullName: "Імʼя власника",
      email: "Email",
      phone: "Телефон",
      logoUrl: "Логотип (URL)",
      checkInHour: "Check-in (0..23, або порожньо)",
      checkOutHour: "Check-out (0..23, або порожньо)",
    },
    messages: {
      saving: "Зберігаємо...",
      save: "Зберегти",
      cancel: "Скасувати",
      invalidHour: "checkInHour має бути 0..23 або null",
      invalidHourOut: "checkOutHour має бути 0..23 або null",
      defaultNote:
        'Постав null (в полі введи "null") щоб слідувати дефолту готелю',
    },
  },
  superAdminLayout: {
    nav: {
      dashboard: "Dashboard",
      hotels: "Готелі",
    },
    profile: {
      logout: "Вийти",
    },
  },
  saDashboard: {
    title: "Superadmin Dashboard",
    stats: {
      totalHotels: "Всього готелів",
      activeHotels: "Активних",
      blockedHotels: "Заблоковано",
      totalEditors: "Редакторів (усього)",
      avgEditorsPerHotel: "на готель",
    },
    latestHotels: {
      title: "Останні готелі",
      goToList: "Перейти до списку →",
      table: {
        hotel: "Готель",
        address: "Адреса",
        login: "Логін",
        created: "Створено",
        status: "Статус",
      },
      status: {
        blocked: "Заблоковано",
        active: "Активний",
      },
      loading: "Завантаження…",
      empty: "Поки що порожньо",
    },
    createHotel: {
      title: "Додати новий готель",
    },
  },
  saHotelsList: {
    title: "Готелі",
    search: {
      placeholder: "Пошук: назва, адреса, логін, email, телефон",
    },
    table: {
      hotelName: "Готель",
      address: "Адреса",
      login: "Логін",
      editors: "Редакторів",
      created: "Створено",
      status: "Статус",
      action: "Дія",
    },
    status: {
      blocked: "Заблоковано",
      active: "Активний",
    },
    actions: {
      info: "info",
      block: "block",
      unblock: "unblock",
      edit: "edit",
      delete: "Видалити",
    },
    messages: {
      loading: "Завантаження…",
      nothingFound: "Нічого не знайдено",
      confirmBlock: "Заблокувати {username}?",
      confirmUnblock: "Розблокувати {username}?",
      confirmDelete: "Видалити {username}? Дію не можна скасувати.",
      saveError: "Помилка збереження",
    },
  },
  saHotelDetail: {
    notFound: "Запис не знайдено",
    status: {
      blocked: "Заблоковано",
      active: "Активний",
    },
    actions: {
      edit: "edit",
      block: "block",
      unblock: "unblock",
      delete: "delete",
      back: "Назад",
    },
    sections: {
      contacts: "Контакти",
      checkinPolicies: "Політика заселення/виїзду",
      userStats: "Статистика користувачів",
      editors: "Редактори",
    },
    fields: {
      login: "Логін",
      owner: "Власник",
      email: "Email",
      phone: "Телефон",
      checkInTime: "Check-in час",
      checkOutTime: "Check-out час",
      editors: "Редакторів",
      created: "Створено",
      updated: "Оновлено",
      default: "за замовчуванням",
    },
    table: {
      login: "Логін",
      name: "Ім'я",
      email: "Email",
      phone: "Телефон",
      status: "Статус",
    },
    messages: {
      noEditors: "Редакторів ще немає",
      confirmBlock: "Заблокувати {username}?",
      confirmUnblock: "Розблокувати {username}?",
      confirmDelete: "Видалити {username}? Дію не можна скасувати.",
      saveError: "Помилка збереження",
    },
  },
} as const;

export default uk;
