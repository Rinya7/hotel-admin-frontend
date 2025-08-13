// src/router/index.ts
// Маршруты и защита. Без any, с ленивыми импортами и guard'ом.

import { createRouter, createWebHistory } from "vue-router";
// ВАЖНО: при включённом verbatimModuleSyntax типы импортируем через import type
import type { RouteRecordRaw } from "vue-router";

import { useAuthStore } from "../stores/auth";

// Ледаче завантаження компонентів
// (lazy loading) — для зменшення початкового розміру бандла
// Компоненти завантажуються тільки при переході на відповідний маршрут
const Login = () => import("../views/Login.vue");
const RoomsList = () => import("../views/RoomsList.vue");
const RoomStays = () => import("../views/RoomStays.vue");
const Dashboard = () => import("../views/Dashboard.vue");

// Опреділяємо маршрути
// Публічний маршрут логіна — доступний без токена
const routes: RouteRecordRaw[] = [
  { name: "login", path: "/login", component: Login, meta: { public: true } },

  // Інші маршрути — доступні тільки залогіненим
  { name: "dashboard", path: "/", component: Dashboard },
  { name: "rooms", path: "/rooms", component: RoomsList },
  {
    name: "room-stays",
    path: "/rooms/:roomNumber/stays",
    component: RoomStays,
    props: true, // передаємо roomNumber як props
  },
  // приклад для секції лише супер-адміну:
  // {
  //   name: "rooms-all",
  //   path: "/rooms-all",
  //   component: () => import("../views/RoomsAll.vue"),
  //   meta: { roles: ["superadmin"] as const },
  // },
  // Якщо маршрут не знайдено — redirect на логін
  // (можна також показати 404, але це не обов'язково)
  { path: "/:pathMatch(.*)*", redirect: "/login" },
];

// Створюємо роутер (HTML5 history)
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Глобальний захист: якщо маршрут не public та нема  токена — відправляємо на /login
router.beforeEach((to) => {
  const auth = useAuthStore();

  // 1) Публічні маршрути доступні всім
  if (to.meta?.public) {
    // якщо користувач уже залогінений — не тримаємо його на /login
    if (to.name === "login" && auth.isLogged) {
      return { name: "dashboard", replace: true };
    }
    return true;
  }

  // 2) Приватні маршрути — лише з токеном
  if (!auth.isLogged) {
    return { name: "login", replace: true };
  }

  // 3) Якщо маршрут вимагає конкретні ролі — перевіряємо
  const allowed = to.meta?.roles as
    | ReadonlyArray<"superadmin" | "admin" | "editor">
    | undefined;
  if (allowed && auth.role && !allowed.includes(auth.role)) {
    // немає прав — відправимо на дашборд (або 403)
    return { name: "dashboard", replace: true };
  }
  return true;
});

export default router;
