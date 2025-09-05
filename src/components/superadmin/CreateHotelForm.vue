<template>
  <!-- Форма створення готелю (адміна-власника). -->
  <!-- Розбита на зрозумілі поля. Обов'язкові помічені *. -->
  <form class="space-y-3" @submit.prevent="onSubmit">
    <!-- Базові обов’язкові поля -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div>
        <label class="block text-sm text-gray-600 mb-1"
          >Логін (username)*</label
        >
        <input
          v-model.trim="form.username"
          class="input input-bordered w-full"
          required
          autocomplete="off"
        />
      </div>

      <div>
        <label class="block text-sm text-gray-600 mb-1">Назва готелю*</label>
        <input
          v-model.trim="form.hotel_name"
          class="input input-bordered w-full"
          required
          autocomplete="off"
        />
      </div>

      <div class="md:col-span-2">
        <label class="block text-sm text-gray-600 mb-1">Адреса*</label>
        <input
          v-model.trim="form.address"
          class="input input-bordered w-full"
          required
          autocomplete="off"
        />
      </div>

      <!-- Паролі -->
      <div>
        <label class="block text-sm text-gray-600 mb-1">Пароль*</label>
        <input
          v-model="form.password"
          type="password"
          class="input input-bordered w-full"
          required
          minlength="6"
          autocomplete="new-password"
        />
      </div>

      <div>
        <label class="block text-sm text-gray-600 mb-1"
          >Підтвердження пароля*</label
        >
        <input
          v-model="form.confirmPassword"
          type="password"
          class="input input-bordered w-full"
          required
          minlength="6"
          autocomplete="new-password"
        />
      </div>

      <!-- Необов'язкові контактні поля -->
      <div>
        <label class="block text-sm text-gray-600 mb-1">Імʼя власника</label>
        <input
          v-model.trim="form.full_name"
          class="input input-bordered w-full"
        />
      </div>

      <div>
        <label class="block text-sm text-gray-600 mb-1">Email</label>
        <input
          v-model.trim="form.email"
          type="email"
          class="input input-bordered w-full"
        />
      </div>

      <div>
        <label class="block text-sm text-gray-600 mb-1">Телефон</label>
        <input v-model.trim="form.phone" class="input input-bordered w-full" />
      </div>

      <!-- Опційні політики заселення/виїзду (якщо порожньо — бек застосує дефолт) -->
      <div>
        <label class="block text-sm text-gray-600 mb-1">Check-in (0..23)</label>
        <input
          v-model.number="form.checkInHour"
          type="number"
          min="0"
          max="23"
          class="input input-bordered w-full"
          placeholder="залиш порожнім для дефолту"
        />
      </div>

      <div>
        <label class="block text-sm text-gray-600 mb-1"
          >Check-out (0..23)</label
        >
        <input
          v-model.number="form.checkOutHour"
          type="number"
          min="0"
          max="23"
          class="input input-bordered w-full"
          placeholder="залиш порожнім для дефолту"
        />
      </div>
    </div>

    <!-- Повідомлення про помилку (з фронт-валідації чи з бекенду) -->
    <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
    <p v-if="success" class="text-sm text-emerald-700">{{ success }}</p>

    <!-- Кнопка сабміту з індикатором стану -->
    <div class="pt-2">
      <button :disabled="submitting" class="btn btn-primary">
        {{ submitting ? "Створюємо..." : "Створити готель" }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
/**
 * Логіка форми:
 *  - тримаємо стан у reactive-об’єкті строго типізованим `CreateAdminRequest`;
 *  - робимо мінімальну фронт-валідацію (паролі, межі годин);
 *  - викликаємо store.createHotelAdmin(payload);
 *  - після успіху: очищаємо форму, показуємо повідомлення, рефреш уже зробить стор.
 */
import { reactive, ref } from "vue";
import { useSuperHotelsStore } from "@/stores/superadmin";
import type { CreateAdminRequest } from "@/types/dto";

// Підключаємо стора супер-адміна
const store = useSuperHotelsStore();

// Стан форми: суворий тип DTO, без any
const form = reactive<CreateAdminRequest>({
  username: "",
  password: "",
  confirmPassword: "",
  hotel_name: "",
  address: "",
  // нижче — опційні поля (можуть бути пусті)
  full_name: "",
  phone: "",
  email: "",
  // якщо залишити undefined — бек застосує дефолт (entity default 14/10)
  checkInHour: undefined,
  checkOutHour: undefined,
});

// Локальні прапорці стану
const submitting = ref(false);
const error = ref<string | null>(null);
const success = ref<string | null>(null);

// Допоміжна перевірка для годин
function isHour(v: unknown): v is number {
  return Number.isInteger(v) && (v as number) >= 0 && (v as number) <= 23;
}

async function onSubmit(): Promise<void> {
  error.value = null;
  success.value = null;

  // 1) Мінімальна фронт-валідація
  if (form.password !== form.confirmPassword) {
    error.value = "Паролі не збігаються";
    return;
  }
  if (
    form.checkInHour !== undefined &&
    form.checkInHour !== null &&
    !isHour(form.checkInHour)
  ) {
    error.value =
      "checkInHour має бути цілим числом у діапазоні 0..23 або порожнім";
    return;
  }
  if (
    form.checkOutHour !== undefined &&
    form.checkOutHour !== null &&
    !isHour(form.checkOutHour)
  ) {
    error.value =
      "checkOutHour має бути цілим числом у діапазоні 0..23 або порожнім";
    return;
  }

  // 2) Сабмітимо у стору
  try {
    submitting.value = true;
    await store.createHotelAdmin(form);

    // 3) Очищаємо форму після успішного створення
    form.username = "";
    form.password = "";
    form.confirmPassword = "";
    form.hotel_name = "";
    form.address = "";
    form.full_name = "";
    form.phone = "";
    form.email = "";
    form.checkInHour = undefined;
    form.checkOutHour = undefined;

    success.value = "Готель успішно створено";
  } catch (e) {
    // Показуємо людині зрозуміле повідомлення (бек може повернути 400/403)
    error.value = e instanceof Error ? e.message : "Не вдалося створити готель";
  } finally {
    submitting.value = false;
  }
}
</script>
