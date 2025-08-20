const en = {
  app: {
    name: "HoteLotse",
  },
  nav: {
    login: "Login",
    rooms: "Rooms",
    dashboard: "Dashboard",
  },
  login: {
    title: "Sign in",
    username: "Username",
    password: "Password",

    submit: "Sign in",
  },
  rooms: {
    title: "Rooms list",
    freeCount: "Free: {count}",
    plural: "{count} room | {count} rooms | {count} rooms",
    status: {
      free: "Free",
      booked: "Booked",
      occupied: "Occupied",
    },
    floorN: "Floor {n}",
    capacityN: "{n} places",
  },
  common: {
    language: "Language",
    save: "Save",
    cancel: "Cancel",
    loading: "Logging in…",
  },
  dates: {
    today: "Today",
  },
  validation: {
    required: "This field is required",
    invalidLogin: "Invalid username or password",
  },
} as const;

export default en;
