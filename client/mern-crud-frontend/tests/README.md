# Playwright Tests

Това са E2E тестове за MERN Inventory App, написани с Playwright.

## Структура на тестовете

- `example.spec.js` - Основни примерни тестове за навигация и страници
- `auth.spec.js` - Тестове за аутентификация (login, register, защитени маршрути)
- `employee.spec.js` - Тестове за управление на служители
- `profile.spec.js` - Тестове за профил страницата
- `crud.spec.js` - **Тестове за CRUD операции (Create, Read, Update, Delete)**
- `auth.setup.js` - Setup файл за автоматична аутентификация (опционално)
- `helpers/auth-helper.js` - Helper функции за аутентификация в тестовете

## Как да стартираш тестовете

### Предварителни изисквания

1. **Backend сървърът трябва да работи** на `http://localhost:8000`
2. **Frontend сървърът трябва да работи** на `http://localhost:5173` (или промени `baseURL` в `playwright.config.js`)

### Стартиране на тестове

```bash
# Стартиране на всички тестове
npm test

# Стартиране с UI режим (интерактивен)
npm run test:ui

# Стартиране с видим браузър
npm run test:headed

# Стартиране на конкретен тест файл
npx playwright test tests/auth.spec.js

# Стартиране на конкретен тест
npx playwright test tests/auth.spec.js -g "should redirect to login"
```

## Конфигурация

Конфигурацията се намира в `playwright.config.js` в root директорията на проекта.

### Важни настройки:

- `baseURL: 'http://localhost:5173'` - URL на frontend приложението
- `webServer` - Автоматично стартира frontend сървъра преди тестовете
- `testDir: './tests'` - Директория с тестовете

## CRUD Тестове

Тестовете в `crud.spec.js` покриват всички CRUD операции:

### Create (Създаване)
- ✅ Редирект към login при неаутентифициран достъп
- ✅ Показване на формата за добавяне (само за admin)
- ✅ Създаване на нов служител чрез формата
- ✅ Верификация, че служителят се появява в списъка

### Read (Четене)
- ✅ Показване на списък със служители при аутентификация
- ✅ Показване на детайли за служители в таблицата
- ✅ Проверка на структурата на таблицата

### Update (Редактиране)
- ✅ Редирект към login при неаутентифициран достъп
- ✅ Показване на формата за редактиране (само за admin)
- ✅ Зареждане на данни в формата
- ✅ Актуализиране на служител чрез формата
- ✅ Верификация на промените

### Delete (Изтриване)
- ✅ Показване на бутон за изтриване (само за admin)
- ✅ Изтриване на служител
- ✅ Верификация, че служителят е премахнат

**Helper функции:** `tests/helpers/auth-helper.js` предоставя функции за лесно управление на аутентификацията в тестовете.

## Тестване на защитени страници

За да тестваш защитени страници (които изискват аутентификация), имаш няколко опции:

### Опция 1: Ръчна аутентификация в теста

```javascript
test('should access employee page after login', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[type="email"]', 'test@example.com');
  await page.fill('input[type="password"]', 'test123');
  await page.click('button[type="submit"]');
  await page.waitForURL(/.*employee/);
  
  // Сега можеш да тестваш защитените страници
  await page.goto('/employee');
  // ... тестове
});
```

### Опция 2: Използване на authentication state (препоръчително)

1. Добави в `playwright.config.js`:

```javascript
projects: [
  {
    name: 'setup',
    testMatch: /.*\.setup\.js/,
  },
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'] },
    dependencies: ['setup'],
    use: {
      storageState: 'playwright/.auth/user.json',
    },
  },
]
```

2. Създай тестов потребител в базата данни
3. Актуализирай `auth.setup.js` с правилните credentials
4. Тестовете автоматично ще използват authentication state

## Създаване на тестове с codegen

Playwright има инструмент за автоматично генериране на тестове:

```bash
# Стартирай codegen и интерактивно създавай тестове
npx playwright codegen http://localhost:5173
```

## Отстраняване на проблеми

### Тестовете не могат да се свържат към сървъра

- Провери дали frontend сървърът работи на правилния порт
- Провери `baseURL` в `playwright.config.js`

### Тестовете за аутентификация не работят

- Увери се, че имаш тестов потребител в базата данни
- Провери дали backend сървърът работи
- Провери дали API endpoint-ите са правилни

### CRUD тестовете се пропускат (skip)

CRUD тестовете изискват тестов потребители в базата данни. За да ги активираш:

1. **Създай тестов потребители в базата данни:**
   - Admin потребител (с `role: 'admin'`)
   - Обикновен потребител (с `role: 'user'`)

2. **Настрой environment variables** (опционално):
   ```bash
   # В .env файл или environment
   TEST_ADMIN_EMAIL=admin@test.com
   TEST_ADMIN_PASSWORD=admin123
   TEST_USER_EMAIL=user@test.com
   TEST_USER_PASSWORD=user123
   ```

3. **Или редактирай `tests/helpers/auth-helper.js`** и промени credentials директно в кода.

**Важно:** CRUD тестовете автоматично се пропускат, ако не са налични credentials. Това предотвратява грешки при липса на тестова база данни.

### Скрийншоти при грешки

Playwright автоматично прави скрийншоти при неуспешни тестове в `test-results/` директорията.

## Полезни команди

```bash
# Покажи HTML репорт след тестовете
npx playwright show-report

# Стартирай тестовете в debug режим
npx playwright test --debug

# Стартирай само failed тестове
npx playwright test --last-failed
```

