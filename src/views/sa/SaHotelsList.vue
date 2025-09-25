<template>
  <div class="space-y-6">
    <section
      class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
    >
      <h1 class="text-2xl font-semibold">{{ t("saHotelsList.title") }}</h1>
      <input
        v-model="query"
        type="text"
        :placeholder="t('saHotelsList.search.placeholder')"
        class="input input-bordered w-72"
      />
    </section>

    <section class="overflow-hidden rounded-2xl border bg-white">
      <table class="min-w-full text-sm">
        <thead class="bg-gray-50 text-gray-600">
          <tr>
            <th
              class="px-4 py-3 text-left cursor-pointer"
              @click="setSort('hotel_name')"
            >
              {{ t("saHotelsList.table.hotelName") }}
              <SortIcon :active="sortKey === 'hotel_name'" :dir="sortDir" />
            </th>
            <th
              class="px-4 py-3 text-left cursor-pointer"
              @click="setSort('address')"
            >
              {{ t("saHotelsList.table.address") }}
              <SortIcon :active="sortKey === 'address'" :dir="sortDir" />
            </th>
            <th
              class="px-4 py-3 text-left cursor-pointer"
              @click="setSort('username')"
            >
              {{ t("saHotelsList.table.login") }}
              <SortIcon :active="sortKey === 'username'" :dir="sortDir" />
            </th>
            <th
              class="px-4 py-3 text-left cursor-pointer"
              @click="setSort('editorsCount')"
            >
              {{ t("saHotelsList.table.editors") }}
              <SortIcon :active="sortKey === 'editorsCount'" :dir="sortDir" />
            </th>
            <th
              class="px-4 py-3 text-left cursor-pointer"
              @click="setSort('createdAt')"
            >
              {{ t("saHotelsList.table.created") }}
              <SortIcon :active="sortKey === 'createdAt'" :dir="sortDir" />
            </th>
            <th
              class="px-4 py-3 text-left cursor-pointer"
              @click="setSort('isBlocked')"
            >
              {{ t("saHotelsList.table.status") }}
              <SortIcon :active="sortKey === 'isBlocked'" :dir="sortDir" />
            </th>
            <th
              class="px-4 py-3 text-center cursor-pointer"
              @click="setSort('isBlocked')"
            >
              {{ t("saHotelsList.table.action") }}
            </th>
            <th class="px-4 py-3"></th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="loading">
            <td colspan="7" class="px-4 py-6 text-center text-gray-500">
              {{ t("saHotelsList.messages.loading") }}
            </td>
          </tr>

          <tr v-else-if="error">
            <td colspan="7" class="px-4 py-6 text-center text-red-600">
              {{ error }}
            </td>
          </tr>

          <template v-else>
            <tr
              v-for="h in hotels"
              :key="h.id"
              class="border-t hover:bg-gray-50"
            >
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <img
                    v-if="h.logo_url"
                    :src="h.logo_url"
                    alt="logo"
                    class="h-8 w-8 rounded object-cover"
                  />
                  <div>
                    <div class="font-medium">{{ h.hotel_name ?? "—" }}</div>
                    <div class="text-xs text-gray-500">
                      {{ h.full_name ?? "—" }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3">{{ h.address ?? "—" }}</td>
              <td class="px-4 py-3">{{ h.username }}</td>
              <td class="px-4 py-3">{{ h.editorsCount }}</td>
              <td class="px-4 py-3">
                {{ new Date(h.createdAt).toLocaleDateString() }}
              </td>
              <td class="px-4 py-3">
                <span
                  :class="h.isBlocked ? 'text-red-600' : 'text-emerald-700'"
                >
                  {{
                    h.isBlocked
                      ? t("saHotelsList.status.blocked")
                      : t("saHotelsList.status.active")
                  }}
                </span>
              </td>
              <td class="px-4 py-3 text-left">
                <!-- якщо робитимеш картку готелю, розкоментуй ↓ і маршрут у router -->
                <div class="flex justify-between gap-2 underline">
                  <RouterLink
                    :to="{ name: 'sa-hotel-detail', params: { id: h.id } }"
                    class="btn btn-sm"
                    >{{ t("saHotelsList.actions.info") }}</RouterLink
                  >

                  <button
                    v-if="!h.isBlocked"
                    class="btn btn-sm btn-warning"
                    @click="onBlock(h.username)"
                  >
                    {{ t("saHotelsList.actions.block") }}
                  </button>
                  <button
                    v-else
                    class="btn btn-sm btn-success"
                    @click="onUnblock(h.username)"
                  >
                    {{ t("saHotelsList.actions.unblock") }}
                  </button>
                  <button class="btn btn-sm" @click="openEdit(h.username)">
                    {{ t("saHotelsList.actions.edit") }}
                  </button>
                  <button
                    class="btn btn-sm btn-error"
                    @click="onDelete(h.username)"
                  >
                    {{ t("saHotelsList.actions.delete") }}
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="hotels.length === 0">
              <td colspan="7" class="px-4 py-6 text-center text-gray-500">
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

const store = useSuperHotelsStore();
const { t } = useLocale();
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
  } catch (e) {
    alert(
      e instanceof Error ? e.message : t("saHotelsList.messages.saveError")
    );
  }
}
</script>
