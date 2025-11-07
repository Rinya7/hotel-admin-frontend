<!-- RoomsList.vue — список комнат, кнопка Add (только для admin), edit/status/delete -->
<template>
  <div class="space-y-6">
    <section
      class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:py-[24px]"
    >
      <h1 class="text-2xl font-semibold text-brand dark:text-white">
        {{ t("roomsList.title") }}
      </h1>
      <div class="flex flex-col sm:flex-row gap-3">
        <input
          v-model="filter"
          type="text"
          :placeholder="t('roomsList.filterPlaceholder')"
          class="w-full sm:w-64 text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-2xl text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand"
        />
        <button
          v-if="auth.isAdmin"
          @click="openCreateModal"
          class="inline-flex items-center px-4 py-2 bg-brand hover:bg-brand-light text-white rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md font-medium"
        >
          <svg
            class="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            ></path>
          </svg>
          {{ t("roomsList.addRoom") }}
        </button>
      </div>
    </section>

    <section
      class="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
    >
      <table class="w-full text-sm">
        <thead
          class="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
        >
          <tr>
            <th class="px-4 py-3 text-left font-medium">
              {{ t("roomsList.table.room") }}
            </th>
            <th class="px-4 py-3 text-center font-medium">
              {{ t("roomsList.table.floor") }}
            </th>
            <th class="px-4 py-3 text-center font-medium">
              {{ t("roomsList.table.capacity") }}
            </th>
            <th class="px-4 py-3 text-center font-medium">
              {{ t("roomsList.table.checkIn") }}
            </th>
            <th class="px-4 py-3 text-center font-medium">
              {{ t("roomsList.table.checkOut") }}
            </th>
            <th class="px-4 py-3 text-center font-medium">
              {{ t("roomsList.table.actions") }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <!-- Пустое состояние внутри таблицы -->
          <tr v-if="filtered.length === 0">
            <td :colspan="6" class="px-4 py-16 text-center">
              <div class="flex flex-col items-center justify-center">
                <div class="text-gray-400 dark:text-gray-500 mb-4">
                  <svg
                    class="w-16 h-16 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    ></path>
                  </svg>
                </div>
                <h3
                  class="text-lg font-semibold text-gray-900 dark:text-white mb-2"
                >
                  {{ t("roomsList.empty.title") }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 max-w-md">
                  {{
                    filter
                      ? t("roomsList.empty.withFilter")
                      : t("roomsList.empty.noRooms")
                  }}
                </p>
                <button
                  v-if="auth.isAdmin && !filter"
                  @click="openCreateModal"
                  class="mt-4 inline-flex items-center px-4 py-2 bg-brand hover:bg-brand-light text-white rounded-lg transition-colors text-sm font-medium"
                >
                  <svg
                    class="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 4v16m8-8H4"
                    ></path>
                  </svg>
                  {{ t("roomsList.addRoom") }}
                </button>
              </div>
            </td>
          </tr>

          <!-- Данные комнат -->
          <tr
            v-for="r in filtered"
            :key="r.id"
            class="hover:bg-gray-50 dark:hover:bg-gray-700/50"
          >
            <td
              class="px-2 py-4 text-gray-900 dark:text-white font-semibold text-center"
            >
              {{ r.roomNumber }}
            </td>
            <td class="px-2 py-4 text-gray-700 dark:text-gray-300 text-center">
              {{ r.floor }}
            </td>
            <td class="px-2 py-4 text-gray-700 dark:text-gray-300 text-center">
              {{ r.capacity }}
            </td>
            <td class="px-2 py-4 text-center">
              <span
                :class="[
                  r.checkInHour !== null && r.checkInHour !== undefined
                    ? 'text-brand dark:text-emerald-400 font-semibold'
                    : 'text-gray-600 dark:text-gray-300',
                ]"
              >
                {{ getCheckInTime(r) }}
              </span>
            </td>
            <td class="px-2 py-4 text-center">
              <span
                :class="[
                  r.checkOutHour !== null && r.checkOutHour !== undefined
                    ? 'text-brand dark:text-emerald-400 font-semibold'
                    : 'text-gray-600 dark:text-gray-300',
                ]"
              >
                {{ getCheckOutTime(r) }}
              </span>
            </td>
            <td class="px-2 py-4">
              <div class="flex items-center flex-wrap md:justify-evenly gap-2">
                <RouterLink
                  :to="{
                    name: 'room-stays',
                    params: { roomNumber: r.roomNumber },
                  }"
                  class="inline-flex items-center justify-center px-3 py-1.5 text-xs font-semibold text-brand bg-brand/15 hover:bg-brand/25 dark:text-emerald-300 dark:bg-emerald-500/20 dark:hover:bg-emerald-500/30 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md border border-brand/20 dark:border-emerald-500/30 whitespace-nowrap"
                >
                  {{ t("roomsList.actions.stays") }}
                </RouterLink>
                <button
                  v-if="auth.isAdmin"
                  @click="openEdit(r)"
                  class="inline-flex items-center justify-center px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-100 hover:bg-blue-200 dark:text-blue-300 dark:bg-blue-500/20 dark:hover:bg-blue-500/30 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md border border-blue-200 dark:border-blue-500/30 whitespace-nowrap"
                >
                  {{ t("roomsList.actions.edit") }}
                </button>
                <button
                  v-if="auth.isAdmin"
                  @click="remove(r)"
                  class="inline-flex items-center justify-center px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-100 hover:bg-red-200 dark:text-red-300 dark:bg-red-500/20 dark:hover:bg-red-500/30 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md border border-red-200 dark:border-red-500/30 whitespace-nowrap"
                >
                  {{ t("roomsList.actions.delete") }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Модальное окно создания номера -->
    <div
      v-if="showCreate"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="closeCreateModal"
    >
      <div
        class="bg-white border border-brand dark:border-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl"
        @click.stop
      >
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold text-brand dark:text-white">
            {{ t("roomsList.createModal.title") }}
          </h3>
          <button
            @click="closeCreateModal"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
        <CreateRoomForm @success="onRoomCreated" @cancel="closeCreateModal" />
      </div>
    </div>

    <!-- Модальное окно редактирования номера -->
    <div
      v-if="editForm"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="closeEditModal"
    >
      <div
        class="bg-white border border-brand dark:border-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl"
        @click.stop
      >
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold text-brand dark:text-white">
            {{ t("roomsList.editModal.title") }} {{ editRoom?.roomNumber }}
          </h3>
          <button
            type="button"
            @click="closeEditModal"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
        <form @submit.prevent="saveEdit" class="space-y-6">
          <!-- Room Basic Info -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                <div class="flex items-center">
                  <svg
                    class="w-4 h-4 text-brand dark:text-emerald-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    ></path>
                  </svg>
                  {{ t("roomsList.editModal.fields.floor") }}
                </div>
              </label>
              <input
                v-model.number="editForm.floor"
                :placeholder="t('roomsList.editModal.placeholders.floor')"
                type="number"
                min="0"
                required
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand"
              />
            </div>

            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                <div class="flex items-center">
                  <svg
                    class="w-4 h-4 text-brand dark:text-emerald-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    ></path>
                  </svg>
                  {{ t("roomsList.editModal.fields.capacity") }}
                </div>
              </label>
              <input
                v-model.number="editForm.capacity"
                :placeholder="t('roomsList.editModal.placeholders.capacity')"
                type="number"
                min="1"
                required
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand"
              />
            </div>

            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                <div class="flex items-center">
                  <svg
                    class="w-4 h-4 text-brand dark:text-emerald-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  {{ t("roomsList.editModal.fields.status") }}
                </div>
              </label>
              <select
                v-model="editForm.status"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand"
              >
                <option value="free">{{ t("dashboard.stats.free") }}</option>
                <option value="booked">
                  {{ t("dashboard.stats.booked") }}
                </option>
                <option value="occupied">
                  {{ t("dashboard.stats.occupied") }}
                </option>
                <option value="cleaning">Cleaning</option>
              </select>
            </div>
          </div>

          <!-- Check-in/Check-out Times -->
          <div
            class="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700"
          >
            <div class="flex flex-col gap-2 mb-3">
              <h4
                class="text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                {{ t("roomsList.editModal.sections.policyHours") }}
              </h4>
              <div
                v-if="editForm.status === 'free'"
                class="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3"
              >
                <p class="text-xs text-gray-700 dark:text-gray-300">
                  {{ t("roomsList.editModal.policyHours.noteWhenFree") }}
                  ({{ t("roomsList.editModal.policyHours.checkIn") }}
                  {{
                    auth.defaultCheckInHour !== null
                      ? `${auth.defaultCheckInHour}:00`
                      : t("roomsList.editModal.policyHours.notSet")
                  }}, {{ t("roomsList.editModal.policyHours.checkOut") }}
                  {{
                    auth.defaultCheckOutHour !== null
                      ? `${auth.defaultCheckOutHour}:00`
                      : t("roomsList.editModal.policyHours.notSet")
                  }}).
                </p>
              </div>
              <div
                v-else
                class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3"
              >
                <p class="text-xs text-blue-800 dark:text-blue-200">
                  <span class="font-medium">{{
                    t("roomsList.editModal.policyHours.hotelDefaults")
                  }}</span>
                  {{ t("roomsList.editModal.policyHours.checkIn") }}
                  {{
                    auth.defaultCheckInHour !== null
                      ? `${auth.defaultCheckInHour}:00`
                      : t("roomsList.editModal.policyHours.notSet")
                  }}
                  | {{ t("roomsList.editModal.policyHours.checkOut") }}
                  {{
                    auth.defaultCheckOutHour !== null
                      ? `${auth.defaultCheckOutHour}:00`
                      : t("roomsList.editModal.policyHours.notSet")
                  }}
                </p>
                <p class="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  {{ t("roomsList.editModal.policyHours.noteWhenOccupied") }}
                </p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  <div class="flex items-center">
                    <svg
                      class="w-4 h-4 text-brand dark:text-emerald-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    {{ t("roomsList.editModal.fields.checkInHour") }}
                  </div>
                </label>
                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    @click="decreaseCheckInHour"
                    :disabled="editForm.status === 'free'"
                    class="flex items-center justify-center w-10 h-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M20 12H4"
                      ></path>
                    </svg>
                  </button>
                  <input
                    v-model.number="editForm.checkInHour"
                    type="number"
                    min="0"
                    max="23"
                    placeholder="14"
                    :disabled="editForm.status === 'free'"
                    class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand text-center disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <button
                    type="button"
                    @click="increaseCheckInHour"
                    :disabled="editForm.status === 'free'"
                    class="flex items-center justify-center w-10 h-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 4v16m8-8H4"
                      ></path>
                    </svg>
                  </button>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {{ t("roomsList.editModal.policyHours.format24") }}
                </p>
              </div>

              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  <div class="flex items-center">
                    <svg
                      class="w-4 h-4 text-brand dark:text-emerald-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    {{ t("roomsList.editModal.fields.checkOutHour") }}
                  </div>
                </label>
                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    @click="decreaseCheckOutHour"
                    :disabled="editForm.status === 'free'"
                    class="flex items-center justify-center w-10 h-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M20 12H4"
                      ></path>
                    </svg>
                  </button>
                  <input
                    v-model.number="editForm.checkOutHour"
                    type="number"
                    min="0"
                    max="23"
                    placeholder="10"
                    :disabled="editForm.status === 'free'"
                    class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand text-center disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <button
                    type="button"
                    @click="increaseCheckOutHour"
                    :disabled="editForm.status === 'free'"
                    class="flex items-center justify-center w-10 h-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 4v16m8-8H4"
                      ></path>
                    </svg>
                  </button>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {{ t("roomsList.editModal.policyHours.format24") }}
                </p>
              </div>
            </div>
          </div>

          <!-- Additional Settings -->
          <div
            class="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700"
          >
            <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {{ t("roomsList.editModal.sections.additionalSettings") }}
            </h4>

            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                <div class="flex items-center">
                  <svg
                    class="w-4 h-4 text-brand dark:text-emerald-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                    ></path>
                  </svg>
                  {{ t("roomsList.editModal.fields.qrBarUrl") }}
                </div>
              </label>
              <input
                v-model="editForm.qrBarUrl"
                :placeholder="t('roomsList.editModal.placeholders.qrBarUrl')"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand"
              />
            </div>

            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                <div class="flex items-center">
                  <svg
                    class="w-4 h-4 text-brand dark:text-emerald-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    ></path>
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                  </svg>
                  {{ t("roomsList.editModal.fields.mapPosition") }}
                </div>
              </label>
              <input
                v-model="editForm.mapPosition"
                :placeholder="t('roomsList.editModal.placeholders.mapPosition')"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand"
              />
            </div>
          </div>
          <div
            class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700"
          >
            <button
              type="button"
              @click="closeEditModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              {{ t("roomsList.editModal.cancel") }}
            </button>
            <button
              type="submit"
              class="px-6 py-3 text-sm font-medium text-white bg-brand hover:bg-brand-light rounded-lg transition-colors shadow-sm hover:shadow-md"
            >
              <span class="flex items-center">
                <svg
                  class="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                {{ t("roomsList.editModal.save") }}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "@/stores/auth";
import { useNotifications } from "@/composables/useNotifications";
import type { Room, UpdateRoomRequest } from "@/types/rooms";
import { getRooms, updateRoomStatus, updateRoomByNumber } from "@/api/rooms";
import CreateRoomForm from "@/components/common/CreateRoomForm.vue";

const { t } = useI18n();
const auth = useAuthStore();
const { showError, showWarning } = useNotifications();
const rooms = ref<Room[]>([]);
const filter = ref("");
const showCreate = ref(false);

const editForm = ref<UpdateRoomRequest | null>(null);
const editRoom = ref<Room | null>(null);

const filtered = computed(() =>
  rooms.value.filter((r) =>
    r.roomNumber.toLowerCase().includes(filter.value.trim().toLowerCase())
  )
);

// Функции для управления модалками
function openCreateModal() {
  showCreate.value = true;
  document.body.style.overflow = "hidden";
}

function closeCreateModal() {
  showCreate.value = false;
  document.body.style.overflow = "";
}

function closeEditModal() {
  editForm.value = null;
  editRoom.value = null;
  document.body.style.overflow = "";
}

// Обработчик нажатия Esc
function handleEscKey(event: KeyboardEvent) {
  if (event.key === "Escape") {
    if (showCreate.value) {
      closeCreateModal();
    }
    if (editForm.value) {
      closeEditModal();
    }
  }
}

async function load() {
  rooms.value = await getRooms();

  // Если дефолтные часы не загружены в authStore - берем из первой комнаты
  if (auth.defaultCheckInHour === null && rooms.value.length > 0) {
    const firstRoom = rooms.value[0];
    if (firstRoom.checkInHour !== null && firstRoom.checkInHour !== undefined) {
      auth.defaultCheckInHour = firstRoom.checkInHour;
      localStorage.setItem("defaultCheckInHour", String(firstRoom.checkInHour));
    }
  }
  if (auth.defaultCheckOutHour === null && rooms.value.length > 0) {
    const firstRoom = rooms.value[0];
    if (
      firstRoom.checkOutHour !== null &&
      firstRoom.checkOutHour !== undefined
    ) {
      auth.defaultCheckOutHour = firstRoom.checkOutHour;
      localStorage.setItem(
        "defaultCheckOutHour",
        String(firstRoom.checkOutHour)
      );
    }
  }
}

// Функции для отображения времени: комнатное (если есть) или дефолтное отеля
function getCheckInTime(room: Room): string {
  // Если у комнаты установлено свое время - показываем его (выделено)
  if (room.checkInHour !== null && room.checkInHour !== undefined) {
    return `${room.checkInHour}:00`;
  }
  // Иначе показываем дефолтное время отеля
  if (auth.defaultCheckInHour !== null) {
    return `${auth.defaultCheckInHour}:00`;
  }
  return "—";
}

function getCheckOutTime(room: Room): string {
  // Если у комнаты установлено свое время - показываем его (выделено)
  if (room.checkOutHour !== null && room.checkOutHour !== undefined) {
    return `${room.checkOutHour}:00`;
  }
  // Иначе показываем дефолтное время отеля
  if (auth.defaultCheckOutHour !== null) {
    return `${auth.defaultCheckOutHour}:00`;
  }
  return "—";
}

function openEdit(r: Room) {
  editRoom.value = r;
  editForm.value = {
    floor: r.floor,
    capacity: r.capacity,
    status: r.status,
    checkInHour: r.checkInHour ?? null,
    checkOutHour: r.checkOutHour ?? null,
    qrBarUrl: r.qrBarUrl ?? undefined,
    mapPosition: r.mapPosition ?? undefined,
  } as UpdateRoomRequest;
  document.body.style.overflow = "hidden";
}

// Функции для управления временем check-in
function increaseCheckInHour() {
  if (!editForm.value) return;
  const current = editForm.value.checkInHour || 0;
  editForm.value.checkInHour = Math.min(23, current + 1);
}

function decreaseCheckInHour() {
  if (!editForm.value) return;
  const current = editForm.value.checkInHour || 0;
  editForm.value.checkInHour = Math.max(0, current - 1);
}

// Функции для управления временем check-out
function increaseCheckOutHour() {
  if (!editForm.value) return;
  const current = editForm.value.checkOutHour || 0;
  editForm.value.checkOutHour = Math.min(23, current + 1);
}

function decreaseCheckOutHour() {
  if (!editForm.value) return;
  const current = editForm.value.checkOutHour || 0;
  editForm.value.checkOutHour = Math.max(0, current - 1);
}

async function saveEdit() {
  if (!editRoom.value || !editForm.value) return;

  try {
    const oldStatus = editRoom.value.status;
    const newStatus = editForm.value.status ?? oldStatus;

    // Если статус меняется на "free" - устанавливаем базовое время отеля
    let timePayload: {
      checkInHour?: number | null;
      checkOutHour?: number | null;
    } = {};

    if (newStatus === "free") {
      // При статусе free - всегда используем базовое время отеля
      timePayload = {
        checkInHour: auth.defaultCheckInHour,
        checkOutHour: auth.defaultCheckOutHour,
      };
    } else {
      // При других статусах - сохраняем указанное время
      timePayload = {
        checkInHour: editForm.value.checkInHour,
        checkOutHour: editForm.value.checkOutHour,
      };
    }

    // Подготавливаем полный payload
    const payload: UpdateRoomRequest = {
      floor: editForm.value.floor,
      capacity: editForm.value.capacity,
      ...timePayload,
      qrBarUrl: editForm.value.qrBarUrl,
      mapPosition: editForm.value.mapPosition,
    };

    // Сначала обновляем данные комнаты
    const updated = await updateRoomByNumber(
      editRoom.value.roomNumber,
      payload
    );

    // Затем, если нужно, обновляем статус
    if (newStatus !== oldStatus) {
      await updateRoomStatus(editRoom.value.roomNumber, { status: newStatus });
      updated.status = newStatus;
    }

    closeEditModal();

    // Перезагружаем данные для гарантированного обновления
    await load();
  } catch (e: any) {
    console.error("Error updating room:", e);
    showError(
      t("roomsList.editModal.errorMessage"),
      e.response?.data?.message || e.message
    );
  }
}

async function remove(_r: Room) {
  // Здесь можно сделать confirm и реальный DELETE /rooms/number/:roomNumber,
  // но эндпоинт уже реализован на сервере — просто вызовите через axios по аналогии.
  showWarning(
    "Delete Room",
    "DELETE functionality is not implemented in this example. Add it if necessary."
  );
}

function onRoomCreated() {
  closeCreateModal();
  // Перезагружаем список комнат после создания
  load();
}

onMounted(() => {
  document.addEventListener("keydown", handleEscKey);
  load();
});

// Убираем обработчик при размонтировании
onUnmounted(() => {
  document.removeEventListener("keydown", handleEscKey);
  // Восстанавливаем скролл на всякий случай
  document.body.style.overflow = "";
});
</script>
