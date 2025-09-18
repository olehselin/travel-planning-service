# 🔑 Де вставити ключі EmailJS

## 🎯 Швидкий спосіб (через UI)

1. **Відкрийте додаток**: http://localhost:5177/
2. **Увійдіть в акаунт**
3. **Натисніть "Email Setup"** в навігації
4. **Введіть ваші ключі EmailJS:**
   - Service ID
   - Template ID  
   - Public Key
5. **Натисніть "Налаштувати EmailJS"**

## 🔧 Альтернативний спосіб (прямо в коді)

Якщо ви хочете вставити ключі безпосередньо в код:

### Крок 1: Отримайте ключі з EmailJS

1. Зареєструйтеся на https://www.emailjs.com/
2. Налаштуйте Gmail service
3. Створіть email template
4. Отримайте ключі:
   - **Service ID**: `service_xxxxxxx`
   - **Template ID**: `template_xxxxxxx`
   - **Public Key**: `xxxxxxxxxxxxxxx`

### Крок 2: Вставте ключі в код

Відкрийте файл `src/services/freeEmailService.ts` і знайдіть рядки 44-53:

```typescript
// Читаємо конфігурацію з localStorage
const config = localStorage.getItem('emailjs_config')
if (!config) {
  throw new Error('EmailJS not configured')
}

const { serviceId, templateId, publicKey } = JSON.parse(config)
```

**Замініть цей код на:**

```typescript
// Прямо в коді (для швидкого тестування)
const serviceId = 'YOUR_SERVICE_ID_HERE'
const templateId = 'YOUR_TEMPLATE_ID_HERE'
const publicKey = 'YOUR_PUBLIC_KEY_HERE'

if (serviceId === 'YOUR_SERVICE_ID_HERE') {
  throw new Error('EmailJS not configured')
}
```

### Крок 3: Замініть YOUR_* на ваші ключі

```typescript
const serviceId = 'service_abc123'  // Ваш Service ID
const templateId = 'template_xyz789'  // Ваш Template ID
const publicKey = 'user_def456'  // Ваш Public Key
```

## 🧪 Тестування

1. **Відкрийте консоль браузера** (F12)
2. **Створіть подорож** і запросіть користувача
3. **Перевірте консоль** - там має з'явитися URL запрошення
4. **Скопіюйте URL** і відкрийте в новій вкладці

## 📋 Приклад ключів

```typescript
// Приклад (замініть на ваші реальні ключі)
const serviceId = 'service_gmail123'
const templateId = 'template_invite456'
const publicKey = 'user_abc789def'
```

## 🚨 Важливо

- **Ніколи не комітьте ключі в Git** (додайте `src/services/freeEmailService.ts` в `.gitignore`)
- **Використовуйте UI спосіб** для продакшену
- **Fallback режим завжди працює** - навіть без налаштування email

## ✅ Результат

Після вставки ключів:
- ✅ Реальні email будуть відправлятися
- ✅ Запрошення працюватимуть повністю
- ✅ Все безкоштовно!
