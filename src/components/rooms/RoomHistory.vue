<!-- RoomHistory.vue — історія змін статусів кімнати (використовує AuditLogViewer) -->
<template>
  <AuditLogViewer
    :logs="auditLogs"
    :title="t('roomHistory.title')"
    :show-entity="true"
    :show-comment="true"
    :loading="loading"
    :error="error"
  />
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { fetchRoomHistory } from "@/api/rooms";
import type { RoomStatusLog } from "@/types/rooms";
import type { AuditLog } from "@/types/common";
import AuditLogViewer from "@/components/common/AuditLogViewer.vue";

const route = useRoute();
const { t } = useI18n();
const roomNumber = route.params.roomNumber as string;

const logs = ref<RoomStatusLog[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

// Конвертуємо RoomStatusLog в AuditLog
const auditLogs = computed<AuditLog[]>(() => {
  return logs.value.map((log) => ({
    oldStatus: log.oldStatus,
    newStatus: log.newStatus,
    changedAt: log.changedAt,
    changedBy: log.changedBy || null,
    changedByRole: log.changedByRole || null,
    entityLabel: log.stay?.mainGuestName || log.entityLabel,
    entityLink: log.stay ? `/stays/${log.stay.id}` : log.entityLink,
    comment: log.comment || null,
  }));
});

async function loadHistory() {
  loading.value = true;
  error.value = null;
  try {
    const data = await fetchRoomHistory(roomNumber);
    logs.value = data.logs || [];
  } catch (err) {
    error.value =
      err instanceof Error ? err.message : "Помилка завантаження історії";
    console.error("Error loading room history:", err);
  } finally {
    loading.value = false;
  }
}

onMounted(loadHistory);

defineExpose({ loadHistory });
</script>
