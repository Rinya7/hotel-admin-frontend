import { ref, onMounted } from "vue";

const isDark = ref(false);

/**
 * Theme switcher composable
 * - Stores state in localStorage
 * - Toggles "dark" class on <html>
 */
export function useTheme() {
  onMounted(() => {
    const saved = localStorage.getItem("theme");
    isDark.value = saved === "dark";
    document.documentElement.classList.toggle("dark", isDark.value);
  });

  function toggleTheme() {
    isDark.value = !isDark.value;
    document.documentElement.classList.toggle("dark", isDark.value);
    localStorage.setItem("theme", isDark.value ? "dark" : "light");
  }

  return { isDark, toggleTheme };
}
