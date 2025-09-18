# Розгортання TravelPlanner з Email функціональністю

## 🚀 Кроки розгортання

### 1. Підготовка Firebase проекту

```bash
# Увійдіть в Firebase
firebase login

# Виберіть ваш проект
firebase use --add

# Переконайтеся, що проект налаштований
firebase projects:list
```

### 2. Налаштування Email

#### Варіант A: Gmail (рекомендовано для тестування)

```bash
# Налаштуйте email конфігурацію
firebase functions:config:set email.user="your-email@gmail.com"
firebase functions:config:set email.password="your-app-password"

# Перевірте конфігурацію
firebase functions:config:get
```

**Для Gmail:**
1. Увімкніть 2FA в Google Account
2. Створіть App Password: Security → 2-Step Verification → App passwords
3. Використайте App Password замість звичайного паролю

#### Варіант B: SendGrid (для продакшену)

```bash
# Налаштуйте SendGrid
firebase functions:config:set sendgrid.api_key="your-sendgrid-api-key"

# Оновіть functions/index.js для використання SendGrid
```

### 3. Розгортання Functions

```bash
# Розгорніть Cloud Functions
firebase deploy --only functions

# Перевірте статус
firebase functions:log
```

### 4. Розгортання Frontend

```bash
# Зберіть проект
npm run build

# Розгорніть на Firebase Hosting
firebase deploy --only hosting
```

### 5. Перевірка

1. **Відкрийте ваш сайт** - перейдіть на URL з Firebase Hosting
2. **Створіть подорож** - увійдіть і створіть тестову подорож
3. **Надішліть інвайт** - перейдіть до "Manage Access" і надішліть запрошення
4. **Перевірте email** - перевірте пошту (включаючи спам)

## 🔧 Локальна розробка

```bash
# Запустіть Firebase Emulators
firebase emulators:start

# В іншому терміналі запустіть dev сервер
npm run dev
```

## 📊 Monitoring

### Firebase Console
1. Перейдіть до [Firebase Console](https://console.firebase.google.com/)
2. Виберіть ваш проект
3. **Functions** → переглядайте логи та метрики
4. **Hosting** → переглядайте статистику

### Логи Functions
```bash
# Переглядайте логи в реальному часі
firebase functions:log --follow

# Фільтруйте по функції
firebase functions:log --only sendInviteEmail
```

## 🚨 Troubleshooting

### Functions не розгортаються
```bash
# Перевірте конфігурацію
firebase functions:config:get

# Перевірте логи
firebase functions:log

# Спробуйте перерозгорнути
firebase deploy --only functions --force
```

### Email не відправляються
1. **Перевірте конфігурацію email**
2. **Перевірте логи Functions** - шукайте помилки аутентифікації
3. **Перевірте спам папку**
4. **Переконайтеся, що email адреса правильна**

### Frontend не працює
1. **Перевірте збірку** - `npm run build`
2. **Перевірте Firebase конфігурацію** в `src/lib/firebase.ts`
3. **Перевірте консоль браузера** на помилки

## 🔒 Безпека

### Environment Variables
- Ніколи не комітьте email credentials
- Використовуйте Firebase Functions Config
- Обмежте доступ до Functions

### Firebase Security Rules
```javascript
// В Firebase Console → Firestore → Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Ваші правила безпеки
  }
}
```

## 💰 Вартість

### Firebase Functions
- **Перші 2M викликів/місяць** - безкоштовно
- **Понад 2M** - $0.40 за мільйон

### Firebase Hosting
- **Перші 10GB/місяць** - безкоштовно
- **Понад 10GB** - $0.026 за GB

### Email провайдери
- **Gmail** - безкоштовно (до 500 email/день)
- **SendGrid** - безкоштовно (до 100 email/день)
- **AWS SES** - $0.10 за 1000 email

## 📝 Приклад повного розгортання

```bash
# 1. Підготовка
firebase login
firebase use --add your-project-id

# 2. Налаштування email
firebase functions:config:set email.user="your-email@gmail.com"
firebase functions:config:set email.password="your-app-password"

# 3. Розгортання
firebase deploy --only functions
npm run build
firebase deploy --only hosting

# 4. Перевірка
firebase functions:log --follow
```

## 🎯 Наступні кроки

1. **Налаштуйте домен** - додайте custom domain в Firebase Hosting
2. **Налаштуйте SSL** - Firebase автоматично надає SSL
3. **Налаштуйте CDN** - Firebase Hosting включає CDN
4. **Додайте аналітику** - інтегруйте Google Analytics
5. **Налаштуйте monitoring** - додайте Firebase Performance Monitoring
