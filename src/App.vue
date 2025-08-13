<!--<template>
  <div>
    <header
      style="
        display: flex;
        gap: 16px;
        align-items: center;
        padding: 12px;
        border-bottom: 1px solid #ddd;
      "
    >
      <strong>Hotel Admin</strong>
      <RouterLink to="/">Dashboard</RouterLink>
      <RouterLink to="/rooms">Rooms</RouterLink>
      <span style="margin-left: auto" v-if="auth.isLogged">
        <em>{{ auth.username }} ({{ auth.role ?? "?" }})</em>
        <button @click="onLogout">Logout</button>
      </span>
    </header>
    <main style="padding: 16px">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "./stores/auth";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const router = useRouter();

function onLogout() {
  auth.logout();
  router.replace({ name: "login" });
}
</script>-->

<!-- frontend/src/App.vue -->
<template>
  <div>
    <header
      style="
        display: flex;
        gap: 16px;
        align-items: center;
        padding: 12px;
        border-bottom: 1px solid #ddd;
      "
    >
      <strong>Hotel Admin</strong>
      <RouterLink to="/">Dashboard</RouterLink>
      <RouterLink to="/rooms">Rooms</RouterLink>

      <!-- Блок праворуч: показуємо лише коли є токен -->
      <span style="margin-left: auto" v-if="auth.isLogged">
        <!-- Коли профільLoaded === false (під час старту) — покажемо три крапки -->
        <em>{{
          auth.profileLoaded ? `${auth.displayName} (${auth.role ?? "?"})` : "…"
        }}</em>
        <button @click="onLogout">Logout</button>
      </span>
    </header>

    <main style="padding: 16px">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "./stores/auth";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const router = useRouter();

function onLogout(): void {
  auth.logout();
  router.replace({ name: "login" });
}
</script>
