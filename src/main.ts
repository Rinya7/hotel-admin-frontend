import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";
import App from "./App.vue";

// 🔽 підключаєш глобальний CSS
import "./style.css";
import { i18n } from "./i18n";

const app = createApp(App);
app.use(createPinia());
app.use(router);
// Реєструємо i18n ДО маунта
app.use(i18n);
app.mount("#app");
