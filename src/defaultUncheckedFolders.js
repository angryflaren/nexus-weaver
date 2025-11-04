// Сюда входят папки, которые обычно не содержат код
// основной логики приложения, а используются для
// тестирования, документации, примеров и т.д.

const defaultUncheckedFolders = new Set([
  // --- C# / EF ---
  'Migrations',

  // --- Тестирование (JS/TS, Python, C#, Go, Ruby, Java, PHP) ---
  'test',
  'tests',
  '__tests__', // (Jest)
  'spec',
  'specs',
  'e2e',
  'cypress',
  '__mocks__',
  'mocks',

  // --- Документация (Все языки) ---
  'doc',
  'docs',
  'Documentation',

  // --- Примеры и Демо (Все языки) ---
  'example',
  'examples',
  'sample',
  'samples',
  'demo',
  'demos',

  // --- Компоненты UI (Storybook) ---
  '.storybook',
  'stories',

  // --- Производительность ---
  'bench',
  'benchmarks',

  // --- Вспомогательные скрипты (deploy, build, etc.) ---
  'scripts',

  // --- Git Хуки ---
  '.githooks',
]);

export default defaultUncheckedFolders;