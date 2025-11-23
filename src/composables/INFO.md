# Composables (Перевикористовувана логіка)

## Призначення папки

Папка містить Vue composables - функції з перевикористовуваною логікою, які можна використовувати в компонентах. Composables дозволяють винести спільну логіку з компонентів.

## Структура

```
src/composables/
├── useLocale.ts          # Робота з локалізацією
├── useNotifications.ts   # Управління сповіщеннями
└── useTheme.ts           # Управління темою (світла/темна)
```

## Файли

### useLocale.ts

**Призначення:** Composable для роботи з інтернаціоналізацією (i18n).

**Що містить:**

- `currentLocale` - поточна мова
- `setLocale(locale)` - змінити мову
- `t(key)` - функція перекладу (alias для i18n.t)

**Використання:**

```typescript
import { useLocale } from "@/composables/useLocale";

const { currentLocale, setLocale, t } = useLocale();

// Змінити мову
setLocale("en");

// Переклад
const text = t("common.save");
```

### useNotifications.ts

**Призначення:** Composable для управління системою сповіщень.

**Що містить:**

- `showSuccess(title, message?)` - успішне сповіщення
- `showError(title, message?)` - помилка
- `showWarning(title, message?)` - попередження
- `showInfo(title, message?)` - інформація
- `closeNotification(id)` - закрити сповіщення
- `clearAll()` - очистити всі сповіщення

**Використання:**

```typescript
import { useNotifications } from "@/composables/useNotifications";

const { showSuccess, showError } = useNotifications();

// Показати успіх
showSuccess("Збережено", "Дані успішно збережено");

// Показати помилку
showError("Помилка", "Не вдалося зберегти дані");
```

**Типи сповіщень:**

- `success` - зелена, для успішних операцій
- `error` - червона, для помилок
- `warning` - жовта, для попереджень
- `info` - синя, для інформації

### useTheme.ts

**Призначення:** Composable для управління темою інтерфейсу (світла/темна).

**Що містить:**

- `currentTheme` - поточна тема ("light" | "dark")
- `toggleTheme()` - перемкнути тему
- `setTheme(theme)` - встановити тему

**Використання:**

```typescript
import { useTheme } from "@/composables/useTheme";

const { currentTheme, toggleTheme } = useTheme();

// Перемкнути тему
toggleTheme();
```

**Збереження:**

- Тема зберігається в localStorage
- Автоматично відновлюється при завантаженні

## Принципи composables

- **Перевикористання** - одна логіка використовується в багатьох компонентах
- **Реактивність** - використовують Vue reactivity API
- **Типізація** - всі функції типізовані
- **Ізоляція** - кожен composable має свою відповідальність

## Створення нового composable

1. Створити файл з префіксом `use` (наприклад, `useSomething.ts`)
2. Експортувати функцію з ім'ям composable
3. Використовувати Vue reactivity API (ref, reactive, computed)
4. Повертати об'єкт з функціями та станом
5. Додати TypeScript типи

**Приклад:**

```typescript
import { ref } from "vue";

export function useSomething() {
  const state = ref(0);

  function increment() {
    state.value++;
  }

  return {
    state,
    increment,
  };
}
```

---

**Останнє оновлення:** 2025-01-XX




