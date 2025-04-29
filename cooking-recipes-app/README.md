# 🍳 Cooking Recipes App

Проект за управление на готварски рецепти, разработен като Single Page Application (SPA) с React и TypeScript.

## 📝 Описание

Това приложение позволява на потребителите да:
* Регистрират акаунт
* Влизат в системата
* Публикуват нови готварски рецепти
* Преглеждат списък с рецепти (с филтриране и сортиране)
* Преглеждат списък с потребители
* (Администраторите) Редактират и изтриват рецепти и потребители

Данните се съхраняват и управляват чрез локален `json-server` REST API.

## ✨ Технологии

* **Frontend:**
    * [React](https://reactjs.org/) (v18+)
    * [TypeScript](https://www.typescriptlang.org/)
    * [Vite](https://vitejs.dev/) (Build Tool)
    * [React Router](https://reactrouter.com/) (v6+) за рутиране
    * [Tailwind CSS](https://tailwindcss.com/) за стилизация
* **Backend (Mock):**
    * [json-server](https://github.com/typicode/json-server)

## 🚀 Стартиране на проекта

### Изисквания

* [Node.js](https://nodejs.org/) (препоръчително LTS версия)
* [npm](https://www.npmjs.com/) (обикновено идва с Node.js)

### Инсталация

1.  Клонирайте репозиторито (ако е в Git) или изтеглете файловете.
2.  Навигирайте до основната директория на проекта в терминал:
    ```bash
    cd cooking-recipes-app
    ```
3.  Инсталирайте зависимостите:
    ```bash
    npm install
    ```

### Стартиране

Трябва да стартирате два процеса в отделни терминали:

1.  **Стартиране на Mock API сървъра:**
    ```bash
    npm run server
    ```
    Това ще стартира `json-server` на `http://localhost:3001` (или на порта, указан в `package.json`).

2.  **Стартиране на React приложението (Development Mode):**
    ```bash
    npm run dev
    ```
    Това ще стартира Vite development сървъра, обикновено на `http://localhost:5173` (проверете изхода в терминала). Отворете този адрес в браузъра си.

## 🛠️ Налични скриптове

* `npm run dev`: Стартира приложението в режим на разработка с hot-reloading.
* `npm run build`: Компилира TypeScript и създава оптимизирана версия на приложението за production в папка `dist`.
* `npm run lint`: Изпълнява ESLint за проверка на кода.
* `npm run preview`: Стартира локален сървър, за да прегледате production build-а от `dist` папката.
* `npm run server`: Стартира `json-server` с `db.json`.

