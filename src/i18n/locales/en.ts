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
  hotelForm: {
    title: "Create Hotel",
    sections: {
      basicInfo: "Basic Information",
      security: "Security",
      contactInfo: "Contact Information",
      checkinPolicies: "Check-in Policies",
    },
    fields: {
      username: "Username",
      hotelName: "Hotel Name",
      address: "Address",
      password: "Password",
      confirmPassword: "Confirm Password",
      fullName: "Owner Name",
      email: "Email",
      phone: "Phone",
      checkInHour: "Check-in (0..23)",
      checkOutHour: "Check-out (0..23)",
    },
    placeholders: {
      checkInDefault: "14",
      checkOutDefault: "10",
    },
    messages: {
      creating: "Creating...",
      createHotel: "Create Hotel",
      success: "Hotel created successfully",
      error: "Failed to create hotel",
      passwordsMismatch: "Passwords do not match",
      invalidHour: "Hour must be an integer between 0..23 or empty",
    },
  },
  editHotelDialog: {
    title: "Edit Hotel",
    fields: {
      hotelName: "Hotel Name",
      address: "Address",
      fullName: "Owner Name",
      email: "Email",
      phone: "Phone",
      logoUrl: "Logo (URL)",
      checkInHour: "Check-in (0..23, or empty)",
      checkOutHour: "Check-out (0..23, or empty)",
    },
    messages: {
      saving: "Saving...",
      save: "Save",
      cancel: "Cancel",
      invalidHour: "checkInHour must be 0..23 or null",
      invalidHourOut: "checkOutHour must be 0..23 or null",
      defaultNote: 'Set null (enter "null" in field) to follow hotel default',
    },
  },
  superAdminLayout: {
    nav: {
      dashboard: "Dashboard",
      hotels: "Hotels",
    },
    profile: {
      logout: "Logout",
    },
  },
  saDashboard: {
    title: "Superadmin Dashboard",
    stats: {
      totalHotels: "Total Hotels",
      activeHotels: "Active",
      blockedHotels: "Blocked",
      totalEditors: "Editors (total)",
      avgEditorsPerHotel: "per hotel",
    },
    latestHotels: {
      title: "Latest Hotels",
      goToList: "Go to list →",
      table: {
        hotel: "Hotel",
        address: "Address",
        login: "Login",
        created: "Created",
        status: "Status",
      },
      status: {
        blocked: "Blocked",
        active: "Active",
      },
      loading: "Loading…",
      empty: "Nothing yet",
    },
    createHotel: {
      title: "Add New Hotel",
    },
  },
  saHotelsList: {
    title: "Hotels",
    search: {
      placeholder: "Search: name, address, login, email, phone",
    },
    table: {
      hotelName: "Hotel Name",
      address: "Address",
      login: "Login",
      editors: "Editors",
      created: "Created",
      status: "Status",
      action: "Action",
    },
    status: {
      blocked: "Blocked",
      active: "Active",
    },
    actions: {
      info: "info",
      block: "block",
      unblock: "unblock",
      edit: "edit",
      delete: "Delete",
    },
    messages: {
      loading: "Loading…",
      nothingFound: "Nothing found",
      confirmBlock: "Block {username}?",
      confirmUnblock: "Unblock {username}?",
      confirmDelete: "Delete {username}? This action cannot be undone.",
      saveError: "Save error",
    },
  },
  saHotelDetail: {
    notFound: "Record not found",
    status: {
      blocked: "Blocked",
      active: "Active",
    },
    actions: {
      edit: "edit",
      block: "block",
      unblock: "unblock",
      delete: "delete",
      back: "Back",
    },
    sections: {
      contacts: "Contacts",
      checkinPolicies: "Check-in/Check-out Policy",
      userStats: "User Statistics",
      editors: "Editors",
    },
    fields: {
      login: "Login",
      owner: "Owner",
      email: "Email",
      phone: "Phone",
      checkInTime: "Check-in time",
      checkOutTime: "Check-out time",
      editors: "Editors",
      created: "Created",
      updated: "Updated",
      default: "default",
    },
    table: {
      login: "Login",
      name: "Name",
      email: "Email",
      phone: "Phone",
      status: "Status",
    },
    messages: {
      noEditors: "No editors yet",
      confirmBlock: "Block {username}?",
      confirmUnblock: "Unblock {username}?",
      confirmDelete: "Delete {username}? This action cannot be undone.",
      saveError: "Save error",
    },
  },
} as const;

export default en;
