<!--frontend/src/views/Login.vue
<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const username = ref<string>("");
const password = ref<string>("");
const loading = ref<boolean>(false);
const error = ref<string>("");

async function submit(): Promise<void> {
  loading.value = true;
  error.value = "";
  try {
    await auth.login({ username: username.value, password: password.value });

    // редірект у свою зону
    const next = (route.query.next as string | undefined) ?? null;
    if (auth.role === "superadmin") {
      router.replace(next ?? { name: "sa-dashboard" });
    } else {
      router.replace(next ?? { name: "app-dashboard" });
    }
  } catch {
    error.value = "Невірний логін або пароль";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen grid place-items-center p-6">
    <div class="w-full max-w-sm border rounded-xl p-4">
      <h1 class="text-lg font-semibold mb-3">Вхід</h1>
      <div class="space-y-3">
        <input
          v-model="username"
          placeholder="Username"
          class="w-full border rounded p-2"
        />
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="w-full border rounded p-2"
        />
        <button
          :disabled="loading"
          class="w-full border rounded p-2"
          @click="submit"
        >
          {{ loading ? "Зачекайте..." : "Увійти" }}
        </button>
        <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>
      </div>
    </div>
  </div>
</template>-->

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
    // ✅ Успіх: чистимо помилку і йдемо на дашборд
    error.value = "";
    router.replace({ name: "dashboard" });
  } catch {
    // ❌ Невдача: показуємо помилку
    error.value = "Невірний логін або пароль";
  } finally {
    loading.value = false;
  }
}
</script>
