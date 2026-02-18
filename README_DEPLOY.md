# Быстрая инструкция по деплою на reg.ru

## Подготовка

1. **Создайте файл `.env.local`** на сервере со следующими переменными:
   ```
   NEXT_PUBLIC_SUPABASE_URL=ваш_url_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=ваш_anon_key
   SUPABASE_SERVICE_ROLE_KEY=ваш_service_role_key
   NEXT_PUBLIC_SITE_URL=https://ваш-домен.ru
   NODE_ENV=production
   ```

2. **Выполните SQL миграции в Supabase:**
   - `supabase-schema.sql`
   - `supabase-admin-username-migration.sql`
   - `supabase-faq-services-schema.sql`

## Деплой на VPS reg.ru

### 1. Установка зависимостей на сервере

```bash
# Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# PM2
sudo npm install -g pm2
```

### 2. Загрузка проекта

```bash
# Клонируйте или загрузите файлы проекта
cd /home/username
git clone ваш-репозиторий leend
cd leend
```

### 3. Установка и сборка

```bash
npm install --production
npm run build
```

### 4. Настройка PM2

Отредактируйте `ecosystem.config.js`:
- Укажите правильный путь в `cwd`
- Укажите порт (по умолчанию 3000)

Запустите:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 5. Настройка Nginx (опционально)

Создайте `/etc/nginx/sites-available/leend`:
```nginx
server {
    listen 80;
    server_name ваш-домен.ru;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Активируйте:
```bash
sudo ln -s /etc/nginx/sites-available/leend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 6. SSL сертификат

```bash
sudo certbot --nginx -d ваш-домен.ru
```

## Обновление

```bash
cd /path/to/leend
git pull  # или загрузите новые файлы
npm install --production
npm run build
pm2 restart leend
```

## Полезные команды

```bash
pm2 status          # Статус приложения
pm2 logs leend      # Логи
pm2 restart leend   # Перезапуск
```

Подробная инструкция: см. `DEPLOY_REG_RU.md`


