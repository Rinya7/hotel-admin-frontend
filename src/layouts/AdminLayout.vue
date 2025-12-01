<!-- AdminLayout (для admin/editor) -->
<template>
  <header class="border-b-2 border-emerald-700 ">
    <div
      class="container  mx-auto flex items-center justify-between p-2 md:px-0"
    >
      <!-- Навігація -->
      <!-- Hamburger меню для мобильных (< md) -->
      <div class="relative md:hidden" ref="mobileMenuRef">
        <Button
          type="button"
          variant="outline"
          size="sm"
          @click="toggleMobileMenu"
          class="flex items-center gap-1"
        >
          <span>☰</span>
        </Button>

        <!-- Выпадающее меню для мобильных -->
        <Transition
          enter-active-class="transition ease-out duration-100"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition ease-in duration-75"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="isMobileMenuOpen"
            class="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 overflow-hidden min-w-[150px]"
            role="menu"
            aria-orientation="vertical"
          >
            <RouterLink to="/" v-slot="{ isExactActive }">
              <button
                type="button"
                :class="[
                  'w-full text-left px-4 py-2 text-sm transition-colors duration-150',
                  isExactActive
                    ? 'bg-brand text-white dark:bg-brand dark:text-white'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-brand hover:text-white dark:hover:bg-brand dark:hover:text-white',
                ]"
                role="menuitem"
                @click="closeMobileMenu"
              >
                Dashboard
              </button>
            </RouterLink>
            <RouterLink to="/rooms" v-slot="{ isActive }">
              <button
                type="button"
                :class="[
                  'w-full text-left px-4 py-2 text-sm transition-colors duration-150 border-t border-gray-200 dark:border-gray-700',
                  isActive
                    ? 'bg-brand text-white dark:bg-brand dark:text-white'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-brand hover:text-white dark:hover:bg-brand dark:hover:text-white',
                ]"
                role="menuitem"
                @click="closeMobileMenu"
              >
                Rooms
              </button>
            </RouterLink>
          </div>
        </Transition>
      </div>

      <!-- Обычная навигация для планшетов и больше (>= md) -->
      <nav class="hidden md:flex gap-[20px]">
        <RouterLink to="/" v-slot="{ isExactActive }">
          <span
            :class="[
              'font-semibold text-brand rounded-md px-3 py-1.5 dark:text-white',
              isExactActive
                ? 'border border-brand dark:border-white cursor-default'
                : 'dark:hover:border hover:bg-brand hover:text-white hover:border-brand dark:hover:border-white dark:hover:text-white',
            ]"
          >
            Dashboard
          </span>
        </RouterLink>
        <RouterLink to="/rooms" v-slot="{ isActive }">
          <span
            :class="[
              'font-semibold text-brand rounded-md px-3 py-1.5 dark:text-white',
              isActive
                ? 'border border-brand dark:border-white cursor-default'
                : 'dark:hover:border hover:bg-brand hover:text-white hover:border-brand dark:hover:border-white dark:hover:text-white',
            ]"
          >
            Rooms
          </span>
        </RouterLink>
      </nav>

      <!-- Профіль з випадаючим меню -->
      <div v-if="auth.isLogged" class="flex items-center relative" ref="profileDropdownRef">
        <!-- Кнопка з роллю -->
        <Button
          type="button"
          variant="solid"
          size="sm"
          @click="toggleProfileDropdown"
          class="flex items-center gap-1"
        >
          <span>{{ auth.role ?? "?" }}</span>
          <span class="text-xs" :class="{ 'rotate-180': isProfileDropdownOpen }">▼</span>
        </Button>

        <!-- Випадаюче меню -->
        <Transition
          enter-active-class="transition ease-out duration-100"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition ease-in duration-75"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="isProfileDropdownOpen"
            class="absolute top-full right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 overflow-hidden"
            role="menu"
            aria-orientation="vertical"
          >
            <RouterLink
              to="/audit"
              v-slot="{ isActive }"
            >
              <button
                type="button"
                :class="[
                  'w-full text-left px-4 py-2 text-sm transition-colors duration-150',
                  isActive
                    ? 'bg-brand text-white dark:bg-brand dark:text-white'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-brand hover:text-white dark:hover:bg-brand dark:hover:text-white',
                ]"
                role="menuitem"
                @click="closeProfileDropdown"
              >
                🕓 Audit
              </button>
            </RouterLink>
            <button
              type="button"
              class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-brand hover:text-white dark:hover:bg-brand dark:hover:text-white transition-colors duration-150 border-t border-gray-200 dark:border-gray-700"
              role="menuitem"
              @click="handleThemeToggle"
            >
              {{ isDark ? "🌙" : "☀️" }} {{ isDark ? "Dark" : "Light" }} 
            </button>
            <button
              type="button"
              class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-brand hover:text-white dark:hover:bg-brand dark:hover:text-white transition-colors duration-150 border-t border-gray-200 dark:border-gray-700"
              role="menuitem"
              @click="handleLogout"
            >
              Logout
            </button>
          </div>
        </Transition>
      </div>
    </div>
  </header>

  <main class="container mx-auto py-[16px] md:py-[32px] px-2 ">
    <div class="relative">
    <!-- Лого -->
    <div class="absolute left-1/3 -translate-x-1/2 md:left-1/2 md:-top-1/3 lg:-top-1/2">
        <img :src="logo" alt="Logo" class="h-[40px] md:h-[60px] lg:h-[100px]" />
      </div>
    <div class="flex justify-end">
      <LanguageSwitcher />
    </div></div>
    <RouterView />
  </main>
</template>

<script setup lang="ts">
/**
 * AdminLayout with profile dropdown menu
 * - Shows role in button
 * - Dropdown menu with Audit Center, Theme Toggle and Logout
 */
import { ref, onMounted, onUnmounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import { useTheme } from "@/composables/useTheme";
import LanguageSwitcher from "@/components/LanguageSwitcher.vue";
import logo from "@/assets/logo.png";
import Button from "@/components/ui/Button.vue";

const auth = useAuthStore();
const router = useRouter();
const { isDark, toggleTheme } = useTheme();

// Profile dropdown state
const isProfileDropdownOpen = ref(false);
const profileDropdownRef = ref<HTMLElement | null>(null);

// Mobile menu state
const isMobileMenuOpen = ref(false);
const mobileMenuRef = ref<HTMLElement | null>(null);

// Toggle profile dropdown menu
function toggleProfileDropdown(): void {
  isProfileDropdownOpen.value = !isProfileDropdownOpen.value;
}

// Close profile dropdown
function closeProfileDropdown(): void {
  isProfileDropdownOpen.value = false;
}

// Toggle mobile menu
function toggleMobileMenu(): void {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
}

// Close mobile menu
function closeMobileMenu(): void {
  isMobileMenuOpen.value = false;
}

// Handle theme toggle and close menu
function handleThemeToggle(): void {
  toggleTheme();
  // Не закрываем меню при переключении темы, чтобы пользователь мог быстро переключаться
}

// Handle logout and close menu
function handleLogout(): void {
  closeProfileDropdown();
  onLogout();
}

function onLogout(): void {
  auth.logout();
  router.replace({ name: "login" });
}

// Close dropdown when clicking outside
function handleClickOutside(event: MouseEvent): void {
  if (
    profileDropdownRef.value &&
    !profileDropdownRef.value.contains(event.target as Node)
  ) {
    isProfileDropdownOpen.value = false;
  }
  if (
    mobileMenuRef.value &&
    !mobileMenuRef.value.contains(event.target as Node)
  ) {
    isMobileMenuOpen.value = false;
  }
}

// Add/remove click outside listener
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
