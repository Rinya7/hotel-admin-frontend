<template>
  <div class="space-y-6">
    <section
      class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:py-[24px]"
    >
      <h1 class="text-2xl font-semibold text-brand dark:text-white">
        {{ t("saHotelsList.title") }}
      </h1>
      <input
        v-model="query"
        type="text"
        :placeholder="t('saHotelsList.search.placeholder')"
        class="w-1/3 text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-2xl text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand"
      />
    </section>

    <section
      class="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
    >
      <table class="w-full text-sm table-fixed">
        <thead
          class="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
        >
          <tr>
            <th
              class="lg:w-1/7 xl:w-auto px-4 py-3 text-left cursor-pointer"
              @click="setSort('hotel_name')"
            >
              {{ t("saHotelsList.table.hotelName") }}
              <SortIcon :active="sortKey === 'hotel_name'" :dir="sortDir" />
            </th>
            <th
              class="lg:w-1/6 xl:w-[10%] px-4 py-3 text-left cursor-pointer"
              @click="setSort('street')"
            >
              {{ t("saHotelsList.table.address") }}
              <SortIcon :active="sortKey === 'street'" :dir="sortDir" />
            </th>
            <th
              class="hidden lg:table-cell lg:w-1/8 xl:w-1/7 px-4 py-3 text-center cursor-pointer"
              @click="setSort('username')"
            >
              {{ t("saHotelsList.table.login") }}
              <SortIcon :active="sortKey === 'username'" :dir="sortDir" />
            </th>
            <th
              class="hidden xl:table-cell xl:w-auto px-4 py-3 text-center cursor-pointer"
              @click="setSort('editorsCount')"
            >
              {{ t("saHotelsList.table.editors") }}
              <SortIcon :active="sortKey === 'editorsCount'" :dir="sortDir" />
            </th>
            <th
              class="hidden xl:table-cell xl:w-1/7 px-4 py-3 text-center cursor-pointer"
              @click="setSort('createdAt')"
            >
              {{ t("saHotelsList.table.created") }}
              <SortIcon :active="sortKey === 'createdAt'" :dir="sortDir" />
            </th>
            <th
              class="xl:w-1/6 px-4 py-3 text-center cursor-pointer"
              @click="setSort('isBlocked')"
            >
              {{ t("saHotelsList.table.status") }}
              <SortIcon :active="sortKey === 'isBlocked'" :dir="sortDir" />
            </th>
            <th class="xl:w-1/3 px-4 py-3 text-center">
              {{ t("saHotelsList.table.action") }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="loading">
            <td
              colspan="7"
              class="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
            >
              {{ t("saHotelsList.messages.loading") }}
            </td>
          </tr>

          <tr v-else-if="error">
            <td
              colspan="7"
              class="px-4 py-6 text-center text-red-600 dark:text-red-400"
            >
              {{ error }}
            </td>
          </tr>

          <template v-else>
            <tr
              v-for="h in hotels"
              :key="h.id"
              class="border-t border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <img
                    :src="h.logo_url"
                    alt="logo"
                    class="h-8 w-8 rounded object-cover flex-shrink-0"
                  />
                  <div class="min-w-0">
                    <div class="font-medium text-gray-900 dark:text-white">
                      {{ h.hotel_name ?? "—" }}
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">
                      {{ h.full_name ?? "—" }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 lg:w-max text-gray-700 dark:text-gray-300">
                <!-- Если есть координаты - показываем кликабельный текст "на карте" -->
                <div v-if="h.latitude && h.longitude" class="truncate">
                  <a
                    :href="`https://www.google.com/maps?q=${h.latitude},${h.longitude}`"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    :title="`${t('saHotelsList.openMap')}: ${formatHotelAddress(h)}`"
                  >
                    <svg
                      class="w-4 h-4 inline"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {{ t("saHotelsList.onMap") }}
                  </a>
                </div>
                <!-- Если нет координат - показываем адрес как кликабельную ссылку на Google Maps по адресу -->
                <div v-else-if="formatHotelAddress(h) !== '—'" class="truncate">
                  <a
                    :href="`https://www.google.com/maps?q=${encodeURIComponent(formatHotelAddress(h))}`"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-blue-600 dark:text-blue-400 hover:underline"
                    :title="t('saHotelsList.openMap')"
                  >
                    {{ formatHotelAddress(h) }}
                  </a>
                </div>
                <!-- Если адреса вообще нет -->
                <div v-else class="truncate">
                  {{ formatHotelAddress(h) }}
                </div>
              </td>
              <td
                class="hidden lg:table-cell lg:w-max text-center px-4 py-3 text-gray-700 dark:text-gray-300"
              >
                <div class="truncate">
                  {{ h.username }}
                </div>
              </td>
              <td
                class="hidden xl:table-cell xl:w-max px-4 py-3 text-center text-gray-700 dark:text-gray-300"
              >
                {{ h.editorsCount }}
              </td>
              <td
                class="hidden xl:table-cell xl:w-max text-center px-4 py-3 text-gray-700 dark:text-gray-300"
              >
                {{ new Date(h.createdAt).toLocaleDateString() }}
              </td>
              <td class="px-4 py-3 text-center truncate">
                <span
                  :class="
                    h.isBlocked
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-emerald-700 dark:text-emerald-400'
                  "
                >
                  {{
                    h.isBlocked
                      ? t("saHotelsList.status.blocked")
                      : t("saHotelsList.status.active")
                  }}
                </span>
              </td>
              <td class="px-4 py-3">
                <!-- якщо робитимеш картку готелю, розкоментуй ↓ і маршрут у router -->
                <div
                  class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-1 justify-items-center"
                >
                  <RouterLink
                    :to="{ name: 'sa-hotel-detail', params: { id: h.id } }"
                    class="w-full px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-800 dark:text-blue-200 rounded transition-colors whitespace-nowrap text-center"
                    >{{ t("saHotelsList.actions.info") }}</RouterLink
                  >

                  <button
                    v-if="!h.isBlocked"
                    class="w-full px-2 py-1 text-xs bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900 dark:hover:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded transition-colors whitespace-nowrap"
                    @click="onBlock(h.username)"
                  >
                    {{ t("saHotelsList.actions.block") }}
                  </button>
                  <button
                    v-else
                    class="w-full px-2 py-1 text-xs bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800 text-green-800 dark:text-green-200 rounded transition-colors whitespace-nowrap"
                    @click="onUnblock(h.username)"
                  >
                    {{ t("saHotelsList.actions.unblock") }}
                  </button>
                  <button
                    class="w-full px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded transition-colors whitespace-nowrap"
                    @click="openEdit(h.username)"
                  >
                    {{ t("saHotelsList.actions.edit") }}
                  </button>
                  <button
                    class="w-full px-2 py-1 text-xs bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-800 dark:text-red-200 rounded transition-colors whitespace-nowrap"
                    @click="onDelete(h.username)"
                  >
                    {{ t("saHotelsList.actions.delete") }}
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="hotels.length === 0">
              <td
                colspan="7"
                class="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
              >
                {{ t("saHotelsList.messages.nothingFound") }}
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </section>
  </div>
  <!-- Модалка редагування: шукаємо поточний item за username -->
  <EditHotelDialog
    v-if="editOpen && hotels.find((x) => x.username === editingUsername)"
    v-model="editOpen"
    :initial="hotels.find(x => x.username === editingUsername)!"
    @save="onSavePatch"
  />
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useSuperHotelsStore } from "@/stores/superadmin.ts";
import SortIcon from "@/components/common/SortIcon.vue";
import EditHotelDialog from "@/components/superadmin/EditHotelDialog.vue";
import type { UpdateHotelAdminRequest } from "@/types/dto";
import { useLocale } from "@/composables/useLocale";
import { useNotifications } from "@/composables/useNotifications";
import { formatHotelAddress } from "@/utils/formatAddress";

const store = useSuperHotelsStore();
const { t } = useLocale();
const { showError, showSuccess } = useNotifications();
const { loading, error, sorted, sortKey, sortDir } = storeToRefs(store);

onMounted(() => {
  void store.fetchAll(); //   http сам поставить токен/loader
});

const query = computed({
  get: () => store.query,
  set: (v: string) => store.setQuery(v),
});

const hotels = computed(() => sorted.value);

function setSort(key: Parameters<typeof store.setSort>[0]) {
  store.setSort(key);
}

// action block/unblock/delete
async function onBlock(username: string): Promise<void> {
  if (!confirm(t("saHotelsList.messages.confirmBlock", { username }))) return;
  await store.block(username);
}
async function onUnblock(username: string): Promise<void> {
  if (!confirm(t("saHotelsList.messages.confirmUnblock", { username }))) return;
  await store.unblock(username);
}
async function onDelete(username: string): Promise<void> {
  if (!confirm(t("saHotelsList.messages.confirmDelete", { username }))) return;
  await store.removeUser(username);
}

// === Editing ===
const editOpen = ref(false);
const editingUsername = ref<string>("");

function openEdit(username: string): void {
  editingUsername.value = username;
  editOpen.value = true;
}

async function onSavePatch(patch: UpdateHotelAdminRequest): Promise<void> {
  if (!editingUsername.value) return;
  try {
    await store.updateHotel(editingUsername.value, patch);
    showSuccess(
      "Hotel updated successfully",
      "Hotel information has been saved and updated"
    );
  } catch (e) {
    showError(
      t("saHotelsList.messages.saveError"),
      e instanceof Error ? e.message : "Unknown error occurred"
    );
  }
}
</script>
