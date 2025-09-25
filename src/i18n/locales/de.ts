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
  hotelForm: {
    title: "Hotel erstellen",
    sections: {
      basicInfo: "Grundinformationen",
      security: "Sicherheit",
      contactInfo: "Kontaktinformationen",
      checkinPolicies: "Check-in-Richtlinien",
    },
    fields: {
      username: "Benutzername",
      hotelName: "Hotelname",
      address: "Adresse",
      password: "Passwort",
      confirmPassword: "Passwort bestätigen",
      fullName: "Eigentümername",
      email: "E-Mail",
      phone: "Telefon",
      checkInHour: "Check-in (0..23)",
      checkOutHour: "Check-out (0..23)",
    },
    placeholders: {
      checkInDefault: "14",
      checkOutDefault: "10",
    },
    messages: {
      creating: "Erstelle...",
      createHotel: "Hotel erstellen",
      success: "Hotel erfolgreich erstellt",
      error: "Hotel konnte nicht erstellt werden",
      passwordsMismatch: "Passwörter stimmen nicht überein",
      invalidHour: "Stunde muss eine ganze Zahl zwischen 0..23 oder leer sein",
    },
  },
  editHotelDialog: {
    title: "Hotel bearbeiten",
    fields: {
      hotelName: "Hotelname",
      address: "Adresse",
      fullName: "Eigentümername",
      email: "E-Mail",
      phone: "Telefon",
      logoUrl: "Logo (URL)",
      checkInHour: "Check-in (0..23, oder leer)",
      checkOutHour: "Check-out (0..23, oder leer)",
    },
    messages: {
      saving: "Speichern...",
      save: "Speichern",
      cancel: "Abbrechen",
      invalidHour: "checkInHour muss 0..23 oder null sein",
      invalidHourOut: "checkOutHour muss 0..23 oder null sein",
      defaultNote:
        'Setze null ("null" in Feld eingeben) um Hotel-Standard zu folgen',
    },
  },
  superAdminLayout: {
    nav: {
      dashboard: "Dashboard",
      hotels: "Hotels",
    },
    profile: {
      logout: "Abmelden",
    },
  },
  saDashboard: {
    title: "Superadmin Dashboard",
    stats: {
      totalHotels: "Hotels gesamt",
      activeHotels: "Aktiv",
      blockedHotels: "Gesperrt",
      totalEditors: "Redakteure (gesamt)",
      avgEditorsPerHotel: "pro Hotel",
    },
    latestHotels: {
      title: "Neueste Hotels",
      goToList: "Zur Liste →",
      table: {
        hotel: "Hotel",
        address: "Adresse",
        login: "Login",
        created: "Erstellt",
        status: "Status",
      },
      status: {
        blocked: "Gesperrt",
        active: "Aktiv",
      },
      loading: "Laden…",
      empty: "Noch nichts",
    },
    createHotel: {
      title: "Neues Hotel hinzufügen",
    },
  },
  saHotelsList: {
    title: "Hotels",
    search: {
      placeholder: "Suche: Name, Adresse, Login, E-Mail, Telefon",
    },
    table: {
      hotelName: "Hotelname",
      address: "Adresse",
      login: "Login",
      editors: "Redakteure",
      created: "Erstellt",
      status: "Status",
      action: "Aktion",
    },
    status: {
      blocked: "Gesperrt",
      active: "Aktiv",
    },
    actions: {
      info: "info",
      block: "block",
      unblock: "unblock",
      edit: "edit",
      delete: "Löschen",
    },
    messages: {
      loading: "Laden…",
      nothingFound: "Nichts gefunden",
      confirmBlock: "{username} sperren?",
      confirmUnblock: "{username} entsperren?",
      confirmDelete:
        "{username} löschen? Diese Aktion kann nicht rückgängig gemacht werden.",
      saveError: "Speicherfehler",
    },
  },
  saHotelDetail: {
    notFound: "Datensatz nicht gefunden",
    status: {
      blocked: "Gesperrt",
      active: "Aktiv",
    },
    actions: {
      edit: "edit",
      block: "block",
      unblock: "unblock",
      delete: "delete",
      back: "Zurück",
    },
    sections: {
      contacts: "Kontakte",
      checkinPolicies: "Check-in/Check-out-Richtlinien",
      userStats: "Benutzerstatistiken",
      editors: "Redakteure",
    },
    fields: {
      login: "Login",
      owner: "Eigentümer",
      email: "E-Mail",
      phone: "Telefon",
      checkInTime: "Check-in Zeit",
      checkOutTime: "Check-out Zeit",
      editors: "Redakteure",
      created: "Erstellt",
      updated: "Aktualisiert",
      default: "Standard",
    },
    table: {
      login: "Login",
      name: "Name",
      email: "E-Mail",
      phone: "Telefon",
      status: "Status",
    },
    messages: {
      noEditors: "Noch keine Redakteure",
      confirmBlock: "{username} sperren?",
      confirmUnblock: "{username} entsperren?",
      confirmDelete:
        "{username} löschen? Diese Aktion kann nicht rückgängig gemacht werden.",
      saveError: "Speicherfehler",
    },
  },
} as const;

export default de;
