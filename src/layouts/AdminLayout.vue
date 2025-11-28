<!-- AdminLayout (для admin/editor) -->
<template>
  <header class="border-b-2 border-emerald-700 pt-4">
    <div
      class="container  mx-auto flex items-center justify-between px-2 md:px-0 py-2"
    >
      <!-- Навігація -->
      <nav class="flex gap-[20px]">
        <RouterLink to="/" v-slot="{ isExactActive }">
          <span
            :class="[
              'font-semibold text-brand rounded-md px-3 py-1.5 dark:text-white',
              isExactActive
                ? 'border border-brand dark:border-white cursor-default'
                : 'dark:hover:border hover:bg-brand hover:text-white hover:border-brand dark:hover:border-white dark:hover:text-white',
            ]"
          >
            Dashboard
          </span>
        </RouterLink>
        <RouterLink to="/rooms" v-slot="{ isActive }">
          <span
            :class="[
              'font-semibold text-brand rounded-md px-3 py-1.5 dark:text-white',
              isActive
                ? 'border border-brand dark:border-white cursor-default'
                : 'dark:hover:border hover:bg-brand hover:text-white hover:border-brand dark:hover:border-white dark:hover:text-white',
            ]"
          >
            Rooms
          </span>
        </RouterLink>
        <RouterLink to="/audit" v-slot="{ isActive }">
          <span
            :class="[
              'font-semibold text-brand rounded-md px-3 py-1.5 dark:text-white',
              isActive
                ? 'border border-brand dark:border-white cursor-default'
                : 'dark:hover:border hover:bg-brand hover:text-white hover:border-brand dark:hover:border-white dark:hover:text-white',
            ]"
          >
            🕓 Audit Center
          </span>
        </RouterLink>
      </nav>

       

      <!-- Профіль -->
      <div v-if="auth.isLogged" class="flex items-center gap-[6px]">
        <em
          class="mr-2 text-brand font-semibold bg-gray-100 rounded-md px-3 py-1.5"
          >{{ auth.displayName }} ({{ auth.role ?? "?" }})
        </em>
        <Button @click="onLogout" size="sm" variant="outline"> Logout </Button>
      </div>
    </div>
  </header>

  <main class="container mx-auto py-[32px] px-0 ">
    <div class="relative">
    <!-- Лого -->
    <div class="absolute left-1/3 -translate-x-1/2 md:left-1/2 md:-top-1/3 lg:-top-1/2">
        <img :src="logo" alt="Logo" class="h-[40px] md:h-[60px] lg:h-[100px]" />
      </div>
    <div class="flex justify-end">
      <LanguageSwitcher />
    </div></div>
    <RouterView />
  </main>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import LanguageSwitcher from "@/components/LanguageSwitcher.vue";
import logo from "@/assets/logo.png";
import Button from "@/components/ui/Button.vue";

const auth = useAuthStore();
const router = useRouter();

function onLogout(): void {
  auth.logout();
  router.replace({ name: "login" });
}
</script>
