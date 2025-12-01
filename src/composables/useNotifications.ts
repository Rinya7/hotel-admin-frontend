// useNotifications.ts — composable для управления уведомлениями
import { ref } from "vue";

export interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  visible: boolean;
  duration?: number;
}

const notifications = ref<Notification[]>([]);

export function useNotifications() {
  // Создание нового уведомления
  function showNotification(
    type: Notification["type"],
    title: string,
    message?: string,
    duration: number = 5000
  ): string {
    const id = `notification-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    const notification: Notification = {
      id,
      type,
      title,
      message,
      visible: true,
      duration,
    };

    notifications.value.push(notification);

    // Автоматическое удаление через указанное время
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  }

  // Успешное уведомление
  function showSuccess(
    title: string,
    message?: string,
    duration?: number
  ): string {
    return showNotification("success", title, message, duration);
  }

  // Уведомление об ошибке
  function showError(
    title: string,
    message?: string,
    duration?: number
  ): string {
    return showNotification("error", title, message, duration);
  }

  // Предупреждение
  function showWarning(
    title: string,
    message?: string,
    duration?: number
  ): string {
    return showNotification("warning", title, message, duration);
  }

  // Информационное уведомление
  function showInfo(
    title: string,
    message?: string,
    duration?: number
  ): string {
    return showNotification("info", title, message, duration);
  }

  // Удаление уведомления
  function removeNotification(id: string): void {
    const index = notifications.value.findIndex((n) => n.id === id);
    if (index > -1) {
      notifications.value.splice(index, 1);
    }
  }

  // Закрытие уведомления (с анимацией)
  function closeNotification(id: string): void {
    const notification = notifications.value.find((n) => n.id === id);
    if (notification) {
      notification.visible = false;
      // Удаляем из массива после завершения анимации
      setTimeout(() => {
        removeNotification(id);
      }, 300); // Время анимации из CSS
    }
  }

  // Очистка всех уведомлений
  function clearAll(): void {
    notifications.value = [];
  }

  return {
    notifications: notifications.value,
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeNotification,
    closeNotification,
    clearAll,
  };
}
