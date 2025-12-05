 


🔵 Локальна розробка
    cd admin
    npm install
    npm run dev
    Працює на:
    http://localhost:5173
🔵 Завантаження змін на сервер
    git add .
    git commit -m "опис змін"
    git push

🔵 Деплой на сервері
 Увійти на сервер
    ssh root@46.224.81.114
    cd /opt/hotel/admin
    git pull
    docker compose build
    docker compose up -d
    docker logs -f hotel-admin



  