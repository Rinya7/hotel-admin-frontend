<template>
  <div class="space-y-6">
    <section
      class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
    >
      <h1 class="text-2xl font-semibold">Hotels</h1>
      <input
        v-model="query"
        type="text"
        placeholder="Пошук: назва, адреса, логін, email, телефон"
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
              Назва готелю
              <SortIcon :active="sortKey === 'hotel_name'" :dir="sortDir" />
            </th>
            <th
              class="px-4 py-3 text-left cursor-pointer"
              @click="setSort('address')"
            >
              Адреса <SortIcon :active="sortKey === 'address'" :dir="sortDir" />
            </th>
            <th
              class="px-4 py-3 text-left cursor-pointer"
              @click="setSort('username')"
            >
              Логін <SortIcon :active="sortKey === 'username'" :dir="sortDir" />
            </th>
            <th
              class="px-4 py-3 text-left cursor-pointer"
              @click="setSort('editorsCount')"
            >
              Редакторів
              <SortIcon :active="sortKey === 'editorsCount'" :dir="sortDir" />
            </th>
            <th
              class="px-4 py-3 text-left cursor-pointer"
              @click="setSort('createdAt')"
            >
              Створено
              <SortIcon :active="sortKey === 'createdAt'" :dir="sortDir" />
            </th>
            <th
              class="px-4 py-3 text-left cursor-pointer"
              @click="setSort('isBlocked')"
            >
              Статус
              <SortIcon :active="sortKey === 'isBlocked'" :dir="sortDir" />
            </th>
            <th
              class="px-4 py-3 text-center cursor-pointer"
              @click="setSort('isBlocked')"
            >
              Дія
            </th>
            <th class="px-4 py-3"></th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="loading">
            <td colspan="7" class="px-4 py-6 text-center text-gray-500">
              Завантаження…
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
                  {{ h.isBlocked ? "Заблоковано" : "Активний" }}
                </span>
              </td>
              <td class="px-4 py-3 text-left">
                <!-- якщо робитимеш картку готелю, розкоментуй ↓ і маршрут у router -->
                <div class="flex justify-between gap-2 underline">
                  <RouterLink
                    :to="{ name: 'sa-hotel-detail', params: { id: h.id } }"
                    class="btn btn-sm"
                    >info</RouterLink
                  >

                  <button
                    v-if="!h.isBlocked"
                    class="btn btn-sm btn-warning"
                    @click="onBlock(h.username)"
                  >
                    block
                  </button>
                  <button
                    v-else
                    class="btn btn-sm btn-success"
                    @click="onUnblock(h.username)"
                  >
                    unblock
                  </button>
                  <button class="btn btn-sm" @click="openEdit(h.username)">
                    edit
                  </button>
                  <button
                    class="btn btn-sm btn-error"
                    @click="onDelete(h.username)"
                  >
                    Видалити
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="hotels.length === 0">
              <td colspan="7" class="px-4 py-6 text-center text-gray-500">
                Нічого не знайдено
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

const store = useSuperHotelsStore();
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
  if (!confirm(`Block ${username}?`)) return;
  await store.block(username);
}
async function onUnblock(username: string): Promise<void> {
  if (!confirm(`Unblock ${username}?`)) return;
  await store.unblock(username);
}
async function onDelete(username: string): Promise<void> {
  if (!confirm(`Delete ${username}? Дію не можна скасувати.`)) return;
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
    alert(e instanceof Error ? e.message : "Помилка збереження");
  }
}
</script>
