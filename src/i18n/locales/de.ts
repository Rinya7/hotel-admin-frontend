const de = {
  app: {
    name: "HoteLotse",
  },
  nav: {
    login: "Anmeldung",
    rooms: "Zimmer",
    dashboard: "Dashboard",
  },
  login: {
    title: "Anmeldung",
    username: "Benutzername",
    password: "Passwort",
    submit: "Einloggen",
  },
  rooms: {
    title: "Zimmer",
    freeCount: "Frei: {count}",
    plural: "{count} Zimmer | {count} Zimmer | {count} Zimmer",
    status: {
      free: "Frei",
      booked: "Gebucht",
      occupied: "Belegt",
    },
    floorN: "Etage {n}",
    capacityN: "{n} Plätze",
  },
  common: {
    language: "Sprache",
    save: "Speichern",
    cancel: "Abbrechen",
    loading: "Anmeldung läuft…",
  },
  dates: {
    today: "Heute",
  },
  validation: {
    required: "Dieses Feld ist erforderlich",
    invalidLogin: "Ungültiger Benutzername oder Passwort",
  },
} as const;

export default de;
