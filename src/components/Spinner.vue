<template>
  <!-- Accessible, flexible spinner using Tailwind utilities -->
  <span
    :class="[
      'inline-block rounded-full animate-spin border-r-transparent',
      sizeClass,
      thicknessClass,
      colorClass,
      $attrs.class || '',
    ]"
    role="progressbar"
    aria-label="Loading"
    aria-live="polite"
  />
</template>

<script setup lang="ts">
/**
 * Reusable spinner:
 * - size: 'sm' | 'md' | 'lg' (dimensions & border thickness)
 * - color: Tailwind class for border color (e.g., 'border-brand', 'border-gray-800')
 */
import { computed } from "vue";

interface Props {
  size?: "sm" | "md" | "lg";
  color?: string; // Tailwind class like 'border-brand'
}
const props = withDefaults(defineProps<Props>(), {
  size: "md",
  color: "border-brand",
});

const sizeClass = computed(() => {
  switch (props.size) {
    case "sm":
      return "h-4 w-4";
    case "lg":
      return "h-10 w-10";
    default:
      return "h-6 w-6";
  }
});

const thicknessClass = computed(() => {
  switch (props.size) {
    case "sm":
      return "border-2";
    case "lg":
      return "border-4";
    default:
      return "border-2";
  }
});

const colorClass = computed(() => props.color);
</script>
