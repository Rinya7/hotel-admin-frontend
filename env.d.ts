/// <reference types="vite/client" />

// Объясняем TypeScript'у, что импортировать *.vue — это ок.
// НИКАКИХ any: используем unknown.
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, unknown>;
  export default component;
}
