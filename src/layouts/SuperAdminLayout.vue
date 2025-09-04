<template>
  <header
    class="mx-auto flex items-center justify-between px-3 pt-6 border-b-2 border-emerald-700"
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
  </header>

  <main class="mx-auto p-4 md:p-6">
    <LanguageSwitcher />
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

function onLogout(): void {
  auth.logout();
  router.replace({ name: "login" });
}
</script>

<style scoped>
/* за потреби: .layout-bg { background-image: url('@/assets/bg_image.jpg'); ... } */
</style>
