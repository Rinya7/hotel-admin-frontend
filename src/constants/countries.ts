// src/constants/countries.ts
// Список стран Европы для выбора в формах

export interface Country {
  code: string; // ISO 3166-1 alpha-2 код
  phoneCode: string; // Телефонный код (например, +39, +380)
  names: {
    uk: string; // Украинский
    en: string; // Английский
    de: string; // Немецкий
    it: string; // Итальянский
  };
}

export const EUROPEAN_COUNTRIES: Country[] = [
  { code: "IT", phoneCode: "+39", names: { uk: "Італія", en: "Italy", de: "Italien", it: "Italia" } },
  { code: "UA", phoneCode: "+380", names: { uk: "Україна", en: "Ukraine", de: "Ukraine", it: "Ucraina" } },
  { code: "PL", phoneCode: "+48", names: { uk: "Польща", en: "Poland", de: "Polen", it: "Polonia" } },
  { code: "DE", phoneCode: "+49", names: { uk: "Німеччина", en: "Germany", de: "Deutschland", it: "Germania" } },
  { code: "FR", phoneCode: "+33", names: { uk: "Франція", en: "France", de: "Frankreich", it: "Francia" } },
  { code: "ES", phoneCode: "+34", names: { uk: "Іспанія", en: "Spain", de: "Spanien", it: "Spagna" } },
  { code: "GB", phoneCode: "+44", names: { uk: "Великобританія", en: "United Kingdom", de: "Vereinigtes Königreich", it: "Regno Unito" } },
  { code: "AT", phoneCode: "+43", names: { uk: "Австрія", en: "Austria", de: "Österreich", it: "Austria" } },
  { code: "BE", phoneCode: "+32", names: { uk: "Бельгія", en: "Belgium", de: "Belgien", it: "Belgio" } },
  { code: "BG", phoneCode: "+359", names: { uk: "Болгарія", en: "Bulgaria", de: "Bulgarien", it: "Bulgaria" } },
  { code: "HR", phoneCode: "+385", names: { uk: "Хорватія", en: "Croatia", de: "Kroatien", it: "Croazia" } },
  { code: "CY", phoneCode: "+357", names: { uk: "Кіпр", en: "Cyprus", de: "Zypern", it: "Cipro" } },
  { code: "CZ", phoneCode: "+420", names: { uk: "Чехія", en: "Czech Republic", de: "Tschechien", it: "Repubblica Ceca" } },
  { code: "DK", phoneCode: "+45", names: { uk: "Данія", en: "Denmark", de: "Dänemark", it: "Danimarca" } },
  { code: "EE", phoneCode: "+372", names: { uk: "Естонія", en: "Estonia", de: "Estland", it: "Estonia" } },
  { code: "FI", phoneCode: "+358", names: { uk: "Фінляндія", en: "Finland", de: "Finnland", it: "Finlandia" } },
  { code: "GR", phoneCode: "+30", names: { uk: "Греція", en: "Greece", de: "Griechenland", it: "Grecia" } },
  { code: "HU", phoneCode: "+36", names: { uk: "Угорщина", en: "Hungary", de: "Ungarn", it: "Ungheria" } },
  { code: "IE", phoneCode: "+353", names: { uk: "Ірландія", en: "Ireland", de: "Irland", it: "Irlanda" } },
  { code: "LV", phoneCode: "+371", names: { uk: "Латвія", en: "Latvia", de: "Lettland", it: "Lettonia" } },
  { code: "LT", phoneCode: "+370", names: { uk: "Литва", en: "Lithuania", de: "Litauen", it: "Lituania" } },
  { code: "LU", phoneCode: "+352", names: { uk: "Люксембург", en: "Luxembourg", de: "Luxemburg", it: "Lussemburgo" } },
  { code: "MT", phoneCode: "+356", names: { uk: "Мальта", en: "Malta", de: "Malta", it: "Malta" } },
  { code: "NL", phoneCode: "+31", names: { uk: "Нідерланди", en: "Netherlands", de: "Niederlande", it: "Paesi Bassi" } },
  { code: "PT", phoneCode: "+351", names: { uk: "Португалія", en: "Portugal", de: "Portugal", it: "Portogallo" } },
  { code: "RO", phoneCode: "+40", names: { uk: "Румунія", en: "Romania", de: "Rumänien", it: "Romania" } },
  { code: "SK", phoneCode: "+421", names: { uk: "Словаччина", en: "Slovakia", de: "Slowakei", it: "Slovacchia" } },
  { code: "SI", phoneCode: "+386", names: { uk: "Словенія", en: "Slovenia", de: "Slowenien", it: "Slovenia" } },
  { code: "SE", phoneCode: "+46", names: { uk: "Швеція", en: "Sweden", de: "Schweden", it: "Svezia" } },
  { code: "CH", phoneCode: "+41", names: { uk: "Швейцарія", en: "Switzerland", de: "Schweiz", it: "Svizzera" } },
  { code: "NO", phoneCode: "+47", names: { uk: "Норвегія", en: "Norway", de: "Norwegen", it: "Norvegia" } },
  { code: "IS", phoneCode: "+354", names: { uk: "Ісландія", en: "Iceland", de: "Island", it: "Islanda" } },
];

/**
 * Получить локализованное название страны
 */
export function getCountryName(country: Country, locale: "uk" | "en" | "de" | "it"): string {
  return country.names[locale] || country.names.en;
}

/**
 * Получить список стран с локализованными названиями
 */
export function getCountries(locale: "uk" | "en" | "de" | "it"): Array<{ code: string; name: string; phoneCode: string }> {
  return EUROPEAN_COUNTRIES.map((country) => ({
    code: country.code,
    name: getCountryName(country, locale),
    phoneCode: country.phoneCode,
  }));
}

/**
 * Получить страну по коду
 */
export function getCountryByCode(code: string): Country | undefined {
  return EUROPEAN_COUNTRIES.find((c) => c.code === code);
}

/**
 * Получить страну по телефонному коду
 */
export function getCountryByPhoneCode(phoneCode: string): Country | undefined {
  return EUROPEAN_COUNTRIES.find((c) => c.phoneCode === phoneCode);
}

