<!-- frontend/src/views/Login.vue -->
<template>
  <div>
    <h1>Вхід</h1>

    <form @submit.prevent="onSubmit" style="display: flex; gap: 8px">
      <input v-model="form.username" placeholder="username" required />
      <input
        v-model="form.password"
        type="password"
        placeholder="password"
        required
      />
      <button :disabled="loading">Увійти</button>
    </form>

    <!-- Помилку показуємо тільки коли вона є -->
    <p v-if="error" style="color: crimson; margin-top: 8px">{{ error }}</p>
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
