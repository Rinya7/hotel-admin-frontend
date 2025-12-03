// src/stores/needsAction.ts
// Pinia store для управління stays, які потребують дії (needsAction = true).

import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { StayNeedsAction } from "@/types/stays";
import {
  getNeedsActionStays,
  resolveNoShow,
  resolveCheckInNow,
  resolveCheckOutNow,
  resolveEditDates,
  resolveExtendStay,
} from "@/api/stays";
import type {
  ResolveNoShowRequest,
  ResolveCheckInNowRequest,
  ResolveCheckOutNowRequest,
  ResolveEditDatesRequest,
  ResolveExtendStayRequest,
} from "@/types/stays";

export const useNeedsActionStore = defineStore("needsAction", () => {
  // State
  const items = ref<StayNeedsAction[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const hasItems = computed(() => items.value.length > 0);
  const missedCheckInItems = computed(() =>
    items.value.filter((item) => item.needsActionReason === "missed_checkin")
  );
  const missedCheckOutItems = computed(() =>
    items.value.filter((item) => item.needsActionReason === "missed_checkout")
  );

  // Actions

  /**
   * Завантажує список stays, які потребують дії.
   */
  async function load(): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      items.value = await getNeedsActionStays();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load needs action stays";
      error.value = message;
      console.error("[NeedsActionStore] load error:", err);
    } finally {
      loading.value = false;
    }
  }

  /**
   * Скасовує stay (зміна статусу на cancelled).
   */
  async function resolveNoShowAction(
    stayId: number,
    payload?: ResolveNoShowRequest
  ): Promise<void> {
    try {
      await resolveNoShow(stayId, payload);
      // Видаляємо stay зі списку після успішного резолву
      items.value = items.value.filter((item) => item.id !== stayId);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to cancel stay";
      error.value = message;
      throw err;
    }
  }

  /**
   * Виконує check-in зараз (occupied).
   */
  async function resolveCheckInNowAction(
    stayId: number,
    payload?: ResolveCheckInNowRequest
  ): Promise<void> {
    try {
      await resolveCheckInNow(stayId, payload);
      // Видаляємо stay зі списку після успішного резолву
      items.value = items.value.filter((item) => item.id !== stayId);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to resolve check-in";
      error.value = message;
      throw err;
    }
  }

  /**
   * Виконує check-out зараз (completed).
   */
  async function resolveCheckOutNowAction(
    stayId: number,
    payload?: ResolveCheckOutNowRequest
  ): Promise<void> {
    try {
      await resolveCheckOutNow(stayId, payload);
      // Видаляємо stay зі списку після успішного резолву
      items.value = items.value.filter((item) => item.id !== stayId);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to resolve check-out";
      error.value = message;
      throw err;
    }
  }

  /**
   * Оновлює дати stay (check-in або check-out).
   */
  async function resolveEditDatesAction(
    stayId: number,
    payload: ResolveEditDatesRequest
  ): Promise<void> {
    try {
      await resolveEditDates(stayId, payload);
      // Видаляємо stay зі списку після успішного резолву
      items.value = items.value.filter((item) => item.id !== stayId);
    } catch (err) {
      // Извлекаем детальное сообщение из response
      let message = "Failed to edit dates";
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as {
          response?: { data?: { message?: string } };
        };
        message = axiosError.response?.data?.message || message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      error.value = message;
      // Создаем новую ошибку с детальным сообщением для компонента
      const enhancedError = new Error(message);
      if (err && typeof err === "object" && "response" in err) {
        (enhancedError as any).response = (err as any).response;
      }
      throw enhancedError;
    }
  }

  /**
   * Продовжує stay (оновлює checkOut).
   */
  async function resolveExtendStayAction(
    stayId: number,
    payload: ResolveExtendStayRequest
  ): Promise<void> {
    try {
      await resolveExtendStay(stayId, payload);
      // Видаляємо stay зі списку після успішного резолву
      items.value = items.value.filter((item) => item.id !== stayId);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to extend stay";
      error.value = message;
      throw err;
    }
  }

  return {
    // State
    items,
    loading,
    error,
    // Getters
    hasItems,
    missedCheckInItems,
    missedCheckOutItems,
    // Actions
    load,
    resolveNoShow: resolveNoShowAction,
    resolveCheckInNow: resolveCheckInNowAction,
    resolveCheckOutNow: resolveCheckOutNowAction,
    resolveEditDates: resolveEditDatesAction,
    resolveExtendStay: resolveExtendStayAction,
  };
});

