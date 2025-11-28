<template>
  <div>
    <div v-if="loading" class="p-6 text-center">
      <div class="text-gray-500 dark:text-gray-400">
        {{ t("saHotelDetail.loading") }}
      </div>
    </div>
    <div v-else-if="!hotel" class="p-6 text-center">
      <div class="text-red-500 dark:text-red-400">
        {{ t("saHotelDetail.notFoundMessage") }}
      </div>
    </div>
    <div v-else class="p-6 space-y-6">
      <!-- Заголовок + кнопки действий -->
      <div class="flex items-center gap-4">
        <img
          :src="hotel.logo_url ?? undefined"
          class="h-16 w-16 rounded object-cover"
          alt="logo"
        />
        <div>
          <h1 class="text-2xl font-semibold text-brand dark:text-white">
            {{ hotel.hotel_name ?? "—" }}
          </h1>
          <div class="text-gray-500 dark:text-gray-400">
            {{ formatHotelAddress(hotel) }}
          </div>
        </div>

        <div class="ml-auto flex items-center gap-2">
          <span
            :class="
              hotel.isBlocked
                ? 'bg-red-600 py-[2px] px-[10px] rounded-lg text-white'
                : ' bg-emerald-400 py-[2px] px-[10px] rounded-lg text-white'
            "
          >
            {{
              hotel.isBlocked
                ? t("saHotelDetail.status.blocked")
                : t("saHotelDetail.status.active")
            }}
          </span>

          <button
            class="btn btn-sm underline"
            @click="openEdit(hotel.username)"
          >
            {{ t("saHotelDetail.actions.edit") }}
          </button>

          <button
            v-if="!hotel.isBlocked"
            class="btn btn-sm btn-warning underline"
            @click="onBlock(hotel.username)"
          >
            {{ t("saHotelDetail.actions.block") }}
          </button>
          <button
            v-else
            class="btn btn-sm btn-success underline"
            @click="onUnblock(hotel.username)"
          >
            {{ t("saHotelDetail.actions.unblock") }}
          </button>

          <button
            class="btn btn-sm btn-error underline"
            @click="onDelete(hotel.username)"
          >
            {{ t("saHotelDetail.actions.delete") }}
          </button>

          <button class="btn btn-sm underline" @click="goBack">
            {{ t("saHotelDetail.actions.back") }}
          </button>
        </div>
      </div>

      <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4"
        >
          <h2 class="font-medium mb-3 text-brand dark:text-white">
            {{ t("saHotelDetail.sections.contacts") }}
          </h2>
          <ul class="text-sm space-y-1 text-gray-700 dark:text-gray-300">
            <li>
              <b class="text-brand dark:text-white"
                >{{ t("saHotelDetail.fields.login") }}:</b
              >
              {{ hotel.username }}
            </li>
            <li>
              <b class="text-brand dark:text-white"
                >{{ t("saHotelDetail.fields.owner") }}:</b
              >
              {{ hotel.full_name ?? "—" }}
            </li>
            <li>
              <b class="text-brand dark:text-white"
                >{{ t("saHotelDetail.fields.email") }}:</b
              >
              {{ hotel.email ?? "—" }}
            </li>
            <li>
              <b class="text-brand dark:text-white"
                >{{ t("saHotelDetail.fields.phone") }}:</b
              >
              {{ hotel.phone ?? "—" }}
            </li>
          </ul>
        </div>

        <div
          class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4"
        >
          <h2 class="font-medium mb-3 text-brand dark:text-white">
            {{ t("saHotelDetail.sections.checkinPolicies") }}
          </h2>
          <div class="text-sm text-gray-700 dark:text-gray-300 space-y-2">
            <div>
              <b class="text-brand dark:text-white"
                >{{ t("saHotelDetail.fields.checkInTime") }}:</b
              >
              {{ hotel.checkInHour !== null ? `${hotel.checkInHour}:00` : t("saHotelDetail.fields.default") }}
            </div>
            <div>
              <b class="text-brand dark:text-white"
                >{{ t("saHotelDetail.fields.checkOutTime") }}:</b
              >
              {{ hotel.checkOutHour !== null ? `${hotel.checkOutHour}:00` : t("saHotelDetail.fields.default") }}
            </div>
            <div class="pt-2 border-t border-gray-200 dark:border-gray-600">
              <b class="text-brand dark:text-white"
                >{{ t("saHotelDetail.fields.wifiName") }}:</b
              >
              {{ hotel.defaultWifiName ?? "—" }}
            </div>
            <div>
              <b class="text-brand dark:text-white"
                >{{ t("saHotelDetail.fields.wifiPassword") }}:</b
              >
              {{ hotel.defaultWifiPassword ? "••••••••" : "—" }}
            </div>
          </div>
        </div>

        <div
          class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4"
        >
          <h2 class="font-medium mb-3 text-brand dark:text-white">
            {{ t("saHotelDetail.sections.userStats") }}
          </h2>
          <div class="text-sm text-gray-700 dark:text-gray-300">
            <div>
              <b class="text-brand dark:text-white"
                >{{ t("saHotelDetail.fields.editors") }}:</b
              >
              {{ hotel.editorsCount }}
            </div>
            <div>
              <b class="text-brand dark:text-white"
                >{{ t("saHotelDetail.fields.created") }}:</b
              >
              {{ new Date(hotel.createdAt).toLocaleString() }}
            </div>
            <div>
              <b class="text-brand dark:text-white"
                >{{ t("saHotelDetail.fields.updated") }}:</b
              >
              {{ new Date(hotel.updatedAt).toLocaleString() }}
            </div>
          </div>
        </div>
      </section>

      <section
        class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4"
      >
        <h2 class="font-medium mb-3 text-brand dark:text-white">
          {{ t("saHotelDetail.sections.editors") }}
        </h2>
        <table class="min-w-full text-sm">
          <thead
            class="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
          >
            <tr>
              <th class="px-3 py-2 text-left">
                {{ t("saHotelDetail.table.login") }}
              </th>
              <th class="px-3 py-2 text-left">
                {{ t("saHotelDetail.table.name") }}
              </th>
              <th class="px-3 py-2 text-left">
                {{ t("saHotelDetail.table.email") }}
              </th>
              <th class="px-3 py-2 text-left">
                {{ t("saHotelDetail.table.phone") }}
              </th>
              <th class="px-3 py-2 text-left">
                {{ t("saHotelDetail.table.status") }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="e in hotel.editors" :key="e.id" class="border-t">
              <td class="px-3 py-2">{{ e.username }}</td>
              <td class="px-3 py-2">{{ e.full_name ?? "—" }}</td>
              <td class="px-3 py-2">{{ e.email ?? "—" }}</td>
              <td class="px-3 py-2">{{ e.phone ?? "—" }}</td>
              <td class="px-3 py-2">
                <span
                  :class="e.isBlocked ? 'text-red-600' : 'text-emerald-700'"
                >
                  {{
                    e.isBlocked
                      ? t("saHotelDetail.status.blocked")
                      : t("saHotelDetail.status.active")
                  }}
                </span>
              </td>
            </tr>
            <tr v-if="hotel.editors.length === 0">
              <td colspan="5" class="px-3 py-4 text-center text-gray-500">
                {{ t("saHotelDetail.messages.noEditors") }}
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>

    <!-- Модалка редагування -->
    <EditHotelDialog
      v-if="editOpen && hotel"
      v-model="editOpen"
      :initial="hotel"
      @save="onSavePatch"
    />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useSuperHotelsStore } from "@/stores/superadmin";
import type { UpdateHotelAdminRequest } from "@/types/dto";
import EditHotelDialog from "@/components/superadmin/EditHotelDialog.vue";
import { useLocale } from "@/composables/useLocale";
import { useNotifications } from "@/composables/useNotifications";
import { formatHotelAddress } from "@/utils/formatAddress";

const route = useRoute();
const router = useRouter();
const { showError, showSuccess } = useNotifications();
const idParam = Number(route.params.id);

const store = useSuperHotelsStore();
const { t } = useLocale();
const { loading } = storeToRefs(store);

// Используем computed для автоматического обновления при изменении данных в store
const hotel = computed(() => {
  const h = store.byId(idParam);
  // Отладочный вывод для проверки данных
  if (import.meta.env.DEV && h) {
    console.log("[SaHotelDetail] Hotel data:", {
      id: h.id,
      username: h.username,
      defaultWifiName: h.defaultWifiName,
      defaultWifiPassword: h.defaultWifiPassword ? "***" : null,
    });
  }
  return h;
});

onMounted(async () => {
  // Всегда перезагружаем данные, чтобы получить актуальные значения из БД
  await store.fetchAll();
});

// Кнопки действий
async function onBlock(username: string): Promise<void> {
  if (!confirm(t("saHotelDetail.messages.confirmBlock", { username }))) return;
  await store.block(username);
}

async function onUnblock(username: string): Promise<void> {
  if (!confirm(t("saHotelDetail.messages.confirmUnblock", { username })))
    return;
  await store.unblock(username);
}

async function onDelete(username: string): Promise<void> {
  if (!confirm(t("saHotelDetail.messages.confirmDelete", { username }))) return;
  await store.removeUser(username);
  router.replace({ name: "sa-hotels" }); // назад до списку
}

function goBack(): void {
  router.back();
}

// editing
const editOpen = ref(false);
function openEdit(username: string): void {
  if (!hotel.value || hotel.value.username !== username) return;
  editOpen.value = true;
}

async function onSavePatch(patch: UpdateHotelAdminRequest): Promise<void> {
  console.log("[SaHotelDetail] onSavePatch called with patch:", {
    ...patch,
    defaultWifiPassword: patch.defaultWifiPassword ? "***" : null,
    phoneNumber: patch.phoneNumber ? "***" : null,
  });
  
  if (!hotel.value) {
    console.error("[SaHotelDetail] No hotel value, cannot save");
    return;
  }
  
  console.log("[SaHotelDetail] Updating hotel:", hotel.value.username);
  
  try {
    console.log("[SaHotelDetail] Calling store.updateHotel...");
    await store.updateHotel(hotel.value.username, patch);
    console.log("[SaHotelDetail] store.updateHotel completed successfully");
    
    // Перезагружаем данные из БД, чтобы получить актуальные значения
    console.log("[SaHotelDetail] Fetching all hotels...");
    await store.fetchAll();
    console.log("[SaHotelDetail] Data refreshed");
    
    // Закрываем модалку только после успешного сохранения
    console.log("[SaHotelDetail] Closing modal");
    editOpen.value = false;
    
    console.log("[SaHotelDetail] Showing success message");
    showSuccess(
      "Hotel updated successfully",
      "Hotel information has been saved and updated"
    );
  } catch (e: unknown) {
    console.error("[SaHotelDetail] Error in onSavePatch:", e);
    // Обрабатываем различные типы ошибок
    let errorMessage = "Unknown error occurred";
    if (e && typeof e === "object" && "response" in e) {
      const axiosError = e as { response?: { data?: { message?: string }; status?: number } };
      errorMessage = axiosError.response?.data?.message || 
        (axiosError.response?.status === 400 ? "Invalid data" : 
         axiosError.response?.status === 403 ? "Permission denied" : 
         axiosError.response?.status === 500 ? "Server error" : 
         errorMessage);
    } else if (e instanceof Error) {
      errorMessage = e.message;
    }
    console.error("[SaHotelDetail] Error message:", errorMessage);
    showError(
      t("saHotelDetail.messages.saveError"),
      errorMessage
    );
    // Не закрываем модалку при ошибке, чтобы пользователь мог исправить
  }
}
</script>
