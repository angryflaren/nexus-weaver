const defaultIgnoredFolders = new Set([
  // --- Системы контроля версий ---
  '.git', '.svn', '.hg', 'CVS',

  // --- Зависимости и пакеты (Ключевая цель) ---
  'node_modules', 'bower_components', 'vendor', 'Pods', 'Carthage', 
  'jspm_packages', 'packages', 'deps', 'third_party', 'externals',

  // --- Результаты сборки и компиляции ---
  'build', 'dist', 'out', 'bin', 'obj', 'target', 'release', 'Release', 
  'debug', 'Debug', 'public', 'www', 'build-dist', 'build_wasm',
  'generated', '__generated__',

  // --- Фреймворки и их служебные папки ---
  '.next', '.nuxt', '.svelte-kit', '.vercel', '.angular', '.expo',

  // --- Кэш различных инструментов ---
  '.cache', '__pycache__', '.pytest_cache', '.mypy_cache', '.ruff_cache', 
  '.npm', '.yarn', '.pnpm-cache', '.vite-cache', '.parcel-cache', 
  '.sass-cache', '.gradle', 'tmp', 'temp',

  // --- Настройки IDE и редакторов ---
  '.idea', '.vscode', '.vs', '.atom', '.sublime-project', 
  '.sublime-workspace', 'nbproject', '.settings', 'xcuserdata',

  // --- Тестирование и отчеты о покрытии ---
  'coverage', 'htmlcov', 'test-results', 'cypress/videos', 
  'cypress/screenshots', 'playwright-report', 'test-output',

  // --- Логи ---
  'log', 'logs', 'var/log',

  // --- Виртуальные окружения Python ---
  'venv', '.venv', 'env', 'ENV', 'virtualenv', '.virtualenv',
  
  // --- Сборки для мобильных устройств ---
  'DerivedData', 'build/ios', 'build/android', 'ios/build', 
  'android/build', 'android/app/build',

  // --- Облачные и платформенные папки ---
  '.serverless', '.aws-sam', '.terraform', '.elasticbeanstalk',
]);

export default defaultIgnoredFolders;