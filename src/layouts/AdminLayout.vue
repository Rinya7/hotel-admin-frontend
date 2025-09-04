<!-- AdminLayout (для admin/editor) -->
<!-- layouts/AdminLayout.vue -->
<template>
  <div>
    <!-- Шапка для готельної адмінки -->
    <header
      style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px;
        border-bottom: 1px solid #ddd;
      "
    >
      <strong>HOTEL FIELER</strong>
      <div>
        <RouterLink to="/" style="margin-right: 10px">Dashboard</RouterLink>
        <RouterLink to="/rooms">Rooms</RouterLink>
      </div>
      <span style="" v-if="auth.isLogged">
        <em style="margin-right: 10px"
          >{{ auth.displayName }} ({{ auth.role ?? "?" }})</em
        >
        <button @click="onLogout">Logout</button>
      </span>
    </header>

    <main style="padding: 16px">
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
