<!-- AuditCenter.vue — централізована сторінка для перегляду всіх audit logs -->
<template>
  <div class="space-y-4">
    <h1 class="text-2xl font-semibold mb-4 text-brand dark:text-white">
      🕓 Audit Center
    </h1>

    <!-- Панель фільтрів -->
    <div
      class="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg p-4"
    >
      <div class="flex flex-wrap gap-4 items-end">
        <div>
          <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Тип
          </label>
          <select
            v-model="filters.type"
            class="border rounded px-2 py-1 min-w-[150px] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">Всі</option>
            <option value="room">Room</option>
            <option value="stay">Stay</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Користувач
          </label>
          <input
            v-model="filters.user"
            type="text"
            class="border rounded px-2 py-1 min-w-[150px] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="frontdesk-1"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Роль
          </label>
          <select
            v-model="filters.role"
            class="border rounded px-2 py-1 min-w-[150px] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">Всі</option>
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="guest">Guest</option>
            <option value="system">System</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Від дати
          </label>
          <input
            v-model="filters.from"
            type="date"
            class="border rounded px-2 py-1 min-w-[150px] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            До дати
          </label>
          <input
            v-model="filters.to"
            type="date"
            class="border rounded px-2 py-1 min-w-[150px] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <Button @click="loadLogs" class="ml-auto">🔍 Пошук</Button>
        <Button @click="clearFilters" variant="outline">Очистити</Button>
      </div>
    </div>

    <!-- Відображення логів -->
    <AuditLogViewer
      :logs="logs"
      title="Історія всіх дій"
      :showEntity="true"
      :showType="true"
      :loading="loading"
      :error="error"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import AuditLogViewer from "@/components/common/AuditLogViewer.vue";
import Button from "@/components/ui/Button.vue";
import { getAuditLogs, type AuditLogsQuery } from "@/api/audit";
import type { AuditLog } from "@/types/common";

const logs = ref<AuditLog[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

const filters = ref<{
  type: "" | "room" | "stay";
  user: string;
  role: "" | "guest" | "admin" | "editor" | "system";
  from: string;
  to: string;
}>({
  type: "",
  user: "",
  role: "",
  from: "",
  to: "",
});

/**
 * Завантажити логи з бекенду з урахуванням фільтрів
 */
async function loadLogs(): Promise<void> {
  loading.value = true;
  error.value = null;

  try {
    // Формуємо параметри запиту
    const params: AuditLogsQuery = {};

    if (filters.value.type) {
      params.type = filters.value.type;
    }
    if (filters.value.user.trim()) {
      params.user = filters.value.user.trim();
    }
    if (filters.value.role) {
      params.role = filters.value.role;
    }
    if (filters.value.from) {
      // Конвертуємо дату в ISO формат (додаємо час, якщо потрібно)
      const fromDate = new Date(filters.value.from);
      fromDate.setHours(0, 0, 0, 0);
      params.from = fromDate.toISOString();
    }
    if (filters.value.to) {
      // Конвертуємо дату в ISO формат (встановлюємо кінець дня)
      const toDate = new Date(filters.value.to);
      toDate.setHours(23, 59, 59, 999);
      params.to = toDate.toISOString();
    }

    const data = await getAuditLogs(params);
    // Завжди встановлюємо масив (навіть якщо порожній)
    logs.value = Array.isArray(data) ? data : [];
    // Очищаємо помилку при успішному завантаженні
    error.value = null;
    
    // Якщо масив порожній і не було помилки - це нормально (немає даних)
    // Компонент AuditLogViewer сам відобразить "Немає записів в історії"
  } catch (err) {
    console.error("Помилка завантаження audit logs:", err);
    
    // Якщо помилка 404 - це означає, що endpoint не знайдено або немає даних
    if (err && typeof err === "object" && "response" in err) {
      const axiosError = err as { response?: { status?: number } };
      if (axiosError.response?.status === 404) {
        error.value = "Endpoint не знайдено. Перевірте, чи правильно налаштований сервер.";
      } else {
        error.value = `Помилка сервера (${axiosError.response?.status || "unknown"}). Спробуйте пізніше.`;
      }
    } else {
      error.value = err instanceof Error ? err.message : "Не вдалося завантажити логи";
    }
    
    // Навіть при помилці встановлюємо порожній масив
    logs.value = [];
  } finally {
    loading.value = false;
  }
}

/**
 * Очистити всі фільтри та завантажити всі логи
 */
function clearFilters(): void {
  filters.value = {
    type: "",
    user: "",
    role: "",
    from: "",
    to: "",
  };
  loadLogs();
}

// Автоматичне завантаження при відкритті сторінки
onMounted(() => {
  loadLogs();
});
</script>

<style scoped>
select,
input[type="date"],
input[type="text"] {
  min-width: 150px;
}
</style>

