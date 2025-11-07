// src/utils/formatPhone.ts
// Утилиты для форматирования номера телефона

/**
 * Форматирует номер телефона в формат 111-111-11-11
 * Удаляет все нецифровые символы и добавляет дефисы
 * @param phoneNumber - Номер телефона (только цифры)
 * @returns Отформатированный номер (111-111-11-11) или исходная строка
 */
export function formatPhoneNumber(phoneNumber: string | null | undefined): string {
  if (!phoneNumber) return "";

  // Убираем все символы кроме цифр
  const digits = phoneNumber.replace(/\D/g, "");

  if (digits.length === 0) return "";

  // Форматируем: 111-111-11-11 (3-3-2-2)
  if (digits.length <= 3) {
    return digits;
  } else if (digits.length <= 6) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  } else if (digits.length <= 8) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  } else {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 8)}-${digits.slice(8, 10)}`;
  }
}

/**
 * Убирает форматирование из номера телефона (оставляет только цифры)
 * @param phoneNumber - Номер телефона с форматированием
 * @returns Номер телефона только с цифрами
 */
export function normalizePhoneNumber(phoneNumber: string | null | undefined): string {
  if (!phoneNumber) return "";
  // Убираем все символы кроме цифр
  return phoneNumber.replace(/\D/g, "");
}

