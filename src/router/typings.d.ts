// src/router/typings.d.ts
import "vue-router";

declare module "vue-router" {
  interface RouteMeta {
    // Якщо true — маршрут публічний, не вимагає токена автентифікації
    public?: boolean;
    // Якщо вказані ролі — користувач повинен мати одну з них
    roles?: ReadonlyArray<"superadmin" | "admin" | "editor">;
  }
}
