# Инструкция по деплою на reg.ru

## Подготовка проекта

### 1. Настройка переменных окружения

1. Скопируйте файл `.env.example` в `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Заполните переменные окружения в `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL` - URL вашего проекта Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Anon ключ из Supabase
   - `SUPABASE_SERVICE_ROLE_KEY` - Service Role ключ из Supabase
   - `NEXT_PUBLIC_SITE_URL` - URL вашего сайта (например, https://your-domain.ru)

### 2. Проверка сборки проекта

Перед деплоем убедитесь, что проект собирается без ошибок:

```bash
npm install
npm run build
```

Если сборка успешна, можно переходить к деплою.

## Варианты деплоя на reg.ru

### Вариант 1: VPS (рекомендуется)

Reg.ru предоставляет VPS серверы, на которых можно развернуть Next.js приложение.

#### Шаг 1: Подключение к серверу

1. Получите доступ к VPS через SSH
2. Установите необходимые инструменты:

```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка Node.js (версия 20.x)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Установка PM2 для управления процессом
sudo npm install -g pm2

# Установка Nginx (опционально, для проксирования)
sudo apt install nginx -y
```

#### Шаг 2: Загрузка проекта на сервер

1. Клонируйте репозиторий или загрузите файлы на сервер:

```bash
# Если используете Git
git clone your-repository-url
cd leend

# Или загрузите файлы через SFTP/FTP
```

2. Установите зависимости:

```bash
npm install --production
```

3. Создайте файл `.env.local` на сервере с переменными окружения:

```bash
nano .env.local
```

Вставьте переменные окружения (см. `.env.example`)

#### Шаг 3: Сборка проекта

```bash
npm run build
```

#### Шаг 4: Настройка PM2

1. Отредактируйте `ecosystem.config.js`, указав правильный путь к проекту:

```javascript
cwd: '/home/username/leend', // замените на ваш путь
```

2. Запустите приложение через PM2:

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### Шаг 5: Настройка Nginx (опционально)

Создайте конфигурацию Nginx:

```bash
sudo nano /etc/nginx/sites-available/leend
```

Вставьте следующую конфигурацию:

```nginx
server {
    listen 80;
    server_name your-domain.ru www.your-domain.ru;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Активируйте конфигурацию:

```bash
sudo ln -s /etc/nginx/sites-available/leend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Шаг 6: Настройка SSL (HTTPS)

Reg.ru предоставляет бесплатные SSL сертификаты. Настройте через панель управления или используйте Let's Encrypt:

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.ru -d www.your-domain.ru
```

### Вариант 2: Облачный хостинг reg.ru

Если у вас облачный хостинг с поддержкой Node.js:

1. Загрузите файлы проекта через FTP/SFTP
2. Установите зависимости через SSH:
   ```bash
   npm install --production
   ```
3. Создайте `.env.local` с переменными окружения
4. Соберите проект:
   ```bash
   npm run build
   ```
5. Запустите приложение:
   ```bash
   npm start
   ```

## Настройка базы данных Supabase

1. Убедитесь, что все SQL миграции выполнены в Supabase:
   - `supabase-schema.sql` - основная схема
   - `supabase-admin-username-migration.sql` - миграция для username
   - `supabase-faq-services-schema.sql` - схема для FAQ и Services

2. Выполните миграции в SQL Editor Supabase

3. Настройте Supabase Storage для загрузки файлов:
   - Создайте bucket `uploads` в Supabase Storage
   - Настройте публичный доступ к bucket

## Проверка работы

1. Откройте сайт в браузере
2. Проверьте, что все страницы загружаются
3. Проверьте работу админ-панели: `/admin`
4. Проверьте загрузку файлов

## Полезные команды PM2

```bash
# Просмотр статуса
pm2 status

# Просмотр логов
pm2 logs leend

# Перезапуск приложения
pm2 restart leend

# Остановка приложения
pm2 stop leend

# Удаление из PM2
pm2 delete leend
```

## Обновление проекта

1. Подключитесь к серверу через SSH
2. Перейдите в директорию проекта
3. Обновите код (через Git или загрузите новые файлы)
4. Установите зависимости (если нужно):
   ```bash
   npm install --production
   ```
5. Пересоберите проект:
   ```bash
   npm run build
   ```
6. Перезапустите приложение:
   ```bash
   pm2 restart leend
   ```

## Решение проблем

### Приложение не запускается

1. Проверьте логи:
   ```bash
   pm2 logs leend
   ```

2. Проверьте переменные окружения:
   ```bash
   cat .env.local
   ```

3. Проверьте, что порт 3000 свободен:
   ```bash
   sudo netstat -tulpn | grep 3000
   ```

### Ошибки при сборке

1. Убедитесь, что установлена правильная версия Node.js (20.x):
   ```bash
   node -v
   ```

2. Очистите кэш и переустановите зависимости:
   ```bash
   rm -rf node_modules .next
   npm install
   npm run build
   ```

### Проблемы с базой данных

1. Проверьте переменные окружения Supabase
2. Убедитесь, что все миграции выполнены
3. Проверьте доступность Supabase API

## Контакты поддержки

При возникновении проблем:
- Документация reg.ru: https://www.reg.ru/support/
- Техническая поддержка: через личный кабинет reg.ru


