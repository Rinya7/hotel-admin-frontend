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

        <button class="btn btn-sm underline" @click="openEdit(hotel.username)">
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

        <button class="btn btn-sm" @click="goBack">
          {{ t("saHotelDetail.actions.back") }}
        </button>
      </div>
    </div>

    <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="rounded-2xl border bg-white p-4">
        <h2 class="font-medium mb-3">
          {{ t("saHotelDetail.sections.contacts") }}
        </h2>
        <ul class="text-sm space-y-1">
          <li>
            <b>{{ t("saHotelDetail.fields.login") }}:</b> {{ hotel.username }}
          </li>
          <li>
            <b>{{ t("saHotelDetail.fields.owner") }}:</b>
            {{ hotel.full_name ?? "—" }}
          </li>
          <li>
            <b>{{ t("saHotelDetail.fields.email") }}:</b>
            {{ hotel.email ?? "—" }}
          </li>
          <li>
            <b>{{ t("saHotelDetail.fields.phone") }}:</b>
            {{ hotel.phone ?? "—" }}
          </li>
        </ul>
      </div>

      <div class="rounded-2xl border bg-white p-4">
        <h2 class="font-medium mb-3">
          {{ t("saHotelDetail.sections.checkinPolicies") }}
        </h2>
        <div class="text-sm">
          <div>
            <b>{{ t("saHotelDetail.fields.checkInTime") }}:</b>
            {{ hotel.checkInHour ?? t("saHotelDetail.fields.default") }}
          </div>
          <div>
            <b>{{ t("saHotelDetail.fields.checkOutTime") }}:</b>
            {{ hotel.checkOutHour ?? t("saHotelDetail.fields.default") }}
          </div>
        </div>
      </div>

      <div class="rounded-2xl border bg-white p-4">
        <h2 class="font-medium mb-3">
          {{ t("saHotelDetail.sections.userStats") }}
        </h2>
        <div class="text-sm">
          <div>
            <b>{{ t("saHotelDetail.fields.editors") }}:</b>
            {{ hotel.editorsCount }}
          </div>
          <div>
            <b>{{ t("saHotelDetail.fields.created") }}:</b>
            {{ new Date(hotel.createdAt).toLocaleString() }}
          </div>
          <div>
            <b>{{ t("saHotelDetail.fields.updated") }}:</b>
            {{ new Date(hotel.updatedAt).toLocaleString() }}
          </div>
        </div>
      </div>
    </section>

    <section class="rounded-2xl border bg-white p-4">
      <h2 class="font-medium mb-3">
        {{ t("saHotelDetail.sections.editors") }}
      </h2>
      <table class="min-w-full text-sm">
        <thead class="bg-gray-50 text-gray-600">
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
              <span :class="e.isBlocked ? 'text-red-600' : 'text-emerald-700'">
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

  <div v-else class="p-6">{{ t("saHotelDetail.notFound") }}</div>

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
import { useLocale } from "@/composables/useLocale";

const route = useRoute();
const router = useRouter();
const idParam = Number(route.params.id);

const store = useSuperHotelsStore();
const { t } = useLocale();
const { raw } = storeToRefs(store);

const hotel = ref<PublicAdminUser | undefined>(undefined);

onMounted(async () => {
  if (raw.value.length === 0) {
    await store.fetchAll(); // якщо зайшли напряму
  }
  hotel.value = store.byId(idParam);
});

// якщо список оновився в stor (після редагування) — оновимо local
watch(
  () => raw.value,
  () => {
    hotel.value = store.byId(idParam);
  }
);

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
  if (!hotel.value) return;
  try {
    await store.updateHotel(hotel.value.username, patch);
    // stor rewrite raw; watcher download fresh date в hotel
  } catch (e) {
    alert(
      e instanceof Error ? e.message : t("saHotelDetail.messages.saveError")
    );
  }
}
</script>
