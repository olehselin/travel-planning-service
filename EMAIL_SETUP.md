# Email Setup для TravelPlanner

Цей документ описує, як налаштувати реальну відправку email через Firebase Cloud Functions.

## 🚀 Швидкий старт

### 1. Налаштування Firebase Functions

```bash
# Встановіть Firebase CLI (якщо ще не встановлено)
npm install -g firebase-tools

# Увійдіть в Firebase
firebase login

# Виберіть ваш проект
firebase use --add

# Встановіть email конфігурацію
firebase functions:config:set email.user="your-email@gmail.com"
firebase functions:config:set email.password="your-app-password"

# Розгорніть functions
firebase deploy --only functions
```

### 2. Налаштування Gmail (рекомендовано)

1. **Увімкніть 2FA** в вашому Google акаунті
2. **Створіть App Password:**
   - Перейдіть до [Google Account Settings](https://myaccount.google.com/)
   - Security → 2-Step Verification → App passwords
   - Створіть новий пароль для "Mail"
   - Використайте цей пароль в конфігурації

### 3. Альтернативні email провайдери

#### SendGrid
```javascript
// В functions/index.js замініть transporter на:
const transporter = nodemailer.createTransporter({
  host: 'smtp.sendgrid.net',
  port: 587,
  secure: false,
  auth: {
    user: 'apikey',
    pass: functions.config().sendgrid.api_key
  }
});

// Налаштування:
firebase functions:config:set sendgrid.api_key="your-sendgrid-api-key"
```

#### AWS SES
```javascript
// В functions/index.js замініть transporter на:
const transporter = nodemailer.createTransporter({
  SES: {
    aws: {
      accessKeyId: functions.config().aws.access_key_id,
      secretAccessKey: functions.config().aws.secret_access_key,
      region: 'us-east-1'
    }
  }
});

// Налаштування:
firebase functions:config:set aws.access_key_id="your-access-key"
firebase functions:config:set aws.secret_access_key="your-secret-key"
```

## 📧 Структура email

### Invitation Email
- **Subject:** "You're invited to collaborate on [Trip Title]"
- **Content:** HTML template з кнопкою прийняття
- **Expiry:** 24 години

### Welcome Email
- **Subject:** "Welcome to [Trip Title]!"
- **Content:** HTML template з посиланням на подорож
- **Sent:** Після прийняття інвайту

## 🔧 Локальна розробка

```bash
# Встановіть Firebase Functions Emulator
firebase init emulators

# Запустіть emulator
firebase emulators:start --only functions

# Тестуйте локально
# Functions будуть доступні на http://localhost:5001
```

## 🚨 Troubleshooting

### Помилка "Authentication failed"
- Перевірте email та пароль
- Для Gmail використовуйте App Password, не звичайний пароль
- Переконайтеся, що 2FA увімкнено

### Помилка "Function not found"
- Переконайтеся, що functions розгорнуті: `firebase deploy --only functions`
- Перевірте назви functions в коді

### Email не приходить
- Перевірте спам папку
- Переконайтеся, що email адреса правильна
- Перевірте логи в Firebase Console

## 📊 Monitoring

Переглядайте логи в Firebase Console:
1. Перейдіть до [Firebase Console](https://console.firebase.google.com/)
2. Виберіть ваш проект
3. Functions → Logs

## 🔒 Безпека

- Ніколи не зберігайте email credentials в коді
- Використовуйте Firebase Functions Config для чутливих даних
- Обмежте доступ до functions через Firebase Security Rules

## 💰 Вартість

- **Firebase Functions:** $0.40 за мільйон викликів
- **Gmail:** Безкоштовно (до 500 email/день)
- **SendGrid:** Безкоштовно (до 100 email/день)
- **AWS SES:** $0.10 за 1000 email

## 📝 Приклад використання

```typescript
// В вашому React компоненті
import { emailService } from '@/services/emailService'

const sendInvite = async () => {
  const result = await emailService.sendInviteEmail({
    to: 'user@example.com',
    tripTitle: 'My Amazing Trip',
    inviteUrl: 'https://yourapp.com/accept-invite/token123',
    expiresAt: '2024-01-01T00:00:00Z'
  })
  
  if (result.success) {
    console.log('Email sent!')
  }
}
```
