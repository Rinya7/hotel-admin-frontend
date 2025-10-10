<!-- Dashboard.vue — сводка /rooms/stats и /rooms/stays/current -->
<template>
  <section class="space-y-6">
    <h2 class="text-2xl font-semibold text-brand dark:text-white">Dashboard</h2>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <button
        @click="toggleStatusFilter('free')"
        :class="[
          'border p-4 rounded-lg transition-all duration-200 hover:scale-105 cursor-pointer',
          statusFilters.includes('free')
            ? 'bg-green-500/90 dark:bg-green-700/90'
            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-brand/50',
        ]"
      >
        <strong
          :class="[
            'text-sm block mb-1',
            statusFilters.includes('free')
              ? 'text-white dark:text-brand-300'
              : 'text-gray-600 dark:text-gray-400',
          ]"
        >
          Free
        </strong>
        <div
          :class="[
            'text-3xl font-bold',
            statusFilters.includes('free')
              ? 'text-white dark:text-brand-300'
              : 'text-gray-900 dark:text-white',
          ]"
        >
          {{ stats?.free ?? "—" }}
        </div>
      </button>

      <button
        @click="toggleStatusFilter('booked')"
        :class="[
          'border p-4 rounded-lg transition-all duration-200 hover:scale-105 cursor-pointer',
          statusFilters.includes('booked')
            ? 'bg-yellow-500/90 dark:bg-yellow-500/90'
            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-brand/50',
        ]"
      >
        <strong
          :class="[
            'text-sm block mb-1',
            statusFilters.includes('booked')
              ? 'text-white dark:text-brand-300'
              : 'text-gray-600 dark:text-gray-400',
          ]"
        >
          Booked
        </strong>
        <div
          :class="[
            'text-3xl font-bold',
            statusFilters.includes('booked')
              ? 'text-white dark:text-brand-300'
              : 'text-gray-900 dark:text-white',
          ]"
        >
          {{ stats?.booked ?? "—" }}
        </div>
      </button>

      <button
        @click="toggleStatusFilter('occupied')"
        :class="[
          'border p-4 rounded-lg transition-all duration-200 hover:scale-105 cursor-pointer',
          statusFilters.includes('occupied')
            ? 'bg-red-500/90 dark:red-500/90'
            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-brand/50',
        ]"
      >
        <strong
          :class="[
            'text-sm block mb-1',
            statusFilters.includes('occupied')
              ? 'text-white dark:text-brand-300'
              : 'text-gray-600 dark:text-gray-400',
          ]"
        >
          Occupied
        </strong>
        <div
          :class="[
            'text-3xl font-bold',
            statusFilters.includes('occupied')
              ? 'text-white dark:text-brand-300'
              : 'text-gray-900 dark:text-white',
          ]"
        >
          {{ stats?.occupied ?? "—" }}
        </div>
      </button>
    </div>

    <!-- Today's Summary -->
    <div
      v-if="todayArrivals.length > 0 || todayDepartures.length > 0"
      class="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-6"
    >
      <button
        @click="toggleStayTypeFilter('arrivals')"
        :class="[
          'border p-4 rounded-lg transition-all duration-200 hover:scale-105 cursor-pointer',
          stayTypeFilters.includes('arrivals')
            ? 'border-white bg-blue-500/90 dark:bg-blue-700/90'
            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-brand/50',
        ]"
      >
        <div class="flex items-center justify-between">
          <div>
            <strong
              :class="[
                'text-sm block mb-1',
                stayTypeFilters.includes('arrivals')
                  ? 'text-white dark:text-blue-300'
                  : 'text-blue-800 dark:text-blue-200',
              ]"
            >
              Today's Arrivals
            </strong>
            <div
              :class="[
                'text-3xl font-bold',
                stayTypeFilters.includes('arrivals')
                  ? 'text-white dark:text-blue-300'
                  : 'text-blue-900 dark:text-blue-100',
              ]"
            >
              {{ todayArrivals.length }}
            </div>
            <p
              :class="[
                'text-xs',
                stayTypeFilters.includes('arrivals')
                  ? 'text-white/80 dark:text-blue-300/80'
                  : 'text-blue-600 dark:text-blue-300',
              ]"
            >
              Guests checking in
            </p>
            <!-- Список номеров -->
            <div
              v-if="todayArrivals.length > 0"
              class="mt-2 flex flex-wrap gap-1"
            >
              <span
                v-for="stay in todayArrivals.slice(0, 3)"
                :key="stay.stayId"
                :class="[
                  'px-2 py-1 text-xs rounded-full',
                  stayTypeFilters.includes('arrivals')
                    ? 'bg-white/20 text-white'
                    : 'bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200',
                ]"
              >
                {{ stay.room.number }}
              </span>
              <span
                v-if="todayArrivals.length > 3"
                :class="[
                  'px-2 py-1 text-xs rounded-full',
                  stayTypeFilters.includes('arrivals')
                    ? 'bg-white/20 text-white'
                    : 'bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200',
                ]"
              >
                +{{ todayArrivals.length - 3 }}
              </span>
            </div>
          </div>
          <div
            :class="[
              'w-12 h-12 rounded-full flex items-center justify-center',
              stayTypeFilters.includes('arrivals')
                ? 'bg-white/20'
                : 'bg-blue-500',
            ]"
          >
            <svg
              class="w-6 h-6 text-white"
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
          </div>
        </div>
      </button>

      <button
        @click="toggleStayTypeFilter('departures')"
        :class="[
          'border p-4 rounded-lg transition-all duration-200 hover:scale-105 cursor-pointer',
          stayTypeFilters.includes('departures')
            ? 'border-white bg-red-500/90 dark:red-500/90'
            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-brand/50',
        ]"
      >
        <div class="flex items-center justify-between">
          <div>
            <strong
              :class="[
                'text-sm block mb-1',
                stayTypeFilters.includes('departures')
                  ? 'text-white dark:text-green-300'
                  : 'text-green-800 dark:text-green-200',
              ]"
            >
              Today's Departures
            </strong>
            <div
              :class="[
                'text-3xl font-bold',
                stayTypeFilters.includes('departures')
                  ? 'text-white dark:text-green-300'
                  : 'text-green-900 dark:text-green-100',
              ]"
            >
              {{ todayDepartures.length }}
            </div>
            <p
              :class="[
                'text-xs',
                stayTypeFilters.includes('departures')
                  ? 'text-white/80 dark:text-green-300/80'
                  : 'text-green-600 dark:text-green-300',
              ]"
            >
              Rooms becoming available
            </p>
            <!-- Список номеров -->
            <div
              v-if="todayDepartures.length > 0"
              class="mt-2 flex flex-wrap gap-1"
            >
              <span
                v-for="stay in todayDepartures.slice(0, 3)"
                :key="stay.stayId"
                :class="[
                  'px-2 py-1 text-xs rounded-full',
                  stayTypeFilters.includes('departures')
                    ? 'bg-white/20 text-white'
                    : 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200',
                ]"
              >
                {{ stay.room.number }}
              </span>
              <span
                v-if="todayDepartures.length > 3"
                :class="[
                  'px-2 py-1 text-xs rounded-full',
                  stayTypeFilters.includes('departures')
                    ? 'bg-white/20 text-white'
                    : 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200',
                ]"
              >
                +{{ todayDepartures.length - 3 }}
              </span>
            </div>
          </div>
          <div
            :class="[
              'w-12 h-12 rounded-full flex items-center justify-center',
              stayTypeFilters.includes('departures')
                ? 'bg-white/20'
                : 'bg-green-500',
            ]"
          >
            <svg
              class="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              ></path>
            </svg>
          </div>
        </div>
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Current stays -->
      <section
        class="lg:col-span-2 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4"
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-brand dark:text-white">
            {{ getTableTitle() }}
          </h3>
          <button
            @click="load"
            :disabled="loading"
            class="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? "Loading..." : "Refresh" }}
          </button>
        </div>

        <!-- Индикатор активных фильтров -->
        <div
          v-if="statusFilters.length > 0 || stayTypeFilters.length > 0"
          class="flex items-center gap-2 mb-4"
        >
          <span class="text-sm text-gray-600 dark:text-gray-400"
            >Active filters:</span
          >
          <div class="flex flex-wrap gap-2">
            <span
              v-for="status in statusFilters"
              :key="status"
              class="px-2 py-1 text-xs bg-brand/20 text-brand dark:text-brand-300 rounded-md"
            >
              {{ getStatusLabel(status) }}
            </span>
            <span
              v-for="type in stayTypeFilters"
              :key="type"
              class="px-2 py-1 text-xs rounded-md"
              :class="{
                'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200':
                  type === 'arrivals',
                'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200':
                  type === 'departures',
              }"
            >
              {{ getStayTypeLabel(type) }}
            </span>
            <button
              @click="clearFilters"
              class="px-2 py-1 text-xs bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-700 dark:text-red-300 rounded-md transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>
        <div
          class="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
        >
          <table class="min-w-full text-sm">
            <thead
              class="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
            >
              <tr>
                <th class="px-4 py-3 text-left">Room #</th>
                <th class="px-4 py-3 text-left">Floor</th>
                <th class="px-4 py-3 text-left">Capacity</th>
                <th class="px-4 py-3 text-left">Status</th>
                <th class="px-4 py-3 text-left">Arrival Date</th>
                <th class="px-4 py-3 text-left">Departure Date</th>
                <th class="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <!-- Состояние загрузки -->
              <tr v-if="loading">
                <td
                  colspan="7"
                  class="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
                >
                  Loading rooms...
                </td>
              </tr>

              <!-- Ошибка загрузки -->
              <tr v-else-if="error">
                <td
                  colspan="7"
                  class="px-4 py-6 text-center text-red-600 dark:text-red-400"
                >
                  {{ error }}
                </td>
              </tr>

              <!-- Нет данных -->
              <tr v-else-if="filteredRooms.length === 0">
                <td
                  colspan="7"
                  class="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
                >
                  {{
                    statusFilters.length > 0 || stayTypeFilters.length > 0
                      ? "No rooms match the selected filters"
                      : "No rooms found"
                  }}
                </td>
              </tr>

              <!-- Данные -->
              <tr
                v-else
                v-for="room in filteredRooms"
                :key="room.id"
                class="border-t border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td class="px-4 py-3 text-gray-900 dark:text-white font-medium">
                  {{ room.roomNumber }}
                </td>
                <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
                  {{ room.floor }}
                </td>
                <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
                  {{ room.capacity }}
                </td>
                <td class="px-4 py-3">
                  <span
                    class="px-2 py-1 text-xs rounded-full block text-center"
                    :class="{
                      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200':
                        room.status === 'free',
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200':
                        room.status === 'booked',
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200':
                        room.status === 'occupied',
                    }"
                  >
                    {{ room.status }}
                  </span>
                </td>
                <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
                  {{ getRoomArrivalDate(room) }}
                </td>
                <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
                  {{ getRoomDepartureDate(room) }}
                </td>
                <td class="px-4 py-3">
                  <RouterLink
                    :to="{
                      name: 'room-stays',
                      params: { roomNumber: room.roomNumber },
                    }"
                    class="inline-flex items-center px-3 py-1 text-xs font-medium text-brand bg-brand/10 hover:bg-brand/20 dark:text-emerald-400 dark:bg-emerald-400/10 dark:hover:bg-emerald-400/20 rounded-md transition-colors"
                  >
                    View Room
                    <svg
                      class="w-3 h-3 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 5l7 7-7 7"
                      ></path>
                    </svg>
                  </RouterLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Room Management -->
      <section
        class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6"
      >
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-brand dark:text-white">
            Room Management
          </h2>
          <button
            v-if="auth.isAdmin"
            @click="showPolicyHours = true"
            class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-brand bg-brand/10 hover:bg-brand/20 dark:text-emerald-400 dark:bg-emerald-400/10 dark:hover:bg-emerald-400/20 rounded-lg transition-colors"
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
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            Policy Hours
          </button>
        </div>

        <!-- Policy Hours Display -->
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <div class="flex items-center mb-2">
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
                <span
                  class="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Check-in Time
                </span>
              </div>
              <p class="text-sm text-gray-900 dark:text-white font-mono">
                {{
                  policyHoursForm.checkInHour !== null
                    ? `${policyHoursForm.checkInHour}:00`
                    : "Not set"
                }}
              </p>
            </div>

            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <div class="flex items-center mb-2">
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
                <span
                  class="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Check-out Time
                </span>
              </div>
              <p class="text-sm text-gray-900 dark:text-white font-mono">
                {{
                  policyHoursForm.checkOutHour !== null
                    ? `${policyHoursForm.checkOutHour}:00`
                    : "Not set"
                }}
              </p>
            </div>
          </div>
        </div>

        <div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <div class="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <p>• View all rooms and their status</p>
              <p>• Filter by status using cards above</p>
              <p>• Manage rooms in the Rooms section</p>
            </div>
            <RouterLink
              to="/rooms"
              class="inline-flex items-center px-4 py-2 bg-brand hover:bg-brand-light text-white rounded-lg transition-colors"
            >
              Go to Rooms
              <svg
                class="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </RouterLink>
          </div>
        </div>
      </section>

      <!-- Модальное окно Policy Hours -->
      <dialog
        v-if="showPolicyHours"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        @click.self="showPolicyHours = false"
      >
        <div
          class="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto shadow-xl"
        >
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-semibold text-brand dark:text-white">
              Policy Hours
            </h3>
            <button
              @click="showPolicyHours = false"
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

          <form @submit.prevent="savePolicyHours" class="space-y-6">
            <div class="space-y-4">
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Check-in Hour
                </label>
                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    @click="decreaseCheckInHour"
                    class="flex items-center justify-center w-10 h-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
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
                    v-model="policyHoursForm.checkInHour"
                    type="number"
                    min="0"
                    max="23"
                    placeholder="14"
                    class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand text-center"
                  />
                  <button
                    type="button"
                    @click="increaseCheckInHour"
                    class="flex items-center justify-center w-10 h-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
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
                  Enter hour in 24-hour format (0-23)
                </p>
              </div>

              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Check-out Hour
                </label>
                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    @click="decreaseCheckOutHour"
                    class="flex items-center justify-center w-10 h-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
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
                    v-model="policyHoursForm.checkOutHour"
                    type="number"
                    min="0"
                    max="23"
                    placeholder="10"
                    class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand text-center"
                  />
                  <button
                    type="button"
                    @click="increaseCheckOutHour"
                    class="flex items-center justify-center w-10 h-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
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
                  Enter hour in 24-hour format (0-23)
                </p>
              </div>
            </div>

            <div
              class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700"
            >
              <button
                type="button"
                @click="showPolicyHours = false"
                class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="savingPolicyHours || !isPolicyHoursValid"
                class="px-6 py-3 text-sm font-medium text-white bg-brand hover:bg-brand-light disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors shadow-sm hover:shadow-md"
              >
                <span v-if="savingPolicyHours" class="flex items-center">
                  <svg
                    class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </span>
                <span v-else class="flex items-center">
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  Save Policy Hours
                </span>
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, reactive } from "vue";
import { RouterLink } from "vue-router";
import type { RoomsStats, Room, BulkPolicyHoursRequest } from "@/types/rooms";
import type { Stay, TodayStay } from "@/types/stays";
import { getRoomsStats, getRooms, updateBulkPolicyHours } from "@/api/rooms";
import {
  getCurrentStays,
  getTodayArrivals,
  getTodayDepartures,
} from "@/api/stays";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
const stats = ref<RoomsStats | null>(null);
const rooms = ref<Room[]>([]);
const currentStays = ref<Stay[]>([]);
const todayArrivals = ref<TodayStay[]>([]);
const todayDepartures = ref<TodayStay[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const statusFilters = ref<string[]>([]);
const stayTypeFilters = ref<string[]>(["current"]); // По умолчанию показываем текущие проживания

// Policy hours settings
const showPolicyHours = ref(false);
const savingPolicyHours = ref(false);
const policyHoursForm = reactive<BulkPolicyHoursRequest>({
  checkInHour: null,
  checkOutHour: null,
});

async function load() {
  try {
    loading.value = true;
    error.value = null;

    stats.value = await getRoomsStats();
    rooms.value = await getRooms();

    // Загружаем текущие проживания, но не блокируем загрузку дашборда при ошибке
    try {
      currentStays.value = await getCurrentStays();
    } catch (stayError) {
      console.warn("Failed to load current stays:", stayError);
      currentStays.value = [];
    }

    // Загружаем сегодняшние заезды и выезды
    try {
      todayArrivals.value = await getTodayArrivals();
    } catch (arrivalError) {
      console.warn("Failed to load today arrivals:", arrivalError);
      todayArrivals.value = [];
    }

    try {
      todayDepartures.value = await getTodayDepartures();
    } catch (departureError) {
      console.warn("Failed to load today departures:", departureError);
      todayDepartures.value = [];
    }

    // Заполняем форму текущими значениями из номера с установленным временем
    if (rooms.value.length > 0) {
      const roomWithTime = rooms.value.find(
        (room) => room.checkInHour !== null || room.checkOutHour !== null
      );

      if (roomWithTime) {
        policyHoursForm.checkInHour = roomWithTime.checkInHour ?? null;
        policyHoursForm.checkOutHour = roomWithTime.checkOutHour ?? null;
      } else {
        // Если ни у одного номера нет времени, берем значения по умолчанию
        policyHoursForm.checkInHour = 14; // 14:00 по умолчанию
        policyHoursForm.checkOutHour = 10; // 10:00 по умолчанию
      }
    }
  } catch (e: any) {
    console.error("Error loading dashboard data:", e);
    error.value = e?.message || "Failed to load data";
  } finally {
    loading.value = false;
  }
}

// Функции для кнопок +/- времени
function increaseCheckInHour() {
  const current = policyHoursForm.checkInHour || 0;
  policyHoursForm.checkInHour = Math.min(23, current + 1);
}

function decreaseCheckInHour() {
  const current = policyHoursForm.checkInHour || 0;
  policyHoursForm.checkInHour = Math.max(0, current - 1);
}

function increaseCheckOutHour() {
  const current = policyHoursForm.checkOutHour || 0;
  policyHoursForm.checkOutHour = Math.min(23, current + 1);
}

function decreaseCheckOutHour() {
  const current = policyHoursForm.checkOutHour || 0;
  policyHoursForm.checkOutHour = Math.max(0, current - 1);
}

async function savePolicyHours() {
  try {
    savingPolicyHours.value = true;

    // Преобразуем значения в числа
    const payload = {
      checkInHour: policyHoursForm.checkInHour
        ? Number(policyHoursForm.checkInHour)
        : null,
      checkOutHour: policyHoursForm.checkOutHour
        ? Number(policyHoursForm.checkOutHour)
        : null,
    };

    await updateBulkPolicyHours(payload);
    showPolicyHours.value = false;

    // Показываем сообщение об успехе
    alert("Policy hours updated successfully for all rooms!");

    // Перезагружаем данные после успешного сохранения
    await load();
  } catch (e: any) {
    console.error("Error saving policy hours:", e);
    alert("Failed to save policy hours");
  } finally {
    savingPolicyHours.value = false;
  }
}

// Computed свойство для отфильтрованных комнат
const filteredRooms = computed(() => {
  let filtered = rooms.value;

  // Фильтр по статусу комнаты
  if (statusFilters.value.length > 0) {
    filtered = filtered.filter((room) =>
      statusFilters.value.includes(room.status)
    );
  }

  // Фильтр по заездам сегодня
  if (stayTypeFilters.value.includes("arrivals")) {
    const arrivalRoomNumbers = todayArrivals.value.map(
      (stay) => stay.room.number
    );
    filtered = filtered.filter((room) =>
      arrivalRoomNumbers.includes(room.roomNumber)
    );
  }

  // Фильтр по выездам сегодня
  if (stayTypeFilters.value.includes("departures")) {
    const departureRoomNumbers = todayDepartures.value.map(
      (stay) => stay.room.number
    );
    filtered = filtered.filter((room) =>
      departureRoomNumbers.includes(room.roomNumber)
    );
  }

  return filtered;
});

// Валидация формы Policy Hours
const isPolicyHoursValid = computed(() => {
  const checkIn = policyHoursForm.checkInHour;
  const checkOut = policyHoursForm.checkOutHour;

  return (
    checkIn !== null &&
    checkOut !== null &&
    checkIn >= 0 &&
    checkIn <= 23 &&
    checkOut >= 0 &&
    checkOut <= 23
  );
});

// Функции для работы с фильтрами
function toggleStatusFilter(status: string) {
  const index = statusFilters.value.indexOf(status);
  if (index > -1) {
    statusFilters.value.splice(index, 1);
  } else {
    statusFilters.value.push(status);
  }
}

function toggleStayTypeFilter(type: "current" | "arrivals" | "departures") {
  const index = stayTypeFilters.value.indexOf(type);
  if (index > -1) {
    stayTypeFilters.value.splice(index, 1);
  } else {
    stayTypeFilters.value.push(type);
  }
}

function clearFilters() {
  statusFilters.value = [];
  stayTypeFilters.value = []; // Очищаем все фильтры
}

function getStayTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    current: "Current",
    arrival: "Arrival",
    departure: "Departure",
  };
  return labels[type] || type;
}

function getRoomArrivalDate(room: Room): string {
  // Приоритет 1: Ищем заезд сегодня для этой комнаты
  const arrival = todayArrivals.value.find(
    (stay) => stay.room.number === room.roomNumber
  );
  if (arrival) {
    return arrival.checkIn;
  }

  // Приоритет 2: Ищем выезд сегодня для этой комнаты (может быть заезд в тот же день)
  const departure = todayDepartures.value.find(
    (stay) => stay.room.number === room.roomNumber
  );
  if (departure) {
    return departure.checkIn;
  }

  // Приоритет 3: Ищем текущее проживание для этой комнаты
  const currentStay = currentStays.value.find(
    (stay) => stay.room.roomNumber === room.roomNumber
  );
  if (currentStay) {
    return currentStay.checkIn;
  }

  return "—";
}

function getRoomDepartureDate(room: Room): string {
  // Приоритет 1: Ищем выезд сегодня для этой комнаты
  const departure = todayDepartures.value.find(
    (stay) => stay.room.number === room.roomNumber
  );
  if (departure) {
    return departure.checkOut;
  }

  // Приоритет 2: Ищем заезд сегодня для этой комнаты (может быть выезд в тот же день)
  const arrival = todayArrivals.value.find(
    (stay) => stay.room.number === room.roomNumber
  );
  if (arrival) {
    return arrival.checkOut;
  }

  // Приоритет 3: Ищем текущее проживание для этой комнаты
  const currentStay = currentStays.value.find(
    (stay) => stay.room.roomNumber === room.roomNumber
  );
  if (currentStay) {
    return currentStay.checkOut;
  }

  return "—";
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    free: "Free",
    booked: "Booked",
    occupied: "Occupied",
  };
  return labels[status] || status;
}

function getTableTitle(): string {
  if (statusFilters.value.length === 0) {
    return "All Rooms";
  }

  if (statusFilters.value.length === 1) {
    return `${getStatusLabel(statusFilters.value[0])} Rooms`;
  }

  if (statusFilters.value.length === 2) {
    return `${getStatusLabel(statusFilters.value[0])} & ${getStatusLabel(
      statusFilters.value[1]
    )} Rooms`;
  }

  return "Filtered Rooms";
}

onMounted(load);
</script>
