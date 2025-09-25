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
  hotelForm: {
    title: "Crea Hotel",
    sections: {
      basicInfo: "Informazioni di base",
      security: "Sicurezza",
      contactInfo: "Informazioni di contatto",
      checkinPolicies: "Politiche di check-in",
    },
    fields: {
      username: "Nome utente",
      hotelName: "Nome hotel",
      address: "Indirizzo",
      password: "Password",
      confirmPassword: "Conferma password",
      fullName: "Nome proprietario",
      email: "Email",
      phone: "Telefono",
      checkInHour: "Check-in (0..23)",
      checkOutHour: "Check-out (0..23)",
    },
    placeholders: {
      checkInDefault: "14",
      checkOutDefault: "10",
    },
    messages: {
      creating: "Creazione...",
      createHotel: "Crea Hotel",
      success: "Hotel creato con successo",
      error: "Impossibile creare l'hotel",
      passwordsMismatch: "Le password non corrispondono",
      invalidHour: "L'ora deve essere un numero intero tra 0..23 o vuoto",
    },
  },
  editHotelDialog: {
    title: "Modifica Hotel",
    fields: {
      hotelName: "Nome hotel",
      address: "Indirizzo",
      fullName: "Nome proprietario",
      email: "Email",
      phone: "Telefono",
      logoUrl: "Logo (URL)",
      checkInHour: "Check-in (0..23, o vuoto)",
      checkOutHour: "Check-out (0..23, o vuoto)",
    },
    messages: {
      saving: "Salvataggio...",
      save: "Salva",
      cancel: "Annulla",
      invalidHour: "checkInHour deve essere 0..23 o null",
      invalidHourOut: "checkOutHour deve essere 0..23 o null",
      defaultNote:
        'Imposta null (inserisci "null" nel campo) per seguire il default dell\'hotel',
    },
  },
  superAdminLayout: {
    nav: {
      dashboard: "Dashboard",
      hotels: "Hotels",
    },
    profile: {
      logout: "Esci",
    },
  },
  saDashboard: {
    title: "Dashboard Superadmin",
    stats: {
      totalHotels: "Hotel totali",
      activeHotels: "Attivi",
      blockedHotels: "Bloccati",
      totalEditors: "Editori (totali)",
      avgEditorsPerHotel: "per hotel",
    },
    latestHotels: {
      title: "Hotel più recenti",
      goToList: "Vai alla lista →",
      table: {
        hotel: "Hotel",
        address: "Indirizzo",
        login: "Login",
        created: "Creato",
        status: "Stato",
      },
      status: {
        blocked: "Bloccato",
        active: "Attivo",
      },
      loading: "Caricamento…",
      empty: "Ancora nulla",
    },
    createHotel: {
      title: "Aggiungi nuovo hotel",
    },
  },
  saHotelsList: {
    title: "Hotels",
    search: {
      placeholder: "Cerca: nome, indirizzo, login, email, telefono",
    },
    table: {
      hotelName: "Nome Hotel",
      address: "Indirizzo",
      login: "Login",
      editors: "Editori",
      created: "Creato",
      status: "Stato",
      action: "Azione",
    },
    status: {
      blocked: "Bloccato",
      active: "Attivo",
    },
    actions: {
      info: "info",
      block: "block",
      unblock: "unblock",
      edit: "edit",
      delete: "Elimina",
    },
    messages: {
      loading: "Caricamento…",
      nothingFound: "Niente trovato",
      confirmBlock: "Bloccare {username}?",
      confirmUnblock: "Sbloccare {username}?",
      confirmDelete:
        "Eliminare {username}? Questa azione non può essere annullata.",
      saveError: "Errore di salvataggio",
    },
  },
  saHotelDetail: {
    notFound: "Record non trovato",
    status: {
      blocked: "Bloccato",
      active: "Attivo",
    },
    actions: {
      edit: "edit",
      block: "block",
      unblock: "unblock",
      delete: "delete",
      back: "Indietro",
    },
    sections: {
      contacts: "Contatti",
      checkinPolicies: "Politiche di Check-in/Check-out",
      userStats: "Statistiche Utenti",
      editors: "Editori",
    },
    fields: {
      login: "Login",
      owner: "Proprietario",
      email: "Email",
      phone: "Telefono",
      checkInTime: "Ora check-in",
      checkOutTime: "Ora check-out",
      editors: "Editori",
      created: "Creato",
      updated: "Aggiornato",
      default: "predefinito",
    },
    table: {
      login: "Login",
      name: "Nome",
      email: "Email",
      phone: "Telefono",
      status: "Stato",
    },
    messages: {
      noEditors: "Nessun editore ancora",
      confirmBlock: "Bloccare {username}?",
      confirmUnblock: "Sbloccare {username}?",
      confirmDelete:
        "Eliminare {username}? Questa azione non può essere annullata.",
      saveError: "Errore di salvataggio",
    },
  },
} as const;

export default it;
