const it = {
  app: {
    name: "HoteLotse",
  },
  nav: {
    login: "Accesso",
    rooms: "Camere",
    dashboard: "Pannello",
  },
  login: {
    title: "Accedi al sistema",
    username: "Nome utente",
    password: "Password",
    submit: "Accedi",
  },
  rooms: {
    title: "Elenco delle camere",
    freeCount: "Libere: {count}",
    plural: "{count} camera | {count} camere | {count} camere",
    status: {
      free: "Libera",
      booked: "Prenotata",
      occupied: "Occupata",
    },
    floorN: "Piano {n}",
    capacityN: "{n} posti",
  },
  common: {
    language: "Lingua",
    save: "Salva",
    cancel: "Annulla",
    loading: "Accesso in corso…",
  },
  dates: {
    today: "Oggi",
  },
  validation: {
    required: "Questo campo è obbligatorio",
    invalidLogin: "Nome utente o password non validi",
  },
} as const;

export default it;
