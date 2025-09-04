<template>
  <div class="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
    <LanguageSwitcher />

    <img
      :src="logo"
      alt="HoteLotse Logo"
      class="w-full max-w-[320px] block mx-auto"
    />

    <h1 class="text-center text-xl font-semibold text-brand">
      {{ $t("login.title") }}
    </h1>

    <!-- Form -->
    <form
      @submit.prevent="onSubmit"
      class="flex flex-col gap-3 w-full max-w-[320px]"
    >
      <input
        v-model="form.username"
        :placeholder="$t('login.username')"
        :disabled="loading"
        aria-label="Username"
        required
        class="w-full text-brand placeholder:text-brand bg-white px-3 py-2 border border-gray-300 rounded-md text-base text-center disabled:opacity-70 disabled:cursor-not-allowed"
      />

      <input
        v-model="form.password"
        type="password"
        :placeholder="$t('login.password')"
        :disabled="loading"
        aria-label="Password"
        required
        class="w-full text-brand placeholder:text-brand bg-white px-3 py-2 border border-gray-300 rounded-md text-base text-center disabled:opacity-70 disabled:cursor-not-allowed"
      />

      <Button
        type="submit"
        :loading="loading"
        :disabled="loading"
        class="mt-2"
        fullWidth
      >
        {{ $t("login.submit") }}
      </Button>
    </form>

    <p v-if="error" class="text-red-600 mt-2">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
/**
 * Login form with i18n + Tailwind + brand tokens
 * - Uses <Spinner /> for consistent loading visuals
 * - Brand color comes from Tailwind theme (bg-brand, text-brand, border-brand)
 */
import { reactive, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import logo from "@/assets/logo.png";
import LanguageSwitcher from "@/components/LanguageSwitcher.vue";
import { useI18n } from "vue-i18n";
import type { MessageSchema, SupportedLocale } from "@/i18n";
import Button from "@/components/ui/Button.vue";

const { t } = useI18n<{ message: MessageSchema }, SupportedLocale>();
const auth = useAuthStore();
const router = useRouter();

const form = reactive({ username: "", password: "" });
const error = ref<string>("");
const loading = ref<boolean>(false);

// Redirect immediately if already authenticated
onMounted(() => {
  if (!auth.isLogged) return;
  router.replace({ name: auth.isSuperadmin ? "sa-dashboard" : "dashboard" });
});

async function onSubmit(): Promise<void> {
  error.value = "";
  if (loading.value) return; // guard against double submit
  loading.value = true;

  try {
    await auth.login({ username: form.username, password: form.password });
    router.replace({ name: auth.isSuperadmin ? "sa-dashboard" : "dashboard" });
  } catch {
    error.value = t("validation.invalidLogin");
  } finally {
    loading.value = false;
  }
}
</script>
