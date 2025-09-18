# 🚀 Швидке налаштування Email (5 хвилин)

## 🎯 Мета
Налаштувати email запрошення **повністю безкоштовно** за 5 хвилин.

## ⚡ Швидкий старт

### Крок 1: Зареєструйтеся на EmailJS
1. Перейдіть на https://www.emailjs.com/
2. Натисніть "Sign Up"
3. Підтвердіть email

### Крок 2: Налаштуйте Gmail
1. В EmailJS Dashboard → Email Services
2. Натисніть "Add New Service"
3. Виберіть Gmail
4. Увійдіть в ваш Gmail акаунт
5. Дозвольте доступ

### Крок 3: Створіть шаблон
1. Email Templates → Create New Template
2. Template ID: `travel_invite`
3. Subject: `You're invited to collaborate on {{trip_title}}`
4. Content:
```html
Hi!

You have been invited to collaborate on the trip "{{trip_title}}".

Click here to accept: {{invite_url}}

This invitation expires on {{expires_at}}.

Best regards,
TravelPlanner Team
```

### Крок 4: Отримайте ключі
1. Account → API Keys
2. Скопіюйте Public Key
3. Запам'ятайте Service ID та Template ID

### Крок 5: Налаштуйте в додатку
1. Відкрийте додаток
2. Перейдіть до налаштувань email
3. Введіть ваші ключі:
   - Service ID
   - Template ID
   - Public Key
4. Натисніть "Налаштувати EmailJS"

## 🧪 Тестування

1. **Відкрийте консоль браузера** (F12)
2. **Створіть подорож** і запросіть користувача
3. **Перевірте консоль** - там має з'явитися URL запрошення
4. **Скопіюйте URL** і відкрийте в новій вкладці
5. **Прийміть запрошення**

## 🆓 Безкоштовні ліміти

- **EmailJS**: 200 email/місяць
- **Resend**: 3000 email/місяць
- **Fallback**: Безліміт (URL в консолі)

## 🚨 Якщо щось не працює

1. **Перевірте консоль браузера** - там завжди є URL запрошення
2. **Переконайтеся, що всі ключі правильні**
3. **Перевірте, що Gmail service підключений**

## ✅ Результат

Після налаштування:
- ✅ Реальні email будуть відправлятися
- ✅ Запрошення працюватимуть повністю
- ✅ Все безкоштовно!

**Fallback режим завжди працює** - навіть без налаштування email, URL запрошень з'являються в консолі браузера.
