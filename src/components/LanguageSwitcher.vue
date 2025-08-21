<template>
  <!-- Group of language buttons -->
  <div
    class="inline-flex gap-2"
    role="group"
    :aria-label="t('common.language')"
  >
    <Button
      v-for="code in supportedLocales"
      :key="code"
      type="button"
      :variant="code === current ? 'solid' : 'outline'"
      size="sm"
      @click="change(code)"
    >
      {{ code.toUpperCase() }}
    </Button>
    <Button variant="outline" size="sm" @click="toggleTheme">
      {{ isDark ? "Light" : "Dark" }} Mode
    </Button>
  </div>
</template>

<script setup lang="ts">
/**
 * Language switcher using brand tokens
 * - Active: solid brand button
 * - Inactive: outline brand button
 */
import { useLocale } from "../composables/useLocale";
import { useTheme } from "../composables/useTheme";
import Button from "./ui/Button.vue";

const { isDark, toggleTheme } = useTheme();
const { t, current, supportedLocales, change } = useLocale();
</script>
