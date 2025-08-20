<!-- frontend/src/views/Login.vue -->
<template>
  <div
    style="
      display: flex;
      flex-direction: column; /* в колонку */
      align-items: center; /* по центру горизонтали */
      justify-content: center; /* по центру вертикали */
      height: 100vh; /* чтоб заняло весь экран */
      gap: 16px; /* расстояние между элементами */
    "
  >
    <img
      :src="logo"
      alt="HoteLotse Logo"
      style="width: 100%; max-width: 320px; align-items: center; margin: 0 auto"
    />
    <h1 style="text-align: center">Вхід</h1>

    <!-- Форма -->
    <form
      @submit.prevent="onSubmit"
      style="
        display: flex;
        flex-direction: column;
        gap: 12px;
        width: 100%;
        max-width: 320px; /* ограничиваем ширину формы */
      "
    >
      <input
        v-model="form.username"
        placeholder="username"
        required
        :disabled="loading"
        aria-label="Username"
        class="input"
      />
      <input
        v-model="form.password"
        type="password"
        placeholder="password"
        required
        :disabled="loading"
        aria-label="Password"
        class="input"
      />

      <button :disabled="loading" :aria-busy="loading" class="login-btn">
        <template v-if="!loading">Увійти</template>
        <template v-else>
          <span class="spinner" aria-hidden="true"></span>
          <span style="margin-left: 6px">Входимо…</span>
        </template>
      </button>
    </form>

    <!-- Помилку показуємо тільки коли вона є -->
    <p v-if="error" style="color: crimson; margin-top: 8px">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
/**
 * Компонент логіну:
 * - показує лоадер під час запиту
 * - блокує поля/кнопку щоб уникнути повторної відправки
 * - на успіх робить редірект за роллю
 * - на помилку показує повідомлення
 */
import { reactive, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import logo from "../assets/logo.png";

const auth = useAuthStore();
const router = useRouter();

// Локальний стан форми
const form = reactive({ username: "", password: "" });
const error = ref<string>("");
const loading = ref<boolean>(false);

// Якщо вже залогінений — одразу відправляємо на дашборд
onMounted(() => {
  if (!auth.isLogged) return; // ⬅️ важливо: не редіректимо незалогіненого
  router.replace({ name: auth.isSuperadmin ? "sa-dashboard" : "dashboard" });
});

async function onSubmit(): Promise<void> {
  // Скидаємо попередню помилку
  error.value = "";

  // ✅ Анти-дубль: если уже идёт запрос — просто выходим
  if (loading.value) return;

  // Тільки тепер ставимо loading = true
  loading.value = true;

  try {
    await auth.login({ username: form.username, password: form.password });

    // ⬇️ Успіх: редірект за роллю
    router.replace({ name: auth.isSuperadmin ? "sa-dashboard" : "dashboard" });
  } catch {
    // ❌ Невдача: показуємо помилку
    error.value = "Невірний логін або пароль";
  } finally {
    loading.value = false;
  }
}
</script>
<style scoped>
/* Простий CSS-спінер без бібліотек */
.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid currentColor; /* колір успадковується від тексту кнопки */
  border-right-color: transparent; /* робимо “дірку”, щоб був ефект обертання */
  border-radius: 50%;
  animation: spin 0.7s linear infinite; /* безкінечне обертання */
  vertical-align: -2px; /* легке вирівнювання по тексту */
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.input {
  width: 100%;
  color: #383578;
  background: #fff; /* білий фон */
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  text-align: center;
  font-size: 16px;
  box-sizing: border-box;
}
input::placeholder {
  color: #383578; /* нейтральный серый */
  opacity: 1;
}
.login-btn {
  display: block; /* 👈 добавляем */
  width: 100%;
  padding: 10px 12px;
  background: #383578;
  color: white;
  /*border: 1px solid #ccc;*/
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  text-align: center;
  box-sizing: border-box;
  transition: all 0.3s ease;
}

.login-btn:hover:not(:disabled) {
  background: white; /* белый фон */
  color: #383578; /* зелёный текст */
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
