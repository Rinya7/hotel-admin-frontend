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
              <td class="px-4 py-3 text-right">
                <!-- якщо робитимеш картку готелю, розкоментуй ↓ і маршрут у router -->
                <!-- <RouterLink :to="{ name: 'sa-hotel-detail', params: { id: h.id } }" class="btn btn-sm">Картка</RouterLink> -->

                <div class="inline-flex gap-2">
                  <button
                    v-if="!h.isBlocked"
                    class="btn btn-sm btn-warning"
                    @click="onBlock(h.username)"
                  >
                    Блок
                  </button>
                  <button
                    v-else
                    class="btn btn-sm btn-success"
                    @click="onUnblock(h.username)"
                  >
                    Розблок
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
</template>

<script lang="ts" setup>
import { computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useSuperHotelsStore } from "@/stores/superadmin.ts";
import SortIcon from "@/components/common/SortIcon.vue";

const store = useSuperHotelsStore();
const { loading, error, sorted, sortKey, sortDir } = storeToRefs(store);

onMounted(() => {
  void store.fetchAll(); // інтерсептор http сам поставить токен/лоадер
});

const query = computed({
  get: () => store.query,
  set: (v: string) => store.setQuery(v),
});

const hotels = computed(() => sorted.value);
function setSort(key: Parameters<typeof store.setSort>[0]) {
  store.setSort(key);
}

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
</script>
