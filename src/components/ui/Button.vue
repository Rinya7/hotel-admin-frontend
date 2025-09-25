<template>
  <!-- Accessible, theme-aware button -->
  <button
    :type="type"
    :disabled="disabled || loading"
    :aria-busy="loading ? 'true' : 'false'"
    :class="[
      'inline-flex items-center justify-center select-none rounded-md font-semibold transition-colors duration-200',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/50',
      widthClass,
      sizeClass,
      variantClass,
      disabled || loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer',
      $attrs.class || '',
    ]"
    v-bind="$attrs"
  >
    <!-- Leading icon slot -->
    <span v-if="$slots.leading && !loading" class="mr-2 inline-flex">
      <slot name="leading" />
    </span>

    <!-- Spinner while loading -->
    <span v-if="loading" class="mr-2 inline-flex">
      <Spinner size="sm" />
    </span>

    <!-- Button text -->
    <span><slot /></span>

    <!-- Trailing icon slot -->
    <span v-if="$slots.trailing && !loading" class="ml-2 inline-flex">
      <slot name="trailing" />
    </span>
  </button>
</template>

<script setup lang="ts">
/**
 * Reusable Button
 * Props:
 * - variant: 'solid' | 'outline' | 'ghost'
 * - size: 'sm' | 'md' | 'lg'
 * - loading: show spinner and disable interactions
 * - disabled: native disabled
 * - fullWidth: make button take full width
 * - type: 'button' | 'submit' | 'reset'
 *
 * Slots:
 * - default: button label
 * - leading: left icon/content
 * - trailing: right icon/content
 */
import { computed } from "vue";
import Spinner from "../Spinner.vue";

type Variant = "solid" | "outline" | "ghost" | "danger" | "secondary";
type Size = "sm" | "md" | "lg";
type BtnType = "button" | "submit" | "reset";

interface Props {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  type?: BtnType;
  noHover?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "solid",
  size: "md",
  loading: false,
  disabled: false,
  fullWidth: false,
  type: "button",
  noHover: false,
});

const sizeClass = computed(() => {
  switch (props.size) {
    case "sm":
      return "text-sm px-3 py-1.5";
    case "lg":
      return "text-base px-5 py-3";
    default:
      return "text-sm px-4 py-2";
  }
});

const widthClass = computed(() => (props.fullWidth ? "w-full" : "w-auto"));

const variantClass = computed(() => {
  const baseClasses = {
    outline:
      "border border-brand text-brand bg-white dark:bg-transparent dark:text-white dark:border-white",
    ghost: "bg-transparent text-brand dark:text-white",
    danger: "bg-red-600 text-white border border-red-600 dark:bg-red-700",
    secondary:
      "bg-gray-200 text-gray-800 border border-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-700",
    solid:
      "bg-brand text-white border border-brand dark:bg-brand dark:text-white dark:border-white",
  };

  const hoverClasses = {
    outline:
      "hover:bg-brand hover:text-white dark:hover:bg-brand dark:hover:text-white",
    ghost:
      "hover:bg-brand hover:text-white dark:hover:bg-white dark:hover:text-brand",
    danger:
      "hover:bg-white hover:text-red-600 dark:hover:bg-white dark:hover:text-red-700",
    secondary: "hover:bg-gray-300 dark:hover:bg-gray-600",
    solid:
      "hover:bg-white hover:text-brand dark:hover:bg-white dark:hover:text-brand",
  };

  const variant = props.variant || "solid";
  const base = baseClasses[variant];
  const hover = props.noHover ? "" : hoverClasses[variant];

  return `${base} ${hover}`.trim();
});
</script>
