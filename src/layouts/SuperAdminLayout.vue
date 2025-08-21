<!-- SuperAdminLayout (для superadmin) -->
<!-- src/layouts/SuperAdminLayout.vue -->
<template>
  <!-- Шапка для супер-адміна -->
  <header
    style="
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 24px;
      padding-left: 12px;
      padding-right: 12px;
      border-bottom: 2px solid #2e7d32;
      position: relative;
    "
  >
    <!-- Навігація -->
    <nav style="display: flex; gap: 36px">
      <!--<strong>HoteLotse</strong>-->
      <RouterLink to="/sa" style="color: #fff">Dashboard</RouterLink>
      <RouterLink to="/sa/hotels" style="color: #fff">Hotels</RouterLink>
      <RouterLink to="/sa/admins" style="color: #fff">Admins</RouterLink>
    </nav>

    <!-- Лого -->
    <div style="display: flex; justify-content: center">
      <img
        :src="logo"
        alt="HoteLotse Logo"
        style="height: 40px; align-items: center; position: relative; top: 0px"
      />
    </div>
    <span v-if="auth.isLogged">
      <em style="margin-right: 10px; color: #fff"
        >{{ auth.displayName }} ({{ auth.role ?? "?" }})</em
      >
      <button @click="onLogout" style="">Logout</button>
    </span>
  </header>

  <main
    style="margin: 0 auto; padding: 24px; padding: 16px; align-items: center"
  >
    <RouterView />
  </main>
</template>

<script setup lang="ts">
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";
import logo from "../assets/logo.png";
//import image from "../assets/bg_picktures.jpg";

const auth = useAuthStore();
const router = useRouter();

function onLogout(): void {
  auth.logout();
  router.replace({ name: "login" });
}
</script>

<style scoped>
.layout-bg {
  height: full;
  background-image: url("../assets/bg_image.jpg");
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}
</style>
