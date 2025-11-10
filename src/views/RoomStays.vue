<!-- RoomStays.vue — список проживаний комнаты + создать/сменить статус -->
<template>
  <section class="space-y-6">
    <header class="flex items-center justify-between">
      <h2 class="text-2xl font-semibold text-brand dark:text-white">
        {{ t("roomStays.title", { roomNumber }) }}
      </h2>
      <RouterLink
        to="/rooms"
        class="text-brand hover:text-brand-light dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
      >
        ← {{ t("roomStays.back") }}
      </RouterLink>
    </header>

    <div
      v-if="isRoomCleaning"
      class="border border-yellow-300 dark:border-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
    >
      <div class="space-y-1">
        <h3 class="text-sm font-semibold text-yellow-900 dark:text-yellow-200">
          {{ t("roomStays.cleaningBanner.title", { roomNumber }) }}
        </h3>
        <p class="text-sm text-yellow-800 dark:text-yellow-300">
          {{ t("roomStays.cleaningBanner.description") }}
        </p>
      </div>
      <div class="flex justify-end">
        <button
          type="button"
          class="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-brand bg-brand/15 hover:bg-brand/25 dark:text-emerald-300 dark:bg-emerald-500/20 dark:hover:bg-emerald-500/30 rounded-lg border border-brand/20 dark:border-emerald-500/30 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          :disabled="cleaningLoading"
          @click="markRoomAsCleaned"
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
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
          <span v-if="cleaningLoading" class="animate-pulse">…</span>
          <span v-else>{{ t("roomStays.cleaningBanner.button") }}</span>
        </button>
      </div>
    </div>

    <div class="grid gap-6">
      <aside class="space-y-6">
        <div
          class="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm"
        >
          <h3 class="text-lg font-semibold text-brand dark:text-white">
            {{ t("roomStays.summary.title") }}
          </h3>
          <dl class="mt-4 space-y-3">
            <div class="flex items-center justify-between gap-3">
              <dt class="text-sm text-gray-500 dark:text-gray-400">
                {{ t("roomStays.summary.statusLabel") }}
              </dt>
              <dd>
                <span
                  v-if="currentRoom"
                  :class="[
                    getRoomStatusClass(currentRoom.status),
                    'px-2 py-1 rounded text-xs font-semibold',
                  ]"
                >
                  {{ t(`roomsList.statusNames.${currentRoom.status}`) }}
                </span>
                <span v-else class="text-sm text-gray-400 dark:text-gray-500"
                  >—</span
                >
              </dd>
            </div>
            <div class="flex items-start justify-between gap-3">
              <dt class="text-sm text-gray-500 dark:text-gray-400">
                {{ t("roomStays.summary.capacityLabel") }}
              </dt>
              <dd class="text-sm text-gray-700 dark:text-gray-300 text-right">
                {{ roomCapacityDisplay }}
              </dd>
            </div>
            <div class="flex items-start justify-between gap-3">
              <dt class="text-sm text-gray-500 dark:text-gray-400">
                {{ t("roomStays.summary.lastCleaned") }}
              </dt>
              <dd class="text-sm text-gray-700 dark:text-gray-300 text-right">
                {{ lastCleanedDisplay }}
              </dd>
            </div>
            <div class="flex items-start justify-between gap-3">
              <dt class="text-sm text-gray-500 dark:text-gray-400">
                {{ t("roomStays.summary.lastCleanedBy") }}
              </dt>
              <dd class="text-sm text-gray-700 dark:text-gray-300 text-right">
                {{ lastCleanedByDisplay }}
              </dd>
            </div>
          </dl>
          <div
            class="mt-6 border-t border-dashed border-gray-200 dark:border-gray-700 pt-4 space-y-4"
          >
            <div>
              <h4 class="text-sm font-semibold text-brand dark:text-white">
                {{ t("roomStays.summary.currentStay.title") }}
              </h4>
              <p
                v-if="!summaryStay"
                class="mt-2 text-sm text-gray-600 dark:text-gray-400"
              >
                {{ t("roomStays.summary.currentStay.noData") }}
              </p>
              <div v-else class="mt-3 space-y-4">
                <div>
                  <div class="border-b border-gray-200 dark:border-gray-700">
                    <nav class="flex space-x-4">
                      <button
                        type="button"
                        @click="summaryActiveTab = 'info'"
                        :class="[
                          'py-2 px-3 text-sm font-medium border-b-2 transition-colors',
                          summaryActiveTab === 'info'
                            ? 'border-brand text-brand dark:border-emerald-400 dark:text-emerald-400'
                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
                        ]"
                      >
                        {{ t("roomStays.summary.tabs.info") }}
                      </button>
                      <button
                        type="button"
                        @click="summaryActiveTab = 'history'"
                        :class="[
                          'py-2 px-3 text-sm font-medium border-b-2 transition-colors',
                          summaryActiveTab === 'history'
                            ? 'border-brand text-brand dark:border-emerald-400 dark:text-emerald-400'
                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
                        ]"
                      >
                        {{ t("roomStays.summary.tabs.history") }}
                      </button>
                    </nav>
                  </div>

                  <div
                    v-if="summaryActiveTab === 'info'"
                    class="mt-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 p-4 space-y-4"
                  >
                    <dl class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <dt
                          class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
                        >
                          {{ t("roomStays.summary.currentStay.fields.id") }}
                        </dt>
                        <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                          {{ summaryStay.id }}
                        </dd>
                      </div>
                      <div>
                        <dt
                          class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
                        >
                          {{ t("roomStays.summary.currentStay.fields.room") }}
                        </dt>
                        <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                          {{ summaryStay.room.roomNumber }}
                        </dd>
                      </div>
                      <div>
                        <dt
                          class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
                        >
                          {{
                            t("roomStays.summary.currentStay.fields.booking")
                          }}
                        </dt>
                        <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                          {{ formatBookingNumber(summaryStay) }}
                        </dd>
                      </div>
                      <div>
                        <dt
                          class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
                        >
                          {{ t("roomStays.summary.currentStay.guest") }}
                        </dt>
                        <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                          {{ summaryStay.mainGuestName }}
                        </dd>
                      </div>
                      <div>
                        <dt
                          class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
                        >
                          {{ t("roomStays.summary.currentStay.status") }}
                        </dt>
                        <dd class="mt-1">
                          <span
                            :class="[
                              getStatusClass(summaryStay.status),
                              'px-2 py-1 rounded text-xs font-semibold',
                            ]"
                          >
                            {{ t(`roomStays.status.${summaryStay.status}`) }}
                          </span>
                        </dd>
                      </div>
                      <div>
                        <dt
                          class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
                        >
                          {{ t("roomStays.summary.currentStay.checkIn") }}
                        </dt>
                        <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                          {{ formatDateForDisplay(summaryStay.checkIn, false) }}
                        </dd>
                      </div>
                      <div>
                        <dt
                          class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
                        >
                          {{ t("roomStays.summary.currentStay.checkOut") }}
                        </dt>
                        <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                          {{
                            formatDateForDisplay(summaryStay.checkOut, false)
                          }}
                        </dd>
                      </div>
                      <div>
                        <dt
                          class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
                        >
                          {{ t("roomStays.summary.currentStay.balance") }}
                        </dt>
                        <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                          {{
                            typeof summaryStay.balance === "number"
                              ? summaryStay.balance.toFixed(2)
                              : summaryStay.balance ?? "—"
                          }}
                        </dd>
                      </div>
                      <div v-if="summaryStay.createdBy">
                        <dt
                          class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
                        >
                          {{
                            t("roomStays.summary.currentStay.fields.createdBy")
                          }}
                        </dt>
                        <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                          {{ summaryStay.createdBy }}
                        </dd>
                      </div>
                      <div v-if="summaryStay.updatedBy">
                        <dt
                          class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
                        >
                          {{
                            t("roomStays.summary.currentStay.fields.updatedBy")
                          }}
                        </dt>
                        <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                          {{ summaryStay.updatedBy }}
                          <span
                            v-if="summaryStay.updatedByRole"
                            class="text-xs text-gray-500 dark:text-gray-400 ml-1"
                          >
                            {{
                              t(
                                "roomStays.summary.currentStay.fields.updatedByRole",
                                { role: summaryStay.updatedByRole }
                              )
                            }}
                          </span>
                        </dd>
                      </div>
                      <div class="sm:col-span-2">
                        <dt
                          class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
                        >
                          {{ t("roomStays.summary.currentStay.extraGuests") }}
                        </dt>
                        <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                          <template v-if="summaryStay.extraGuestNames?.length">
                            {{ summaryStay.extraGuestNames.join(", ") }}
                          </template>
                          <span v-else>
                            {{
                              t(
                                "roomStays.summary.currentStay.extraGuestsEmpty"
                              )
                            }}
                          </span>
                        </dd>
                      </div>
                      <div class="sm:col-span-2">
                        <dt
                          class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
                        >
                          {{
                            t("roomStays.summary.currentStay.registeredGuests")
                          }}
                        </dt>
                        <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                          <template v-if="summaryStay.guests?.length">
                            <ul class="space-y-2">
                              <li
                                v-for="guest in summaryStay.guests"
                                :key="guest.id ?? guest.fullName"
                                class="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2"
                              >
                                <p class="font-medium">
                                  {{ guest.fullName }}
                                </p>
                                <p
                                  v-if="
                                    guest.documentType || guest.documentNumber
                                  "
                                  class="text-xs text-gray-600 dark:text-gray-300 mt-1"
                                >
                                  {{
                                    t(
                                      "roomStays.summary.currentStay.guestDocument"
                                    )
                                  }}:
                                  <span class="font-medium">
                                    {{ guest.documentType || "—" }}
                                  </span>
                                  <span v-if="guest.documentNumber">
                                    · {{ guest.documentNumber }}
                                  </span>
                                </p>
                                <p
                                  v-if="guest.birthDate"
                                  class="text-xs text-gray-600 dark:text-gray-300"
                                >
                                  {{
                                    t(
                                      "roomStays.summary.currentStay.guestBirthDate"
                                    )
                                  }}:
                                  <span class="font-medium">
                                    {{
                                      formatDateForDisplay(
                                        guest.birthDate,
                                        false
                                      )
                                    }}
                                  </span>
                                </p>
                                <p
                                  v-if="guest.notes"
                                  class="text-xs text-gray-600 dark:text-gray-300"
                                >
                                  {{
                                    t(
                                      "roomStays.summary.currentStay.guestNotes"
                                    )
                                  }}:
                                  <span class="font-medium whitespace-pre-line">
                                    {{ guest.notes }}
                                  </span>
                                </p>
                              </li>
                            </ul>
                          </template>
                          <span v-else>
                            {{
                              t(
                                "roomStays.summary.currentStay.registeredGuestsEmpty"
                              )
                            }}
                          </span>
                        </dd>
                      </div>
                      <div
                        v-if="summaryCancellationComment"
                        class="sm:col-span-2"
                      >
                        <dt
                          class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
                        >
                          {{ t("roomStays.summary.currentStay.commentLabel") }}
                        </dt>
                        <dd
                          class="mt-1 text-sm text-gray-900 dark:text-white whitespace-pre-line"
                        >
                          {{ summaryCancellationComment }}
                        </dd>
                      </div>
                    </dl>
                  </div>
                  <div
                    v-else
                    class="mt-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 p-3"
                  >
                    <StayHistory :stay-id="summaryStay.id" />
                  </div>
                </div>

                <div class="flex flex-wrap gap-2">
                  <button
                    v-if="canEditSummaryDates"
                    type="button"
                    class="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-brand bg-brand/10 hover:bg-brand/20 border border-brand/20 rounded-md transition-colors"
                    @click="openEditDatesModal"
                  >
                    {{ t("roomStays.summary.currentStay.editDates") }}
                  </button>
                </div>

                <div
                  v-if="!isSummaryFinal"
                  class="space-y-3 rounded-lg bg-gray-50 dark:bg-gray-700/40 border border-gray-200 dark:border-gray-600 px-3 py-4"
                >
                  <h5 class="text-sm font-semibold text-brand dark:text-white">
                    {{ t("roomStays.summary.currentStay.statusForm.title") }}
                  </h5>
                  <div class="space-y-2">
                    <label
                      class="block text-xs font-semibold text-gray-600 dark:text-gray-300"
                    >
                      {{
                        t(
                          "roomStays.summary.currentStay.statusForm.selectLabel"
                        )
                      }}
                    </label>
                    <select
                      v-model="statusDraft"
                      class="w-full text-sm px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand"
                    >
                      <option
                        v-for="option in availableStatusOptions"
                        :key="`summary-status-${option}`"
                        :value="option"
                      >
                        {{ getStatusSelectLabel(option) }}
                      </option>
                    </select>
                  </div>
                  <div v-if="statusDraft === 'cancelled'" class="space-y-2">
                    <label
                      class="block text-xs font-semibold text-gray-600 dark:text-gray-300"
                    >
                      {{
                        t(
                          "roomStays.summary.currentStay.statusForm.commentLabel"
                        )
                      }}
                    </label>
                    <textarea
                      v-model.trim="statusComment"
                      rows="3"
                      class="w-full text-sm px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand"
                      :placeholder="statusCommentPlaceholder"
                    ></textarea>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      {{ statusCommentHint }}
                    </p>
                  </div>
                  <p
                    v-if="statusDraft === 'completed' && !canCompleteToday"
                    class="text-xs text-amber-600 dark:text-amber-400"
                  >
                    {{
                      t("stayDetails.status.messages.completeOnlyOnCheckout")
                    }}
                  </p>
                  <p
                    v-if="statusError"
                    class="text-xs text-red-600 dark:text-red-400"
                  >
                    {{ statusError }}
                  </p>
                  <div class="flex justify-end">
                    <button
                      type="button"
                      class="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-brand hover:bg-brand-light rounded-md transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                      :disabled="statusSubmitDisabled"
                      @click="submitStatusUpdate"
                    >
                      <span v-if="isSavingStatus" class="animate-pulse">…</span>
                      <span>
                        {{
                          t("roomStays.summary.currentStay.statusForm.submit")
                        }}
                      </span>
                    </button>
                  </div>
                </div>
                <p v-else class="text-xs text-gray-500 dark:text-gray-400">
                  {{
                    t("roomStays.summary.currentStay.statusForm.finalMessage")
                  }}
                </p>
              </div>
            </div>
            <div
              class="border-t border-dashed border-gray-200 dark:border-gray-700 pt-4"
            >
              <h4 class="text-sm font-semibold text-brand dark:text-white">
                {{ t("roomStays.summary.nextStay.title") }}
              </h4>
              <p
                v-if="!upcomingStay"
                class="text-sm text-gray-600 dark:text-gray-400 mt-2"
              >
                {{ t("roomStays.summary.nextStay.empty") }}
              </p>
              <div
                v-else
                class="mt-3 space-y-2 rounded-lg bg-gray-50 dark:bg-gray-700/40 p-3"
              >
                <div class="text-sm text-gray-700 dark:text-gray-300">
                  <span class="font-medium">
                    {{ t("roomStays.summary.nextStay.guest") }}:
                  </span>
                  <span class="ml-1">{{ upcomingStay.mainGuestName }}</span>
                </div>
                <div class="text-sm text-gray-700 dark:text-gray-300">
                  <span class="font-medium">
                    {{ t("roomStays.summary.nextStay.booking") }}:
                  </span>
                  <span class="ml-1">{{
                    formatBookingNumber(upcomingStay)
                  }}</span>
                </div>
                <div class="text-sm text-gray-700 dark:text-gray-300">
                  <span class="font-medium">
                    {{ t("roomStays.summary.nextStay.dates") }}:
                  </span>
                  <span class="ml-1">{{ formatStayPeriod(upcomingStay) }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span
                    class="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    {{ t("roomStays.summary.nextStay.status") }}:
                  </span>
                  <span
                    :class="[
                      getStatusClass(upcomingStay.status),
                      'px-2 py-1 rounded text-xs font-medium',
                    ]"
                  >
                    {{ t(`roomStays.status.${upcomingStay.status}`) }}
                  </span>
                </div>
                <p
                  v-if="
                    upcomingStay.status === 'occupied' &&
                    isStayActive(upcomingStay)
                  "
                  class="text-xs font-medium text-emerald-600 dark:text-emerald-300"
                >
                  {{ t("roomStays.summary.nextStay.current") }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
      <div class="space-y-6">
        <div class="space-y-4">
          <div
            class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between"
          >
            <h3 class="text-lg font-semibold text-brand dark:text-white">
              {{ t("roomStays.historyCurrent") }}
            </h3>
            <div class="flex flex-col gap-2 md:items-end">
              <span
                class="text-sm font-medium text-gray-600 dark:text-gray-300"
              >
                {{ t("roomStays.filters.title") }}
              </span>
              <p
                class="text-xs text-gray-500 dark:text-gray-400 max-w-xs md:text-right"
              >
                {{ t("roomStays.filters.hint") }}
              </p>
              <div class="flex flex-wrap gap-2 md:justify-end">
                <button
                  v-for="status in stayStatusOptions"
                  :key="status"
                  type="button"
                  :class="getFilterButtonClasses(status)"
                  @click="toggleStatusFilter(status)"
                >
                  {{ t(`roomStays.status.${status}`) }}
                </button>
              </div>
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
                  <th class="px-4 py-3 text-center font-medium w-16">
                    {{ t("roomStays.table.booking") }}
                  </th>
                  <th class="px-4 py-3 text-left font-medium">
                    {{ t("roomStays.table.guest") }}
                  </th>
                  <th class="px-4 py-3 text-left font-medium min-w-[200px]">
                    {{ t("roomStays.table.dates") }}
                  </th>
                  <th class="px-4 py-3 text-left font-medium min-w-[140px]">
                    {{ t("roomStays.table.status") }}
                  </th>
                  <th class="px-4 py-3 text-center font-medium w-24">
                    {{ t("roomStays.table.balance") }}
                  </th>
                  <th class="px-4 py-3 text-center font-medium w-28">
                    {{ t("roomStays.table.actions") }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <template v-if="!hasAnyStays">
                  <tr>
                    <td colspan="6" class="px-4 py-16 text-center">
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
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            ></path>
                          </svg>
                        </div>
                        <h3
                          class="text-lg font-semibold text-gray-900 dark:text-white mb-2"
                        >
                          {{ t("roomStays.empty.title") }}
                        </h3>
                        <p
                          class="text-sm text-gray-500 dark:text-gray-400 max-w-md"
                        >
                          {{ t("roomStays.empty.message") }}
                        </p>
                      </div>
                    </td>
                  </tr>
                </template>
                <template v-else>
                  <template v-if="filteredStays.length === 0">
                    <tr>
                      <td
                        colspan="6"
                        class="px-4 py-12 text-center text-sm text-gray-500 dark:text-gray-400"
                      >
                        {{ t("roomStays.filters.noResults") }}
                      </td>
                    </tr>
                  </template>
                  <template v-else>
                    <tr
                      v-for="s in filteredStays"
                      :key="s.id"
                      class="border-t border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td
                        class="px-4 py-3 text-gray-900 dark:text-white font-semibold text-center"
                      >
                        {{ formatBookingNumber(s) }}
                      </td>
                      <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
                        {{ s.mainGuestName }}
                      </td>
                      <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
                        <span class="font-medium">
                          {{
                            formatDateForDisplay(`${s.checkIn}T00:00:00`, false)
                          }}
                        </span>
                        <span class="mx-2 text-gray-400 dark:text-gray-500"
                          >→</span
                        >
                        <span class="font-medium">
                          {{
                            formatDateForDisplay(
                              `${s.checkOut}T00:00:00`,
                              false
                            )
                          }}
                        </span>
                      </td>
                      <td class="px-4 py-3">
                        <span
                          :class="[
                            getStatusClass(s.status),
                            'px-2 py-1 rounded text-xs font-medium',
                          ]"
                        >
                          {{ t(`roomStays.status.${s.status}`) }}
                        </span>
                      </td>
                      <td
                        class="px-4 py-3 text-gray-700 dark:text-gray-300 text-center font-medium"
                      >
                        {{
                          typeof s.balance === "number"
                            ? s.balance.toFixed(2)
                            : s.balance ?? "—"
                        }}
                      </td>
                      <td class="px-4 py-3 text-center">
                        <div
                          class="flex flex-col gap-2 sm:flex-row sm:justify-center"
                        >
                          <button
                            type="button"
                            :disabled="s.status !== 'booked'"
                            class="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
                            :class="
                              s.status === 'booked'
                                ? 'text-white bg-brand hover:bg-brand-light'
                                : 'text-gray-400 bg-gray-100 dark:bg-gray-700 cursor-not-allowed'
                            "
                            @click="openEditStayModal(s)"
                          >
                            {{ t("roomStays.editStayModal.open") }}
                          </button>
                          <button
                            type="button"
                            :disabled="!canCheckInStay(s)"
                            class="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
                            :class="
                              canCheckInStay(s)
                                ? 'text-white bg-amber-600 hover:bg-amber-500'
                                : 'text-gray-400 bg-gray-100 dark:bg-gray-700 cursor-not-allowed'
                            "
                            @click="startCheckInProcess(s)"
                          >
                            {{ t("roomStays.table.checkIn") }}
                          </button>
                        </div>
                      </td>
                    </tr>
                  </template>
                </template>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showEditDatesModal"
      class="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      @click.self="closeEditDatesModal"
    >
      <div
        class="w-full max-w-md rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl"
      >
        <div
          class="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700"
        >
          <h3 class="text-lg font-semibold text-brand dark:text-emerald-300">
            {{ t("stayDetails.editDates.title") }}
          </h3>
          <button
            type="button"
            @click="closeEditDatesModal"
            class="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg
              class="w-5 h-5"
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

        <div class="px-4 py-5 space-y-4">
          <div class="space-y-2">
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {{ t("stayDetails.editDates.checkInLabel") }}
            </label>
            <input
              v-model="editDatesCheckIn"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand"
              :max="editDatesCheckOut || undefined"
              required
            />
          </div>
          <div class="space-y-2">
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {{ t("stayDetails.editDates.checkOutLabel") }}
            </label>
            <input
              v-model="editDatesCheckOut"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand"
              :min="editDatesCheckIn || undefined"
              required
            />
          </div>
          <p
            v-if="editDatesError"
            class="text-sm text-red-500 dark:text-red-400"
          >
            {{ editDatesError }}
          </p>
          <div class="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              @click="closeEditDatesModal"
              class="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {{ t("stayDetails.editDates.cancel") }}
            </button>
            <button
              type="button"
              :disabled="isUpdatingDates"
              @click="saveEditedDates"
              class="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-brand hover:bg-brand-light rounded-md transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span v-if="isUpdatingDates" class="animate-pulse">…</span>
              <span>{{ t("stayDetails.editDates.save") }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showEditStayModal"
      class="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      @click.self="closeEditStayModal"
    >
      <div
        class="w-full max-w-lg rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl"
      >
        <div
          class="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700"
        >
          <h3 class="text-lg font-semibold text-brand dark:text-emerald-300">
            {{ t("roomStays.editStayModal.title") }}
          </h3>
          <button
            type="button"
            @click="closeEditStayModal"
            class="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg
              class="w-5 h-5"
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

        <div class="px-4 py-5 space-y-4">
          <div class="space-y-2">
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {{ t("roomStays.editStayModal.fields.guest") }}
            </label>
            <input
              v-model="editStayForm.mainGuestName"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {{ t("roomStays.editStayModal.fields.checkIn") }}
              </label>
              <input
                v-model="editStayForm.checkIn"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand"
              />
            </div>
            <div class="space-y-2">
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {{ t("roomStays.editStayModal.fields.checkOut") }}
              </label>
              <input
                v-model="editStayForm.checkOut"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {{ t("roomStays.editStayModal.fields.extraGuests") }}
            </label>
            <textarea
              v-model.trim="editStayExtraGuestsLine"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand"
              :placeholder="
                t('roomStays.editStayModal.placeholders.extraGuests')
              "
            ></textarea>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ t("roomStays.editStayModal.hints.extraGuests") }}
            </p>
          </div>

          <div class="space-y-2">
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {{ t("roomStays.editStayModal.fields.status") }}
            </label>
            <select
              v-model="editStayForm.status"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand"
            >
              <option value="booked">
                {{ t("roomStays.status.booked") }}
              </option>
              <option value="cancelled">
                {{ t("roomStays.status.cancelled") }}
              </option>
            </select>
          </div>

          <div v-if="editStayForm.status === 'cancelled'" class="space-y-2">
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {{ t("roomStays.editStayModal.fields.comment") }}
            </label>
            <textarea
              v-model="editStayForm.comment"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand"
              :placeholder="t('roomStays.editStayModal.placeholders.comment')"
            ></textarea>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ t("roomStays.editStayModal.hints.comment") }}
            </p>
          </div>

          <p
            v-if="editStayError"
            class="text-sm text-red-500 dark:text-red-400"
          >
            {{ editStayError }}
          </p>

          <div class="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              @click="closeEditStayModal"
              class="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {{ t("roomStays.editStayModal.cancel") }}
            </button>
            <button
              type="button"
              class="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-brand hover:bg-brand-light rounded-md transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              :disabled="isSavingStay"
              @click="saveEditedStay"
            >
              <span v-if="isSavingStay" class="animate-pulse">…</span>
              <span>{{ t("roomStays.editStayModal.save") }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <details
      open
      class="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg p-4"
    >
      <summary
        class="text-lg font-medium text-brand dark:text-white cursor-pointer mb-4"
      >
        {{ t("roomStays.createNewStay") }}
      </summary>
      <form @submit.prevent="createNew" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            v-model.trim="form.mainGuestName"
            :placeholder="t('roomStays.form.mainGuestName')"
            required
            :class="[
              'w-full text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border rounded-lg text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand',
              formError
                ? 'border-red-500 dark:border-red-500'
                : 'border-gray-300 dark:border-gray-600',
            ]"
            @input="formError = ''"
          />
          <input
            v-model.trim="extraGuestsLine"
            :placeholder="t('roomStays.form.extraGuests')"
            :class="[
              'w-full text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border rounded-lg text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand',
              formError
                ? 'border-red-500 dark:border-red-500'
                : 'border-gray-300 dark:border-gray-600',
            ]"
            @input="formError = ''"
          />
          <div class="flex gap-2">
            <input
              v-model="form.checkIn"
              type="date"
              required
              :class="[
                'flex-1 text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border rounded-lg text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand',
                formError
                  ? 'border-red-500 dark:border-red-500'
                  : 'border-gray-300 dark:border-gray-600',
              ]"
              @change="formError = ''"
            />
            <input
              v-model="form.checkOut"
              type="date"
              required
              :class="[
                'flex-1 text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border rounded-lg text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand',
                formError
                  ? 'border-red-500 dark:border-red-500'
                  : 'border-gray-300 dark:border-gray-600',
              ]"
              @change="formError = ''"
            />
          </div>
          <div class="flex gap-2">
            <select
              v-model="form.status"
              class="flex-1 text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand"
              @change="formError = ''"
            >
              <option value="booked">{{ t("roomStays.status.booked") }}</option>
              <option value="occupied">
                {{ t("roomStays.status.occupied") }}
              </option>
            </select>
            <input
              v-model.number="form.balance"
              type="number"
              step="0.01"
              :placeholder="t('roomStays.form.balance')"
              class="flex-1 text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand"
              @input="formError = ''"
            />
          </div>
        </div>

        <!-- Сообщение об ошибке прямо в форме -->
        <div
          v-if="formError"
          class="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
        >
          <svg
            class="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <div class="flex-1">
            <p
              class="text-sm font-semibold text-red-800 dark:text-red-300 mb-1"
            >
              {{ t("roomStays.messages.error") }}
            </p>
            <p class="text-sm text-red-700 dark:text-red-400">
              {{ formError }}
            </p>
          </div>
          <button
            type="button"
            @click="formError = ''"
            class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors flex-shrink-0"
          >
            <svg
              class="w-5 h-5"
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

        <!-- Кнопка создания по центру -->
        <div class="flex justify-center py-10">
          <button
            type="submit"
            class="px-6 py-2.5 bg-brand hover:bg-brand-light text-white rounded-lg transition-colors font-medium shadow-sm hover:shadow-md"
          >
            {{ t("roomStays.createButton") }}
          </button>
        </div>
      </form>
    </details>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useNotifications } from "@/composables/useNotifications";
import type { Stay, CreateStayRequest } from "@/types/stays";
import {
  listStaysByRoom,
  createStayForRoom,
  updateStayStatus,
  updateStayByDates,
  fetchStayHistory,
} from "@/api/stays";
import { getRooms, markRoomCleaned, fetchRoomHistory } from "@/api/rooms";
import type { Room, RoomStatus, RoomStatusLog } from "@/types/rooms";
import StayHistory from "@/components/stays/StayHistory.vue";

const route = useRoute();
const router = useRouter();
const { t, locale } = useI18n();
const { showSuccess, showError, showWarning } = useNotifications();
const roomNumber = String(route.params.roomNumber ?? "");
const stays = ref<Stay[]>([]);
const currentRoom = ref<Room | null>(null);
const cleaningLoading = ref(false);
const statusFilters = ref<Stay["status"][]>(["booked"]);
const stayStatusOptions: Stay["status"][] = [
  "booked",
  "occupied",
  "completed",
  "cancelled",
];
const roomLogs = ref<RoomStatusLog[]>([]);

const isRoomCleaning = computed(() => currentRoom.value?.status === "cleaning");
const hasAnyStays = computed(() => stays.value.length > 0);
const summaryActiveTab = ref<"info" | "history">("info");
const filteredStays = computed<Stay[]>(() => {
  if (statusFilters.value.length === 0) {
    return stays.value;
  }
  return stays.value.filter((stay) =>
    statusFilters.value.includes(stay.status)
  );
});

const summaryStay = computed<Stay | null>(() => {
  if (!currentRoom.value) {
    return null;
  }

  if (currentRoom.value.status === "occupied") {
    const active = stays.value.find(
      (stay) => stay.status === "occupied" && isStayActive(stay)
    );
    if (active) {
      return active;
    }
    const fallbackOccupied = stays.value.find(
      (stay) => stay.status === "occupied"
    );
    if (fallbackOccupied) {
      return fallbackOccupied;
    }
  }

  if (currentRoom.value.status === "free") {
    return null;
  }

  if (currentRoom.value.status === "cleaning") {
    return null;
  }

  return null;
});

watch(summaryStay, () => {
  summaryActiveTab.value = "info";
});

const upcomingStay = computed<Stay | undefined>(() => {
  if (stays.value.length === 0) {
    return undefined;
  }

  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ).getTime();

  const futureBooked = stays.value
    .filter((stay) => stay.status === "booked")
    .map((stay) => ({
      stay,
      checkInTime: new Date(`${stay.checkIn}T00:00:00`).getTime(),
    }))
    .filter(({ checkInTime }) => checkInTime >= startOfToday)
    .sort((a, b) => a.checkInTime - b.checkInTime);

  if (futureBooked.length > 0) {
    return futureBooked[0].stay;
  }

  // Fallback: return the earliest booked stay, even if it is already in the past,
  // so that operators still see the closest booking.
  const anyBooked = stays.value
    .filter((stay) => stay.status === "booked")
    .sort(
      (a, b) =>
        new Date(`${a.checkIn}T00:00:00`).getTime() -
        new Date(`${b.checkIn}T00:00:00`).getTime()
    );

  return anyBooked[0];
});

const summaryCancellationComment = ref<string | null>(null);
const statusDraft = ref<Stay["status"] | null>(null);
const statusComment = ref("");
const statusError = ref<string | null>(null);
const isSavingStatus = ref(false);
const editStayExtraGuestsLine = ref("");

const showEditStayModal = ref(false);
const editingStay = ref<Stay | null>(null);
const editStayForm = reactive({
  mainGuestName: "",
  checkIn: "",
  checkOut: "",
  status: "booked" as Stay["status"],
  comment: "",
});
const editStayError = ref<string | null>(null);
const isSavingStay = ref(false);

const statusCommentPlaceholder = computed(() =>
  t("roomStays.summary.currentStay.statusForm.commentPlaceholder")
);
const statusCommentHint = computed(() =>
  t("roomStays.summary.currentStay.statusForm.commentHint")
);

function normalizeDateString(value: string): string {
  if (!value) {
    return "";
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value.slice(0, 10);
  }
  return parsed.toISOString().slice(0, 10);
}

const todayISO = computed(() => normalizeDateString(new Date().toISOString()));

function toDateOnly(value: string): string {
  return value.includes("T") ? normalizeDateString(value) : value;
}
const canCompleteToday = computed(() =>
  summaryStay.value ? summaryStay.value.checkOut === todayISO.value : false
);
const isSummaryFinal = computed(() =>
  summaryStay.value
    ? ["cancelled", "completed"].includes(summaryStay.value.status)
    : false
);
const canEditSummaryDates = computed(() =>
  summaryStay.value ? summaryStay.value.status === "occupied" : false
);
const availableStatusOptions = computed<Stay["status"][]>(() => {
  if (!summaryStay.value) {
    return [];
  }
  const current = summaryStay.value.status;
  if (current === "occupied") {
    return ["occupied", "completed"];
  }
  return [current];
});

const statusSubmitDisabled = computed(() => {
  if (!summaryStay.value || !statusDraft.value) {
    return true;
  }
  if (isSavingStatus.value) {
    return true;
  }
  if (statusDraft.value === summaryStay.value.status) {
    return true;
  }
  if (statusDraft.value === "completed" && !canCompleteToday.value) {
    return true;
  }
  if (statusDraft.value === "cancelled" && !statusComment.value.trim()) {
    return true;
  }
  return false;
});

const showEditDatesModal = ref(false);
const editDatesCheckIn = ref("");
const editDatesCheckOut = ref("");
const editDatesError = ref<string | null>(null);
const isUpdatingDates = ref(false);

const lastCleaningLog = computed<RoomStatusLog | undefined>(() =>
  roomLogs.value.find(
    (log) => log.oldStatus === "cleaning" && log.newStatus === "free"
  )
);

const lastCleanedDisplay = computed(() => {
  if (lastCleaningLog.value) {
    return formatDateForDisplay(lastCleaningLog.value.changedAt, true);
  }
  if (currentRoom.value?.lastCleanedAt) {
    return formatDateForDisplay(currentRoom.value.lastCleanedAt, true);
  }
  return t("roomStays.summary.unknown") as string;
});

const lastCleanedByDisplay = computed(() => {
  if (lastCleaningLog.value?.changedBy) {
    return lastCleaningLog.value.changedBy;
  }
  if (currentRoom.value?.lastCleanedBy) {
    return currentRoom.value.lastCleanedBy;
  }
  return t("roomStays.summary.unknown") as string;
});

const roomCapacityDisplay = computed(() => {
  const capacity = currentRoom.value?.capacity;
  if (typeof capacity === "number" && capacity > 0) {
    return t("roomStays.summary.capacityValue", { count: capacity }) as string;
  }
  return t("roomStays.summary.capacityUnknown") as string;
});

function sortStaysByDate(): void {
  stays.value.sort((a, b) => {
    const aDate = new Date(`${a.checkIn}T00:00:00`);
    const bDate = new Date(`${b.checkIn}T00:00:00`);
    const diff = aDate.getTime() - bDate.getTime();
    if (diff !== 0) return diff;
    return a.id - b.id;
  });
}

const form = reactive<CreateStayRequest>({
  mainGuestName: "",
  extraGuestNames: [],
  checkIn: "",
  checkOut: "",
  status: "booked",
  balance: 0,
});

const extraGuestsLine = ref("");
const formError = ref("");

function hasActiveOverlap(newCheckIn: string, newCheckOut: string): boolean {
  if (!newCheckIn || !newCheckOut) {
    return false;
  }
  const start = new Date(`${newCheckIn}T00:00:00`);
  const end = new Date(`${newCheckOut}T00:00:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return false;
  }
  return stays.value.some((stay) => {
    if (!stay.checkIn || !stay.checkOut) {
      return false;
    }
    if (stay.status !== "booked" && stay.status !== "occupied") {
      return false;
    }
    const stayStart = new Date(`${stay.checkIn}T00:00:00`);
    const stayEnd = new Date(`${stay.checkOut}T00:00:00`);
    if (Number.isNaN(stayStart.getTime()) || Number.isNaN(stayEnd.getTime())) {
      return false;
    }
    return start < stayEnd && end > stayStart;
  });
}

async function load() {
  const fetched = await listStaysByRoom(roomNumber);
  stays.value = fetched.map((stay) => ({
    ...stay,
    checkIn: toDateOnly(stay.checkIn),
    checkOut: toDateOnly(stay.checkOut),
    extraGuestNames: stay.extraGuestNames ?? [],
    guests: stay.guests ?? [],
  }));
  sortStaysByDate();
  await loadRoomInfo();
  await loadRoomLogs();
}

async function createNew() {
  // Сбрасываем предыдущую ошибку
  formError.value = "";

  try {
    if (!form.checkIn || !form.checkOut) {
      formError.value = t("roomStays.messages.invalidData") as string;
      return;
    }

    if (form.checkOut <= form.checkIn) {
      formError.value = t("roomStays.messages.invalidRange") as string;
      return;
    }

    if (hasActiveOverlap(form.checkIn, form.checkOut)) {
      formError.value = t("roomStays.messages.dateConflict") as string;
      return;
    }

    form.extraGuestNames = extraGuestsLine.value
      .split(",")
      .map((x) => x.trim())
      .filter((x) => x.length > 0);
    const created = await createStayForRoom(roomNumber, form);

    // Проверяем, что объект создан корректно
    if (!created || !created.id) {
      console.error("Invalid response from server:", created);
      throw new Error("Invalid response from server");
    }

    // Добавляем созданный стейт в список и пересортировываем
    stays.value.push({
      ...created,
      checkIn: toDateOnly(created.checkIn),
      checkOut: toDateOnly(created.checkOut),
      extraGuestNames: created.extraGuestNames ?? [],
      guests: created.guests ?? [],
    } as Stay);
    sortStaysByDate();

    // Сброс формы
    form.mainGuestName = "";
    extraGuestsLine.value = "";
    form.checkIn = "";
    form.checkOut = "";
    form.status = "booked";
    form.balance = 0;
    formError.value = "";

    showSuccess(
      t("roomStays.messages.success"),
      t("roomStays.messages.stayCreated")
    );
    await loadRoomInfo();
  } catch (error: unknown) {
    console.error("Error creating stay:", error);

    // Извлекаем понятное сообщение об ошибке
    let errorMessage = t("roomStays.messages.unknownError");

    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response?: { status?: number; data?: { message?: string } };
      };
      const status = axiosError.response?.status;
      const serverMessage = axiosError.response?.data?.message;

      // Обработка конфликта дат (409)
      if (status === 409) {
        if (
          serverMessage &&
          serverMessage.includes("already booked/occupied")
        ) {
          errorMessage = t("roomStays.messages.dateConflict");
        } else {
          errorMessage = t("roomStays.messages.dateConflict");
        }
      } else if (serverMessage) {
        errorMessage = serverMessage;
      } else if (status === 404) {
        errorMessage = t("roomStays.messages.roomNotFound");
      } else if (status === 400) {
        errorMessage = t("roomStays.messages.invalidData");
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    // Показываем ошибку в форме
    formError.value = errorMessage;
  }
}

function getStatusClass(status: Stay["status"]): string {
  const classes: Record<Stay["status"], string> = {
    booked:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    occupied: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    completed: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };
  return (
    classes[status] ??
    "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
  );
}

function getRoomStatusClass(status?: RoomStatus | null): string {
  if (!status) {
    return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
  }
  const classes: Record<RoomStatus, string> = {
    free: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    occupied: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    cleaning: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
  };
  return (
    classes[status] ??
    "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
  );
}

function formatDateForDisplay(value?: string | null, withTime = false): string {
  if (!value) {
    return t("roomStays.summary.unknown") as string;
  }
  const formatter = new Intl.DateTimeFormat(locale.value ?? "uk-UA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    ...(withTime
      ? {
          hour: "2-digit",
          minute: "2-digit",
        }
      : {}),
  });
  return formatter.format(new Date(value));
}

function formatStayPeriod(stay: Stay): string {
  const start = formatDateForDisplay(`${stay.checkIn}T00:00:00`, false);
  const end = formatDateForDisplay(`${stay.checkOut}T00:00:00`, false);
  return `${start} → ${end}`;
}

function formatBookingNumber(stay: Stay): string {
  const roomId = stay.room?.roomNumber ?? roomNumber;
  return `${roomId}-${stay.id}`;
}

function isStayActive(stay: Stay): boolean {
  const now = Date.now();
  const start = new Date(`${stay.checkIn}T00:00:00`).getTime();
  const end = new Date(`${stay.checkOut}T23:59:59`).getTime();
  return start <= now && now <= end;
}

function toggleStatusFilter(status: Stay["status"]): void {
  const index = statusFilters.value.indexOf(status);
  if (index > -1) {
    statusFilters.value.splice(index, 1);
  } else {
    statusFilters.value.push(status);
  }
}

function getFilterButtonClasses(status: Stay["status"]): string {
  const base =
    "px-3 py-1.5 text-sm font-medium rounded-full border transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand";
  const isActive = statusFilters.value.includes(status);

  const activeClasses: Record<Stay["status"], string> = {
    booked:
      "bg-yellow-100 border-yellow-300 text-yellow-900 dark:bg-yellow-900/60 dark:border-yellow-600 dark:text-yellow-100",
    occupied:
      "bg-blue-100 border-blue-300 text-blue-900 dark:bg-blue-900/60 dark:border-blue-600 dark:text-blue-100",
    completed:
      "bg-gray-200 border-gray-300 text-gray-900 dark:bg-gray-700/70 dark:border-gray-500 dark:text-gray-50",
    cancelled:
      "bg-red-100 border-red-300 text-red-900 dark:bg-red-900/60 dark:border-red-600 dark:text-red-100",
  };

  const inactiveClasses =
    "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-brand/60 hover:text-brand dark:hover:text-emerald-300";

  return `${base} ${isActive ? activeClasses[status] : inactiveClasses}`;
}

function getStatusSelectLabel(status: Stay["status"]): string {
  return t(`roomStays.status.${status}`) as string;
}

async function loadSummaryCancellationComment(stayId: number): Promise<void> {
  try {
    const data = await fetchStayHistory(stayId);
    const cancelledLog = data.logs?.find(
      (log) => log.newStatus === "cancelled"
    );
    summaryCancellationComment.value = cancelledLog?.comment ?? null;
  } catch (err) {
    console.error("Error loading cancellation comment for room summary:", err);
    summaryCancellationComment.value = null;
  }
}

function extractErrorMessage(error: unknown): string | null {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as {
      response?: { status?: number; data?: { message?: string } };
    };
    const message = axiosError.response?.data?.message;
    if (typeof message === "string" && message.length > 0) {
      return message;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return null;
}

async function submitStatusUpdate(): Promise<void> {
  if (!summaryStay.value || !statusDraft.value) {
    return;
  }

  statusError.value = null;

  if (statusDraft.value === summaryStay.value.status) {
    statusError.value = t(
      "roomStays.summary.currentStay.statusForm.noChange"
    ) as string;
    return;
  }

  if (statusDraft.value === "completed" && !canCompleteToday.value) {
    statusError.value = t(
      "stayDetails.status.messages.completeOnlyOnCheckout"
    ) as string;
    return;
  }

  if (statusDraft.value === "cancelled" && !statusComment.value.trim()) {
    statusError.value = t(
      "roomStays.summary.currentStay.statusForm.commentRequired"
    ) as string;
    return;
  }

  try {
    isSavingStatus.value = true;
    await updateStayStatus(summaryStay.value.id, {
      status: statusDraft.value,
      comment: statusComment.value.trim() || undefined,
    });
    showSuccess(
      t("roomStays.summary.currentStay.statusForm.successTitle"),
      t("roomStays.summary.currentStay.statusForm.successMessage")
    );
    await load();
  } catch (error: unknown) {
    const message =
      extractErrorMessage(error) ??
      (t("roomStays.messages.statusChangeError") as string);
    statusError.value = message;
    showError(t("roomStays.messages.error"), message);
  } finally {
    isSavingStatus.value = false;
  }
}

function openEditDatesModal(): void {
  if (!summaryStay.value || !canEditSummaryDates.value) {
    return;
  }
  editDatesError.value = null;
  editDatesCheckIn.value = summaryStay.value.checkIn;
  editDatesCheckOut.value = summaryStay.value.checkOut;
  showEditDatesModal.value = true;
  document.body.style.overflow = "hidden";
}

function closeEditDatesModal(): void {
  showEditDatesModal.value = false;
  editDatesError.value = null;
  document.body.style.overflow = "";
}

async function saveEditedDates(): Promise<void> {
  if (!summaryStay.value) {
    return;
  }

  editDatesError.value = null;

  if (!editDatesCheckIn.value || !editDatesCheckOut.value) {
    editDatesError.value = t(
      "stayDetails.editDates.validators.required"
    ) as string;
    return;
  }

  if (editDatesCheckIn.value > editDatesCheckOut.value) {
    editDatesError.value = t(
      "stayDetails.editDates.validators.order"
    ) as string;
    return;
  }

  try {
    isUpdatingDates.value = true;
    await updateStayByDates(
      summaryStay.value.room.roomNumber,
      summaryStay.value.checkIn,
      summaryStay.value.checkOut,
      {
        newCheckIn: editDatesCheckIn.value,
        newCheckOut: editDatesCheckOut.value,
      }
    );
    showSuccess(
      t("stayDetails.editDates.successTitle"),
      t("stayDetails.editDates.successMessage")
    );
    closeEditDatesModal();
    await load();
  } catch (error: unknown) {
    const maybeAxios =
      error && typeof error === "object" && "response" in error
        ? (error as {
            response?: { status?: number; data?: { message?: string } };
          })
        : null;

    if (maybeAxios?.response?.status === 409) {
      const conflictMessage = t(
        "stayDetails.editDates.conflictMessage"
      ) as string;
      editDatesError.value = conflictMessage;
      showWarning(
        t("stayDetails.editDates.conflictTitle") as string,
        conflictMessage
      );
    } else {
      const message =
        extractErrorMessage(error) ??
        (t("stayDetails.editDates.errorMessage") as string);
      editDatesError.value = message;
      showError(t("stayDetails.editDates.errorMessage"), message);
    }
  } finally {
    isUpdatingDates.value = false;
  }
}

function openEditStayModal(stay: Stay): void {
  editingStay.value = stay;
  editStayForm.mainGuestName = stay.mainGuestName;
  editStayForm.checkIn = stay.checkIn;
  editStayForm.checkOut = stay.checkOut;
  editStayForm.status = stay.status === "cancelled" ? "cancelled" : "booked";
  editStayForm.comment = "";
  editStayError.value = null;
  editStayExtraGuestsLine.value = (stay.extraGuestNames ?? []).join("\n");
  showEditStayModal.value = true;
  document.body.style.overflow = "hidden";
}

function closeEditStayModal(): void {
  showEditStayModal.value = false;
  editingStay.value = null;
  editStayError.value = null;
  editStayForm.mainGuestName = "";
  editStayForm.checkIn = "";
  editStayForm.checkOut = "";
  editStayForm.status = "booked";
  editStayForm.comment = "";
  editStayExtraGuestsLine.value = "";
  document.body.style.overflow = "";
}

async function saveEditedStay(): Promise<void> {
  if (!editingStay.value) {
    return;
  }

  editStayError.value = null;

  const trimmedName = editStayForm.mainGuestName.trim();
  const original = editingStay.value;
  const shouldUpdateName =
    trimmedName.length > 0 && trimmedName !== original.mainGuestName;
  const shouldUpdateDates =
    editStayForm.checkIn !== original.checkIn ||
    editStayForm.checkOut !== original.checkOut;
  const targetStatus = editStayForm.status;
  const shouldUpdateStatus = targetStatus !== original.status;
  const originalExtraGuests = original.extraGuestNames ?? [];
  const newExtraGuests = editStayExtraGuestsLine.value
    .split("\n")
    .map((guest) => guest.trim())
    .filter((guest) => guest.length > 0);
  const shouldUpdateExtraGuests =
    newExtraGuests.length !== originalExtraGuests.length ||
    newExtraGuests.some((guest, index) => guest !== originalExtraGuests[index]);

  if (
    !shouldUpdateName &&
    !shouldUpdateDates &&
    !shouldUpdateStatus &&
    !shouldUpdateExtraGuests
  ) {
    editStayError.value = t(
      "roomStays.editStayModal.messages.noChanges"
    ) as string;
    return;
  }

  if (targetStatus === "cancelled" && !editStayForm.comment.trim()) {
    editStayError.value = t(
      "roomStays.editStayModal.messages.commentRequired"
    ) as string;
    return;
  }

  try {
    isSavingStay.value = true;
    let updatedStay: Stay = original;

    if (shouldUpdateName || shouldUpdateDates || shouldUpdateExtraGuests) {
      const payload: Parameters<typeof updateStayByDates>[3] = {};
      if (shouldUpdateName) {
        payload.mainGuestName = trimmedName;
      }
      if (shouldUpdateDates) {
        payload.newCheckIn = editStayForm.checkIn;
        payload.newCheckOut = editStayForm.checkOut;
      }
      if (shouldUpdateExtraGuests) {
        payload.extraGuestNames = newExtraGuests;
      }

      updatedStay = await updateStayByDates(
        original.room.roomNumber,
        original.checkIn,
        original.checkOut,
        payload
      );
    }

    if (shouldUpdateStatus) {
      await updateStayStatus(updatedStay.id, {
        status: targetStatus,
        comment:
          targetStatus === "cancelled"
            ? editStayForm.comment.trim() || undefined
            : undefined,
      });
    }

    showSuccess(
      t("roomStays.editStayModal.messages.successTitle"),
      t("roomStays.editStayModal.messages.success") as string
    );
    closeEditStayModal();
    await load();
  } catch (error: unknown) {
    const maybeAxios =
      error && typeof error === "object" && "response" in error
        ? (error as {
            response?: { status?: number; data?: { message?: string } };
          })
        : null;

    if (maybeAxios?.response?.status === 409) {
      editStayError.value = t(
        "stayDetails.editDates.conflictMessage"
      ) as string;
      showWarning(
        t("stayDetails.editDates.conflictTitle") as string,
        editStayError.value
      );
    } else {
      const message =
        extractErrorMessage(error) ??
        (t("roomStays.editStayModal.messages.error") as string);
      editStayError.value = message;
      showError(t("roomStays.messages.error"), message);
    }
  } finally {
    isSavingStay.value = false;
  }
}

function canCheckInStay(stay: Stay): boolean {
  if (stay.status !== "booked") {
    return false;
  }
  const today = todayISO.value;
  const checkIn = toDateOnly(stay.checkIn);
  const checkOut = toDateOnly(stay.checkOut);
  return checkIn <= today && checkOut >= today;
}

function startCheckInProcess(stay: Stay): void {
  if (!canCheckInStay(stay)) {
    return;
  }
  router.push({
    name: "stay-checkin",
    params: { roomNumber, id: stay.id },
  });
}

async function loadRoomInfo(): Promise<void> {
  try {
    const rooms = await getRooms();
    currentRoom.value =
      rooms.find((room) => room.roomNumber === roomNumber) ?? null;
  } catch (err) {
    console.error("Error loading room info:", err);
  }
}

async function loadRoomLogs(): Promise<void> {
  try {
    const history = await fetchRoomHistory(roomNumber);
    roomLogs.value = history.logs || [];
  } catch (err) {
    console.error("Error loading room logs:", err);
    roomLogs.value = [];
  }
}

async function markRoomAsCleaned(): Promise<void> {
  if (!currentRoom.value) {
    return;
  }

  cleaningLoading.value = true;
  try {
    const response = await markRoomCleaned(currentRoom.value.id);
    currentRoom.value = response.room;
    showSuccess(
      t("roomStays.cleaningBanner.successTitle"),
      t("roomStays.cleaningBanner.successMessage")
    );
  } catch (err) {
    console.error("Error marking room cleaned:", err);
    let message = t("roomStays.cleaningBanner.errorMessage");
    if (err && typeof err === "object" && "response" in err) {
      const axiosError = err as {
        response?: { status?: number; data?: { message?: string } };
      };
      const serverMessage = axiosError.response?.data?.message;
      if (serverMessage) {
        message = serverMessage;
      }
    } else if (err instanceof Error) {
      message = err.message;
    }
    showError(t("roomStays.cleaningBanner.errorTitle"), message);
  } finally {
    cleaningLoading.value = false;
    await loadRoomInfo();
    await loadRoomLogs();
  }
}

watch(
  summaryStay,
  (stay) => {
    statusError.value = null;
    statusComment.value = "";
    if (stay) {
      const options = availableStatusOptions.value;
      statusDraft.value = options.includes(stay.status)
        ? stay.status
        : options[0] ?? null;
      editDatesCheckIn.value = stay.checkIn;
      editDatesCheckOut.value = stay.checkOut;
      if (stay.status === "cancelled") {
        void loadSummaryCancellationComment(stay.id);
      } else {
        summaryCancellationComment.value = null;
      }
    } else {
      statusDraft.value = null;
      summaryCancellationComment.value = null;
    }
  },
  { immediate: true }
);

watch(statusDraft, (value) => {
  statusError.value = null;
  if (value !== "cancelled") {
    statusComment.value = "";
  }
});

watch(availableStatusOptions, (options) => {
  if (!summaryStay.value) {
    return;
  }
  if (!options.length) {
    statusDraft.value = null;
    return;
  }
  if (!statusDraft.value || !options.includes(statusDraft.value)) {
    statusDraft.value = options[0];
  }
});

onUnmounted(() => {
  document.body.style.overflow = "";
});

onMounted(load);
</script>
