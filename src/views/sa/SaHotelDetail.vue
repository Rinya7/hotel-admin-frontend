<!--src/views/superadmin/HotelDetail.vue
<template>
  <div class="p-6 space-y-6" v-if="hotel">
    <div class="flex items-center gap-4">
      <img
        v-if="hotel.logo_url"
        :src="hotel.logo_url"
        class="h-16 w-16 rounded object-cover"
        alt="logo"
      />
      <div>
        <h1 class="text-2xl font-semibold">{{ hotel.hotel_name ?? "—" }}</h1>
        <div class="text-gray-500">{{ hotel.address ?? "—" }}</div>
      </div>
      <div class="ml-auto">
        <span :class="hotel.isBlocked ? 'text-red-600' : 'text-emerald-700'">
          {{ hotel.isBlocked ? "Заблоковано" : "Активний" }}
        </span>
      </div>
    </div>

    <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="rounded-2xl border bg-white p-4">
        <h2 class="font-medium mb-3">Контакти</h2>
        <ul class="text-sm space-y-1">
          <li><b>Логін:</b> {{ hotel.username }}</li>
          <li><b>Власник:</b> {{ hotel.full_name ?? "—" }}</li>
          <li><b>Email:</b> {{ hotel.email ?? "—" }}</li>
          <li><b>Телефон:</b> {{ hotel.phone ?? "—" }}</li>
        </ul>
      </div>

      <div class="rounded-2xl border bg-white p-4">
        <h2 class="font-medium mb-3">Політика заселення/виїзду</h2>
        <div class="text-sm">
          <div>
            <b>Check-in час:</b> {{ hotel.checkInHour ?? "за замовчуванням" }}
          </div>
          <div>
            <b>Check-out час:</b> {{ hotel.checkOutHour ?? "за замовчуванням" }}
          </div>
        </div>
      </div>

      <div class="rounded-2xl border bg-white p-4">
        <h2 class="font-medium mb-3">Статистика користувачів</h2>
        <div class="text-sm">
          <div><b>Редакторів:</b> {{ hotel.editorsCount }}</div>
          <div>
            <b>Створено:</b> {{ new Date(hotel.createdAt).toLocaleString() }}
          </div>
          <div>
            <b>Оновлено:</b> {{ new Date(hotel.updatedAt).toLocaleString() }}
          </div>
        </div>
      </div>
    </section>

    <section class="rounded-2xl border bg-white p-4">
      <h2 class="font-medium mb-3">Редактори</h2>
      <table class="min-w-full text-sm">
        <thead class="bg-gray-50 text-gray-600">
          <tr>
            <th class="px-3 py-2 text-left">Логін</th>
            <th class="px-3 py-2 text-left">Ім'я</th>
            <th class="px-3 py-2 text-left">Email</th>
            <th class="px-3 py-2 text-left">Телефон</th>
            <th class="px-3 py-2 text-left">Статус</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="e in hotel.editors" :key="e.id" class="border-t">
            <td class="px-3 py-2">{{ e.username }}</td>
            <td class="px-3 py-2">{{ e.full_name ?? "—" }}</td>
            <td class="px-3 py-2">{{ e.email ?? "—" }}</td>
            <td class="px-3 py-2">{{ e.phone ?? "—" }}</td>
            <td class="px-3 py-2">
              <span :class="e.isBlocked ? 'text-red-600' : 'text-emerald-700'">
                {{ e.isBlocked ? "Заблоковано" : "Активний" }}
              </span>
            </td>
          </tr>
          <tr v-if="hotel.editors.length === 0">
            <td colspan="5" class="px-3 py-4 text-center text-gray-500">
              Редакторів ще немає
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>

  <div v-else class="p-6">Запис не знайдено</div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useSuperHotelsStore } from "@/stores/superadmin";
import type { PublicAdminUser } from "@/types/hotel";

const route = useRoute();
const idParam = Number(route.params.id);

const store = useSuperHotelsStore();
const { raw } = storeToRefs(store);

const hotel = ref<PublicAdminUser | undefined>(undefined);

onMounted(async () => {
  if (raw.value.length === 0) {
    // якщо зайшли напряму — підвантажимо загальний список
    await store.fetchAll();
  }
  hotel.value = store.byId(idParam);
});
</script>-->
<template>
  <div class="p-6 space-y-6" v-if="hotel">
    <!-- Заголовок + кнопки действий -->
    <div class="flex items-center gap-4">
      <img
        v-if="hotel.logo_url"
        :src="hotel.logo_url"
        class="h-16 w-16 rounded object-cover"
        alt="logo"
      />
      <div>
        <h1 class="text-2xl font-semibold">{{ hotel.hotel_name ?? "—" }}</h1>
        <div class="text-gray-500">{{ hotel.address ?? "—" }}</div>
      </div>

      <div class="ml-auto flex items-center gap-2">
        <span :class="hotel.isBlocked ? 'text-red-600' : 'text-emerald-700'">
          {{ hotel.isBlocked ? "Заблоковано" : "Активний" }}
        </span>

        <button class="btn btn-sm" @click="openEdit(hotel.username)">
          Редагувати
        </button>

        <button
          v-if="!hotel.isBlocked"
          class="btn btn-sm btn-warning"
          @click="onBlock(hotel.username)"
        >
          Блок
        </button>
        <button
          v-else
          class="btn btn-sm btn-success"
          @click="onUnblock(hotel.username)"
        >
          Розблок
        </button>

        <button class="btn btn-sm btn-error" @click="onDelete(hotel.username)">
          Видалити
        </button>

        <button class="btn btn-sm" @click="goBack">Назад</button>
      </div>
    </div>

    <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="rounded-2xl border bg-white p-4">
        <h2 class="font-medium mb-3">Контакти</h2>
        <ul class="text-sm space-y-1">
          <li><b>Логін:</b> {{ hotel.username }}</li>
          <li><b>Власник:</b> {{ hotel.full_name ?? "—" }}</li>
          <li><b>Email:</b> {{ hotel.email ?? "—" }}</li>
          <li><b>Телефон:</b> {{ hotel.phone ?? "—" }}</li>
        </ul>
      </div>

      <div class="rounded-2xl border bg-white p-4">
        <h2 class="font-medium mb-3">Політика заселення/виїзду</h2>
        <div class="text-sm">
          <div>
            <b>Check-in час:</b> {{ hotel.checkInHour ?? "за замовчуванням" }}
          </div>
          <div>
            <b>Check-out час:</b> {{ hotel.checkOutHour ?? "за замовчуванням" }}
          </div>
        </div>
      </div>

      <div class="rounded-2xl border bg-white p-4">
        <h2 class="font-medium mb-3">Статистика користувачів</h2>
        <div class="text-sm">
          <div><b>Редакторів:</b> {{ hotel.editorsCount }}</div>
          <div>
            <b>Створено:</b> {{ new Date(hotel.createdAt).toLocaleString() }}
          </div>
          <div>
            <b>Оновлено:</b> {{ new Date(hotel.updatedAt).toLocaleString() }}
          </div>
        </div>
      </div>
    </section>

    <section class="rounded-2xl border bg-white p-4">
      <h2 class="font-medium mb-3">Редактори</h2>
      <table class="min-w-full text-sm">
        <thead class="bg-gray-50 text-gray-600">
          <tr>
            <th class="px-3 py-2 text-left">Логін</th>
            <th class="px-3 py-2 text-left">Ім'я</th>
            <th class="px-3 py-2 text-left">Email</th>
            <th class="px-3 py-2 text-left">Телефон</th>
            <th class="px-3 py-2 text-left">Статус</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="e in hotel.editors" :key="e.id" class="border-t">
            <td class="px-3 py-2">{{ e.username }}</td>
            <td class="px-3 py-2">{{ e.full_name ?? "—" }}</td>
            <td class="px-3 py-2">{{ e.email ?? "—" }}</td>
            <td class="px-3 py-2">{{ e.phone ?? "—" }}</td>
            <td class="px-3 py-2">
              <span :class="e.isBlocked ? 'text-red-600' : 'text-emerald-700'">
                {{ e.isBlocked ? "Заблоковано" : "Активний" }}
              </span>
            </td>
          </tr>
          <tr v-if="hotel.editors.length === 0">
            <td colspan="5" class="px-3 py-4 text-center text-gray-500">
              Редакторів ще немає
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>

  <div v-else class="p-6">Запис не знайдено</div>

  <!-- Модалка редагування -->
  <EditHotelDialog
    v-if="editOpen && hotel"
    v-model="editOpen"
    :initial="hotel"
    @save="onSavePatch"
  />
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useSuperHotelsStore } from "@/stores/superadmin";
import type { PublicAdminUser } from "@/types/hotel";
import type { UpdateHotelAdminRequest } from "@/types/dto";
import EditHotelDialog from "@/components/superadmin/EditHotelDialog.vue";

const route = useRoute();
const router = useRouter();
const idParam = Number(route.params.id);

const store = useSuperHotelsStore();
const { raw } = storeToRefs(store);

const hotel = ref<PublicAdminUser | undefined>(undefined);

onMounted(async () => {
  if (raw.value.length === 0) {
    await store.fetchAll(); // якщо зайшли напряму
  }
  hotel.value = store.byId(idParam);
});

// якщо список оновився в сторі (після редагування) — оновимо локалку
watch(
  () => raw.value,
  () => {
    hotel.value = store.byId(idParam);
  }
);

// Кнопки действий
async function onBlock(username: string): Promise<void> {
  if (!confirm(`Заблокувати ${username}?`)) return;
  await store.block(username);
}

async function onUnblock(username: string): Promise<void> {
  if (!confirm(`Розблокувати ${username}?`)) return;
  await store.unblock(username);
}

async function onDelete(username: string): Promise<void> {
  if (!confirm(`Видалити ${username}? Дію не можна скасувати.`)) return;
  await store.removeUser(username);
  router.replace({ name: "sa-hotels" }); // назад до списку
}

function goBack(): void {
  router.back();
}

// Редактирование
const editOpen = ref(false);
function openEdit(username: string): void {
  if (!hotel.value || hotel.value.username !== username) return;
  editOpen.value = true;
}

async function onSavePatch(patch: UpdateHotelAdminRequest): Promise<void> {
  if (!hotel.value) return;
  try {
    await store.updateHotel(hotel.value.username, patch);
    // стор перезапишет raw; watcher подтянет свежие данные в hotel
  } catch (e) {
    alert(e instanceof Error ? e.message : "Помилка збереження");
  }
}
</script>
