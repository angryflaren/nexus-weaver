// Папки "мягкого игнора" (логи, тесты). По умолчанию - отключены и свернуты.
// Есть возможность развернуть и выбрать файлы

const defaultUncheckedFolders = new Set([
  // --- Настройки IDE и редакторов ---
  '.idea', '.vscode', '.vs', '.atom', '.sublime-project', '.sublime-workspace', 'nbproject', '.settings', 'xcuserdata',

  // --- Логи ---
  'log', 'logs', 'var/log',

  // --- Отчеты о тестировании и покрытии ---
  'coverage', 'htmlcov', 'test-results', 'cypress/videos', 'cypress/screenshots', 'playwright-report', 'test-output',

  // --- Базы данных ---
  'Migrations',
  
  // --- Архитектурные папки ---
  'app',

  // --- Тестирование ---
  'test', 'tests', '__tests__', 'spec', 'specs', 'e2e', 'cypress', '__mocks__', 'mocks',

  // --- Документация ---
  'doc', 'docs', 'Documentation',

  // --- Примеры и Демо ---
  'example', 'examples', 'sample', 'samples', 'demo', 'demos',

  // --- Компоненты UI ---
  '.storybook', 'stories',

  // --- Производительность ---
  'bench', 'benchmarks',

  // --- Вспомогательные скрипты ---
  'scripts',

  // --- Git Хуки ---
  '.githooks',
]);

export default defaultUncheckedFolders;