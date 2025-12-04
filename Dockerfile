# ============================
# Stage 1 — Build Vite project
# ============================
# Коментар: Цей stage збирає Vue/Vite проект в статичні файли
# Використовуємо node:20-alpine для мінімального розміру образу
FROM node:20-alpine AS builder

WORKDIR /app

# Коментар: Спочатку копіюємо тільки package файли для кешування Docker layers
# Якщо залежності не змінилися, Docker використає кеш і не перевстановлюватиме npm пакети
COPY package.json package-lock.json ./

# Коментар: npm ci встановлює залежності точно згідно з package-lock.json
# Швидше і надійніше ніж npm install для production збірки
RUN npm ci

# Коментар: Тепер копіюємо весь код проекту (після встановлення залежностей)
# Це оптимізує кешування: якщо код змінився, але package.json ні - залежності не перевстановлюються
COPY . .

# Коментар: Збираємо проект через Vite (npm run build)
# Результат буде в папці /app/dist (статичні HTML/CSS/JS файли)
RUN npm run build

# ============================
# Stage 2 — Serve with Nginx
# ============================
# Коментар: Другий stage створює легкий production образ з Nginx
# Nginx - найефективніший веб-сервер для статичних файлів
FROM nginx:stable-alpine

WORKDIR /usr/share/nginx/html

# очищаємо HTML папку
# Коментар: Видаляємо дефолтні файли Nginx (index.html, 50x.html тощо)
# Щоб не було конфліктів з нашими файлами
RUN rm -rf ./*

# копіюємо результат білда
# Коментар: Копіюємо зібрані статичні файли з builder stage
# Всі HTML, CSS, JS файли з /app/dist тепер в /usr/share/nginx/html
COPY --from=builder /app/dist ./

# копіюємо свій nginx конфіг
# Коментар: Замінюємо дефолтний конфіг Nginx на наш власний
# В nginx.conf можна налаштувати роутинг для SPA (history mode), gzip, кешування тощо
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Коментар: Відкриваємо порт 80 для HTTP трафіку
EXPOSE 80

# Коментар: Запускаємо Nginx у foreground режимі (daemon off)
# Docker потребує процес у foreground, інакше контейнер завершиться
CMD ["nginx", "-g", "daemon off;"]

