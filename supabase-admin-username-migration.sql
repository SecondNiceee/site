-- Добавление поля username в таблицу admin
ALTER TABLE admin ADD COLUMN IF NOT EXISTS username TEXT;

-- Установка значения по умолчанию для существующих записей
UPDATE admin SET username = 'admin' WHERE username IS NULL;

-- Установка NOT NULL после заполнения данных
ALTER TABLE admin ALTER COLUMN username SET NOT NULL;

-- Установка значения по умолчанию для новых записей
ALTER TABLE admin ALTER COLUMN username SET DEFAULT 'admin';

