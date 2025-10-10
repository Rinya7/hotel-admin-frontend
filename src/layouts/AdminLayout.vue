<!-- AdminLayout (для admin/editor) -->
<!-- layouts/AdminLayout.vue -->
<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Шапка для готельної адмінки -->
    <header
      class="flex justify-between items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
    >
      <strong class="text-xl font-bold text-brand dark:text-white"
        >HOTEL FIELER</strong
      >
      <div class="flex items-center gap-4">
        <RouterLink to="/" v-slot="{ isExactActive }">
          <span
            :class="[
              'text-gray-700 dark:text-gray-300 transition-colors',
              isExactActive
                ? 'text-brand dark:text-white font-semibold'
                : 'hover:text-brand dark:hover:text-white',
            ]"
          >
            Dashboard
          </span>
        </RouterLink>
        <RouterLink to="/rooms" v-slot="{ isActive }">
          <span
            :class="[
              'text-gray-700 dark:text-gray-300 transition-colors',
              isActive
                ? 'text-brand dark:text-white font-semibold'
                : 'hover:text-brand dark:hover:text-white',
            ]"
          >
            Rooms
          </span>
        </RouterLink>
      </div>
      <span v-if="auth.isLogged" class="flex items-center gap-3">
        <em class="text-sm text-gray-600 dark:text-gray-400">
          {{ auth.displayName }} ({{ auth.role ?? "?" }})
        </em>
        <button
          @click="onLogout"
          class="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
        >
          Logout
        </button>
      </span>
    </header>

    <main class="p-4">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const router = useRouter();

function onLogout(): void {
  auth.logout();
  router.replace({ name: "login" });
}
</script>
