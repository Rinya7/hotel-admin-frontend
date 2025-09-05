<template>
  <header class="border-b-2 border-emerald-700 pt-4">
    <div
      class="container mx-auto flex items-center justify-between px-2 md:px-0 py-2"
    >
      <!-- Навігація -->
      <nav class="flex gap-9">
        <RouterLink
          :to="{ name: 'sa-dashboard' }"
          class="text-black"
          active-class="font-semibold underline"
          >Dashboard</RouterLink
        >
        <RouterLink
          :to="{ name: 'sa-hotels' }"
          class="text-black"
          active-class="font-semibold underline"
          >Hotels</RouterLink
        >
      </nav>

      <!-- Лого -->
      <div class="flex items-center justify-center">
        <img :src="logo" alt="Logo" class="h-10" />
      </div>

      <!-- Профіль -->
      <div v-if="auth.isLogged" class="flex items-center gap-2">
        <em class="mr-2 text-gray-600"
          >{{ auth.displayName }} ({{ auth.role ?? "?" }})</em
        >
        <button @click="onLogout" class="btn btn-sm">Logout</button>
      </div>
    </div>
  </header>

  <main class="container mx-auto p-4 md:p-6">
    <div class="flex justify-end mb-4">
      <LanguageSwitcher />
    </div>
    <RouterView />
  </main>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import LanguageSwitcher from "@/components/LanguageSwitcher.vue";
import logo from "@/assets/logo.png";

const auth = useAuthStore();
const router = useRouter();

/**
 * Логаут:
 * 1) чистимо стор (токен/юзера),
 * 2) повертаємо на сторінку логіну.
 */
function onLogout(): void {
  auth.logout();
  router.replace({ name: "login" });
}
</script>

<style scoped>
/* за потреби: .layout-bg { background-image: url('@/assets/bg_image.jpg'); ... } */
</style>
