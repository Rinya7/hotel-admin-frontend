// src/utils/formatAddress.ts
// Утилита для форматирования детального адреса в строку для отображения

import type { PublicAdminUser } from "@/types/hotel";

/**
 * Тип для объекта с полями адреса (используется в PublicAdminUser и EditorProfile["hotel"])
 */
export interface AddressFields {
  street?: string | null;
  buildingNumber?: string | null;
  apartmentNumber?: string | null;
  province?: string | null;
  postalCode?: string | null;
  country?: string | null;
}

/**
 * Форматирует детальный адрес отеля в строку для отображения
 * @param hotel - объект отеля с детальными полями адреса (PublicAdminUser или EditorProfile["hotel"])
 * @returns отформатированный адрес или "—" если адреса нет
 */
export function formatHotelAddress(hotel: PublicAdminUser | AddressFields): string {
  const parts: string[] = [];

  // Улица - обязательная часть
  if (hotel.street) {
    parts.push(hotel.street);
  }

  // Номер здания
  if (hotel.buildingNumber) {
    parts.push(hotel.buildingNumber);
  }

  // Номер помещения (опционально) - скрыто в формах, но используется для отображения адреса
  // Назначение: для аренды апартаментов, когда один отель/здание содержит несколько отдельных апартаментов
  if (hotel.apartmentNumber) {
    parts.push(`кв. ${hotel.apartmentNumber}`);
  }

  // Провинция
  if (hotel.province) {
    parts.push(hotel.province);
  }

  // Почтовый индекс
  if (hotel.postalCode) {
    parts.push(hotel.postalCode);
  }

  // Страна
  if (hotel.country) {
    parts.push(hotel.country);
  }

  return parts.length > 0 ? parts.join(", ") : "—";
}

/**
 * Получает строку адреса для поиска (все части адреса)
 */
export function getAddressSearchString(hotel: PublicAdminUser | AddressFields): string {
  const parts: string[] = [];

  if (hotel.street) parts.push(hotel.street);
  if (hotel.buildingNumber) parts.push(hotel.buildingNumber);
  if (hotel.apartmentNumber) parts.push(hotel.apartmentNumber);
  if (hotel.province) parts.push(hotel.province);
  if (hotel.postalCode) parts.push(hotel.postalCode);
  if (hotel.country) parts.push(hotel.country);

  return parts.join(" ").toLowerCase();
}

