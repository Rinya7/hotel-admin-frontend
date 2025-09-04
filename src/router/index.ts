// src/router/index.ts
// Роутер з захистом маршрутів за ролями

import { createRouter, createWebHistory } from "vue-router";
import type {
  RouteRecordRaw,
  //  NavigationGuardNext,
  //  RouteLocationNormalized,
} from "vue-router";

import { useAuthStore } from "@/stores/auth";

// Ледаче завантаження компонентів (lazy loading)
// для зменшення початкового розміру бандла
// Компоненти завантажуються тільки при переході на відповідний маршрут

const AdminLayout = () => import("@/layouts/AdminLayout.vue");
const SuperAdminLayout = () => import("@/layouts/SuperAdminLayout.vue");

// Публічні сторінки
const Login = () => import("@/views/Login.vue");

// Admin / Editor сторінки
const Dashboard = () => import("@/views/Dashboard.vue");
const RoomsList = () => import("@/views/RoomsList.vue");
const RoomStays = () => import("@/views/RoomStays.vue");

// Superadmin сторінки (простенькі плейсхолдери нижче)
const SaDashboard = () => import("@/views/sa/SaDashboard.vue");
const SaHotels = () => import("@/views/sa/SaHotelsList.vue");
const SaHotelDetail = () => import("@/views/sa/SaHotelDetail.vue");

// Опреділяємо маршрути
// Публічний маршрут логіна — доступний без токена
const routes: RouteRecordRaw[] = [
  // ПУБЛІЧНИЙ логін
  { name: "login", path: "/login", component: Login, meta: { public: true } },

  // ГІЛКА ДЛЯ ADMIN/EDITOR
  {
    path: "/",
    component: AdminLayout,
    meta: { roles: ["admin", "editor"] as const },
    children: [
      { name: "dashboard", path: "", component: Dashboard },
      { name: "rooms", path: "rooms", component: RoomsList },
      {
        name: "room-stays",
        path: "rooms/:roomNumber/stays",
        component: RoomStays,
        props: true,
      },
    ],
  },

  // ГІЛКА ДЛЯ SUPERADMIN
  {
    path: "/sa",
    component: SuperAdminLayout,
    meta: { roles: ["superadmin"] as const },
    children: [
      { name: "sa-dashboard", path: "", component: SaDashboard },
      { name: "sa-hotels", path: "hotels", component: SaHotels },

      {
        name: "sa-hotel-detail",
        path: "hotels/:id",
        component: SaHotelDetail,
        props: true,
      },
    ],
  },

  // Фолбек 404 (опціонально)
  { path: "/:pathMatch(.*)*", redirect: { name: "login" } },
];

// Створюємо роутер (HTML5 history)
const router = createRouter({
  history: createWebHistory(),
  routes,
});

/**
 * Глобальний гард:
 * - якщо маршрут public — пускаємо; якщо вже залогінений — редіректимо в «домашню» роль
 * - якщо приватний і немає токена — на /login
 * - якщо ролі не збігаються — редірект в «домашню» роль
 */
router.beforeEach((to) => {
  const auth = useAuthStore();

  // 1) Публічні сторінки
  if (to.meta?.public) {
    // Якщо користувач уже залогінений — перекинемо у «свою» адмінку
    if (auth.isLogged) {
      return auth.isSuperadmin
        ? { name: "sa-dashboard", replace: true }
        : { name: "dashboard", replace: true };
    }
    return true;
  }

  // 2) Приватні сторінки — потрібен токен
  if (!auth.isLogged) {
    return { name: "login", replace: true };
  }

  // 3) Перевірка ролей маршруту
  const allowed = to.meta?.roles as
    | ReadonlyArray<"superadmin" | "admin" | "editor">
    | undefined;
  if (allowed && auth.role && !allowed.includes(auth.role)) {
    // Якщо роль не підходить — відправимо у його «домашній» дашборд
    return auth.isSuperadmin
      ? { name: "sa-dashboard", replace: true }
      : { name: "dashboard", replace: true };
  }
  return true;
});

export default router;
