<!-- NotificationContainer.vue — контейнер для отображения уведомлений -->
<template>
  <div
    aria-live="assertive"
    class="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-50"
  >
    <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
      <Notification
        v-for="notification in notifications"
        :key="notification.id"
        :notification="notification"
        @close="closeNotification"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Notification from "./ui/Notification.vue";
import { useNotifications } from "@/composables/useNotifications";

const { notifications, closeNotification } = useNotifications();
</script>
