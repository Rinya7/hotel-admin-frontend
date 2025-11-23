<!-- StayHistory.vue — історія змін статусів проживання (використовує AuditLogViewer) -->
<template>
  <AuditLogViewer
    :logs="auditLogs"
    title="Історія бронювання"
    :show-entity="false"
    :show-comment="true"
    :loading="loading"
    :error="error"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { fetchStayHistory } from "@/api/stays";
import type { StayStatusLog } from "@/types/stays";
import type { AuditLog } from "@/types/common";
import AuditLogViewer from "@/components/common/AuditLogViewer.vue";

interface Props {
  stayId: number;
}

const props = defineProps<Props>();

const logs = ref<StayStatusLog[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

// Конвертуємо StayStatusLog в AuditLog
const auditLogs = computed<AuditLog[]>(() => {
  return logs.value.map((log) => ({
    oldStatus: log.oldStatus,
    newStatus: log.newStatus,
    changedAt: log.changedAt,
    changedBy: log.changedBy || null,
    changedByRole: log.changedByRole || null,
    entityLabel: log.entityLabel,
    entityLink: log.entityLink,
    comment: log.comment || null,
  }));
});

async function loadHistory() {
  loading.value = true;
  error.value = null;
  try {
    const data = await fetchStayHistory(props.stayId);
    logs.value = data.logs || [];
  } catch (err) {
    error.value =
      err instanceof Error ? err.message : "Помилка завантаження історії";
    console.error(`[StayHistory] Error loading stay history for stay ${props.stayId}:`, err);
    if (err && typeof err === "object" && "response" in err) {
      const axiosError = err as { response?: { status?: number; data?: unknown } };
      console.error(`[StayHistory] Error status: ${axiosError.response?.status}`);
      console.error(`[StayHistory] Error data:`, axiosError.response?.data);
    }
  } finally {
    loading.value = false;
  }
}

onMounted(loadHistory);

defineExpose({ loadHistory });
</script>
