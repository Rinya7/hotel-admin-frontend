<template>
  <div class="lang-switcher" role="group" :aria-label="t('common.language')">
    <!-- Прості кнопки з кодами мов. Без «стрибуна» на hover -->
    <button
      v-for="code in supportedLocales"
      :key="code"
      :class="['lang-btn', { active: code === current }]"
      type="button"
      @click="change(code)"
    >
      {{ code.toUpperCase() }}
    </button>
  </div>
</template>

<script setup lang="ts">
// Компонент-«перемикач мови» з повною типізацією.
// Ніяких any, лише типи з нашого i18n-плагіна.
import { useLocale } from "../composables/useLocale";

const { t, current, supportedLocales, change } = useLocale();

// current — це ref<SupportedLocale>, у шаблоні він використовується як звичайне значення
</script>

<style scoped>
.lang-switcher {
  display: inline-flex;
  gap: 8px;
}

/* Кнопки нерухомі при hover (ніяких зміщень/outline-стрибків) */
.lang-btn {
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid var(--border-color, #444);
  background: var(--btn-bg, #111);
  color: var(--btn-fg, #ddd);
  font-weight: 600;
  cursor: pointer;
  transition: filter 120ms ease-in-out, background 120ms ease-in-out,
    color 120ms ease-in-out;
  line-height: 1;
}

.lang-btn:hover {
  filter: brightness(1.1); /* легкий підсвіт, без руху */
}

.lang-btn.active {
  background: var(--accent-bg, #1b5e20); /* зелений фон активної */
  color: var(--accent-fg, #e9fbe7); /* контрастні літери */
  border-color: transparent;
}
</style>
