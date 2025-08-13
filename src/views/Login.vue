<!-- frontend/src/views/Login.vue -->
<template>
  <div
    style="
      min-height: 70vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f8f8f8;
    "
  >
    <div style="padding: 16px; max-width: 600px; margin: 0 auto">
      <h1 style="text-align: center">Вхід</h1>

      <form @submit.prevent="onSubmit" style="max-width: 300px; margin: 0 auto">
        <div style="display: flex; flex-direction: column; gap: 8px">
          <input
            v-model="form.username"
            placeholder="username"
            required
            style="text-align: center"
          />
          <input
            v-model="form.password"
            type="password"
            placeholder="password"
            required
            style="text-align: center"
          />

          <button :disabled="loading" style="">Увійти</button>
        </div>
      </form>

      <!-- Помилку показуємо тільки коли вона є -->
      <p v-if="error" style="color: crimson; margin-top: 8px">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const auth = useAuthStore();
const router = useRouter();

const form = reactive({ username: "", password: "" });
const error = ref<string>("");
const loading = ref<boolean>(false);

// Якщо вже залогінений — одразу відправляємо на дашборд
onMounted(() => {
  if (auth.isLogged) {
    router.replace({ name: "dashboard" });
  }
});

async function onSubmit(): Promise<void> {
  error.value = "";
  loading.value = true;

  try {
    await auth.login({ username: form.username, password: form.password });

    // ⬇️ Редірект за роллю
    if (auth.isSuperadmin) {
      router.replace({ name: "sa-dashboard" });
    } else {
      router.replace({ name: "dashboard" });
    }
  } catch {
    // ❌ Невдача: показуємо помилку
    error.value = "Невірний логін або пароль";
  } finally {
    loading.value = false;
  }
}
</script>
