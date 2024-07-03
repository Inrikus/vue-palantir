# Указываем базовый образ Node.js
FROM node:22

# Устанавливаем рабочую директорию в контейнере
WORKDIR /app

# Копируем package.json и yarn.lock (если он существует) в контейнер
COPY package*.json ./

# Устанавливаем зависимости
RUN yarn install

# Копируем остальные файлы и директории в контейнер
COPY . .

# Собираем Vue.js приложение
RUN yarn build

# Устанавливаем базовый образ для сервера, который будет обслуживать статические файлы
FROM nginx:alpine

# Копируем сборку Vue.js приложения в директорию, откуда Nginx будет обслуживать файлы
COPY --from=0 /app/dist /usr/share/nginx/html

# Копируем конфигурационный файл Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Создаем директорию для логов внутри контейнера
RUN mkdir -p /app/logs/nginx

# Открываем порт 80 для доступа к приложению
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]