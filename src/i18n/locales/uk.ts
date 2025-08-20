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
} as const;

export default uk;
