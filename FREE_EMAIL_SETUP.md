# 🆓 Безкоштовне налаштування Email для TravelPlanner

## 🎯 Мета
Налаштувати email запрошення **повністю безкоштовно** без Firebase Functions.

## 📊 Порівняння безкоштовних сервісів

| Сервіс | Безкоштовний ліміт | Налаштування | Складність |
|--------|-------------------|--------------|------------|
| **EmailJS** | 200 email/місяць | ⭐⭐ | Легко |
| **Resend** | 3000 email/місяць | ⭐⭐⭐ | Середньо |
| **Gmail SMTP** | 500 email/день | ⭐⭐⭐⭐ | Складно |
| **Fallback** | Безліміт | ⭐ | Дуже легко |

## 🚀 Швидке рішення (5 хвилин)

### Варіант 1: EmailJS (рекомендовано)

1. **Зареєструйтеся на [EmailJS](https://www.emailjs.com/)**
2. **Створіть email service:**
   - Gmail → Connect Account
   - Дозвольте доступ до вашого Gmail
3. **Створіть email template:**
   ```html
   Subject: You're invited to collaborate on {{trip_title}}
   
   Hi!
   
   You have been invited to collaborate on the trip "{{trip_title}}".
   
   Click here to accept: {{invite_url}}
   
   This invitation expires on {{expires_at}}.
   
   Best regards,
   TravelPlanner Team
   ```
4. **Отримайте ключі:**
   - Service ID
   - Template ID  
   - Public Key

5. **Оновіть код:**
   ```typescript
   // В src/services/freeEmailService.ts
   const serviceId = 'YOUR_EMAILJS_SERVICE_ID'
   const templateId = 'YOUR_EMAILJS_TEMPLATE_ID'
   const publicKey = 'YOUR_EMAILJS_PUBLIC_KEY'
   ```

### Варіант 2: Resend API

1. **Зареєструйтеся на [Resend](https://resend.com/)**
2. **Отримайте API ключ**
3. **Оновіть код:**
   ```typescript
   // В src/services/freeEmailService.ts
   const apiKey = 'YOUR_RESEND_API_KEY'
   ```

## 🔧 Детальне налаштування

### EmailJS (найпростіший)

1. **Реєстрація:**
   - Перейдіть на https://www.emailjs.com/
   - Натисніть "Sign Up"
   - Підтвердіть email

2. **Налаштування Gmail:**
   - Email Services → Add New Service
   - Виберіть Gmail
   - Увійдіть в ваш Gmail акаунт
   - Дозвольте доступ

3. **Створення шаблону:**
   - Email Templates → Create New Template
   - Template ID: `travel_invite`
   - Subject: `You're invited to collaborate on {{trip_title}}`
   - Content: HTML шаблон (вже готовий в коді)

4. **Отримання ключів:**
   - Account → API Keys
   - Скопіюйте Public Key
   - Service ID та Template ID з попередніх кроків

5. **Встановлення пакету:**
   ```bash
   npm install @emailjs/browser
   ```

### Resend API (більше email)

1. **Реєстрація:**
   - Перейдіть на https://resend.com/
   - Натисніть "Get Started"
   - Підтвердіть email

2. **Отримання API ключа:**
   - Dashboard → API Keys
   - Create API Key
   - Скопіюйте ключ

3. **Налаштування домену (опціонально):**
   - Domains → Add Domain
   - Додайте ваш домен для кращої доставки

## 🧪 Тестування

1. **Відкрийте консоль браузера** (F12)
2. **Створіть подорож** і запросіть користувача
3. **Перевірте консоль** - там має з'явитися URL запрошення
4. **Скопіюйте URL** і відкрийте в новій вкладці
5. **Прийміть запрошення**

## 🚨 Troubleshooting

### EmailJS не працює
- Перевірте, що всі ключі правильні
- Переконайтеся, що Gmail service підключений
- Перевірте, що template створений

### Resend API не працює
- Перевірте API ключ
- Переконайтеся, що домен налаштований (якщо використовуєте)

### Fallback режим
- Якщо нічого не працює, система автоматично покаже URL в консолі
- Це дозволяє тестувати запрошення без email

## 💡 Поточний стан

- ✅ **Безкоштовний email сервіс створений**
- ✅ **Fallback режим працює** (URL в консолі)
- ✅ **Система запрошень працює**
- ⚠️ **Потрібно налаштувати EmailJS або Resend**

## 🎉 Результат

Після налаштування одного з сервісів:
- ✅ Реальні email будуть відправлятися
- ✅ Запрошення працюватимуть повністю
- ✅ Все безкоштовно!

**Рекомендація:** Почніть з EmailJS - це найпростіший варіант для початку.
