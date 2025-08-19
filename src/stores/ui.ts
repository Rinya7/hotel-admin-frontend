//глобальний лоадер для всіх axios-запитів
// frontend/src/stores/ui.ts
//Store для лоадера
import { defineStore } from "pinia";

interface UiState {
  pending: number; // лічильник активних запитів
}

export const useUiStore = defineStore("ui", {
  state: (): UiState => ({
    pending: 0,
  }),
  getters: {
    isLoading: (s): boolean => s.pending > 0, // є хоча б один запит
  },
  actions: {
    start(): void {
      this.pending += 1;
    },
    stop(): void {
      // захист від від'ємного значення, якщо раптом десь двічі викликали stop
      this.pending = Math.max(0, this.pending - 1);
    },
    reset(): void {
      this.pending = 0;
    },
  },
});
