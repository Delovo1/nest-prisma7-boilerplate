# Nest Marketplace API

REST API маркетплейса на **NestJS 11**, **Prisma 7** и **PostgreSQL**: регистрация и авторизация по JWT, роли пользователей, каталог товаров с категориями, корзина и заказы.

> 🚧 Проект в разработке. Модуль заказов находится в процессе реализации (см. [Статус](#статус)).

## Стек

- **Backend:** NestJS 11, TypeScript
- **БД:** PostgreSQL, Prisma ORM 7 (driver adapter `@prisma/adapter-pg`)
- **Авторизация:** JWT (`@nestjs/jwt`), хеширование паролей через bcrypt
- **Валидация:** class-validator, class-transformer
- **Документация:** Swagger (OpenAPI)
- **Инструменты:** ESLint, Prettier, Jest

## Возможности

- Регистрация и вход, JWT с настраиваемым временем жизни
- Ролевая модель доступа: `BUYER`, `SELLER`, `ADMIN` (Guards + декоратор `@Roles`)
- Товары: создание, редактирование и удаление только владельцем (продавцом); привязка к нескольким категориям (many-to-many)
- Категории: управление доступно только администратору
- Корзина: добавление товаров с накоплением количества (`upsert`), просмотр, удаление позиций; корзина создаётся автоматически при регистрации
- Глобальная валидация входных данных (`whitelist`, `forbidNonWhitelisted`)
- Swagger-документация с поддержкой Bearer-авторизации

## Структура проекта

```
backend/
├── prisma/
│   ├── schema.prisma      # схема БД
│   └── migrations/        # миграции
├── prisma7.config.ts      # конфигурация Prisma 7
└── src/
    ├── auth/              # регистрация, логин, guards, роли
    ├── users/             # управление пользователями (ADMIN)
    ├── product/           # товары
    ├── category/          # категории
    ├── basket/            # корзина
    ├── order/             # заказы (в разработке)
    └── prisma/            # PrismaService, подключение к БД
```

## Модель данных

`User` (роль, логин, пароль) → `Basket` (1:1) → `BasketProduct` (позиции корзины)
`User` → `Product` (продавец) ↔ `Category` (через `ProductCategory`)
`User` → `Order` (статус `PENDING` / `PAID` / `CANCELLED`, адрес доставки) → `OrderItem` (цена и название товара фиксируются на момент заказа)

## Запуск

### Требования

- Node.js 20+
- PostgreSQL

### Установка

```bash
cd backend
npm install
```

Создайте файл `.env` в папке `backend`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/marketplace"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="1d"
```

Примените миграции и сгенерируйте Prisma Client:

```bash
npx prisma migrate deploy --config prisma7.config.ts
npx prisma generate --config prisma7.config.ts
```

Запустите сервер:

```bash
npm run start:dev
```

API доступен на `http://localhost:3000`, Swagger — на `http://localhost:3000/api`.

### Назначение ролей

Все новые пользователи регистрируются с ролью `BUYER`. Роли `SELLER` и `ADMIN` пока назначаются вручную в БД (например, через `npx prisma studio --config prisma7.config.ts`).

## Эндпоинты

| Метод | Путь | Доступ | Описание |
|-------|------|--------|----------|
| POST | `/auth/register` | все | Регистрация |
| POST | `/auth/login` | все | Вход, получение JWT |
| GET | `/auth/profile` | авторизован | Данные из токена |
| GET | `/product` | все | Список товаров |
| GET | `/product/:id` | все | Товар по ID |
| POST | `/product` | SELLER, ADMIN | Создать товар |
| PATCH | `/product/:id` | SELLER, ADMIN (владелец) | Изменить товар |
| DELETE | `/product/:id` | SELLER, ADMIN (владелец) | Удалить товар |
| GET | `/category`, `/category/:id` | авторизован | Категории |
| POST, PATCH, DELETE | `/category` | ADMIN | Управление категориями |
| POST | `/basket/products` | авторизован | Добавить товар в корзину |
| GET | `/basket` | авторизован | Содержимое корзины |
| GET | `/basket/:id` | авторизован | Позиция корзины |
| DELETE | `/basket/:id` | авторизован | Удалить позицию |
| GET, PATCH, DELETE | `/users`, `/users/:id` | ADMIN | Управление пользователями |

Полное описание запросов и ответов — в Swagger.

## Статус

- [x] Аутентификация и роли
- [x] Товары и категории
- [x] Корзина
- [ ] Заказы (создание заказа из корзины в транзакции, статусы, список заказов)
- [ ] Тесты
- [ ] Docker Compose

## Планы

- Оформление заказа в рамках транзакции Prisma (`$transaction`)
- Пагинация и фильтрация товаров
- Unit- и e2e-тесты
- Docker Compose для БД и приложения
