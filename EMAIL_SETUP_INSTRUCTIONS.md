# 🚨 Налаштування Email для TravelPlanner

## Проблема
Реальні запрошення на подорож не працюють через неповну конфігурацію email сервісу.

## ✅ Швидке рішення

### 1. Налаштуйте Gmail App Password

1. **Увімкніть 2FA** в вашому Google акаунті:
   - Перейдіть до [Google Account Settings](https://myaccount.google.com/)
   - Security → 2-Step Verification → Turn on

2. **Створіть App Password:**
   - Security → 2-Step Verification → App passwords
   - Виберіть "Mail" як додаток
   - Скопіюйте згенерований пароль (16 символів)

### 2. Налаштуйте Firebase Functions

```bash
# Встановіть email конфігурацію
firebase functions:config:set email.user="ваш-email@gmail.com"
firebase functions:config:set email.password="ваш-16-символьний-пароль"

# Розгорніть functions
firebase deploy --only functions
```

### 3. Перевірте конфігурацію

```bash
# Перевірте, що конфігурація встановлена
firebase functions:config:get
```

Повинно показати:
```json
{
  "email": {
    "user": "ваш-email@gmail.com",
    "password": "ваш-16-символьний-пароль"
  }
}
```

## 🔧 Альтернативні рішення

### SendGrid (рекомендовано для продакшену)

1. Зареєструйтеся на [SendGrid](https://sendgrid.com/)
2. Отримайте API ключ
3. Оновіть `functions/index.js`:

```javascript
const transporter = nodemailer.createTransporter({
  host: 'smtp.sendgrid.net',
  port: 587,
  secure: false,
  auth: {
    user: 'apikey',
    pass: functions.config().sendgrid.api_key
  }
});
```

4. Налаштуйте конфігурацію:
```bash
firebase functions:config:set sendgrid.api_key="ваш-sendgrid-api-ключ"
firebase deploy --only functions
```

### AWS SES

1. Налаштуйте AWS SES
2. Оновіть `functions/index.js`:

```javascript
const transporter = nodemailer.createTransporter({
  SES: {
    aws: {
      accessKeyId: functions.config().aws.access_key_id,
      secretAccessKey: functions.config().aws.secret_access_key,
      region: 'us-east-1'
    }
  }
});
```

## 🧪 Тестування

1. **Створіть подорож**
2. **Запросіть користувача** через email
3. **Перевірте консоль браузера** - там має з'явитися URL запрошення
4. **Скопіюйте URL** і відкрийте в новій вкладці
5. **Прийміть запрошення**

## 🚨 Troubleshooting

### "Authentication failed"
- Перевірте, що використовуєте App Password, не звичайний пароль
- Переконайтеся, що 2FA увімкнено

### "Function not found"
- Переконайтеся, що functions розгорнуті: `firebase deploy --only functions`
- Перевірте, що ви в правильному Firebase проекті

### Email не приходить
- Перевірте спам папку
- Переконайтеся, що email адреса правильна
- Перевірте логи в Firebase Console → Functions → Logs

## 📊 Моніторинг

Переглядайте логи в Firebase Console:
1. [Firebase Console](https://console.firebase.google.com/)
2. Виберіть ваш проект
3. Functions → Logs

## 💡 Поточний стан

- ✅ Система запрошень створена
- ✅ Токени генеруються правильно
- ✅ База даних працює
- ❌ Email не налаштований (потрібен App Password)
- ✅ Fallback режим працює (URL в консолі)

**Після налаштування email, реальні запрошення будуть працювати!**
