// A comprehensive list of files to be ignored by default.
// This list focuses on generated files, logs, IDE settings, and other metadata
// that do not typically contain core source code.
const defaultIgnoredFiles = new Set([
  // --- Исполняемые файлы, библиотеки и установщики (Риск безопасности и бесполезность для анализа) ---
  '.exe', '.msi', '.bat', '.cmd', '.sh', '.com', '.pif', '.scr',
  '.jar', '.dll', '.so', '.dylib', '.app', '.pkg', '.dmg',
  '.deb', '.rpm', '.msu',

  // --- Архивы (Бинарные контейнеры) ---
  '.zip', '.rar', '.7z', '.tar', '.gz', '.bz2', '.tgz',
  '.iso', '.img', '.toast', '.arj', '.lzh',

  // --- Медиа-файлы (Слишком большие для анализа) ---
  '.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a', '.aiff', // Аудио
  '.mp4', '.mov', '.avi', '.mkv', '.webm', '.wmv', '.flv', // Видео

  // --- Шрифты ---
  '.ttf', '.otf', '.woff', '.woff2', '.eot',

  // --- Файлы баз данных (Бинарные или слишком большие) ---
  '.sqlite', '.sqlite3', '.db', '.mdb', '.accdb', '.sql',
  '.dump', '.sdf',

  // --- Системные и OS-специфичные файлы ---
  '.DS_Store', '._*', 'Thumbs.db', 'desktop.ini',
  '.Spotlight-V100', '.Trashes', 'NTUSER.DAT',

  // --- Скомпилированный код и бинарные объекты ---
  '.o', '.obj', '.class', '.pyc', '.pyo', '.pyd', '.a', '.lib',
  '.egg', '.whl',

  // --- Файлы конфигурации IDE и редакторов ---
  '*.suo', '*.user', '*.iml', '*.code-workspace', '.project',
  '.classpath', '.buildpath', 'nbproject', '*.sln',
  '.idea/workspace.xml', '.idea/misc.xml', // Более конкретные правила для IDE

  // --- Резервные копии и временные файлы ---
  '*~', '*.swp', '*.swo', '*.bak', '*.bak2', '*.old',
  '*.tmp', '*.temp', '*.orig', '*.rej',

  // --- Лок-файлы зависимостей (Метаданные, не исходный код) ---
  'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml', 'composer.lock',
  'Gemfile.lock', 'Pipfile.lock', 'poetry.lock', 'go.sum', 'Cargo.lock',
  'project.lock.json', 'Podfile.lock',

  // --- Логи и дампы ---
  '*.log', 'npm-debug.log', 'yarn-debug.log', 'yarn-error.log',
  'pnpm-debug.log', 'lerna-debug.log', '*.pid', '*.seed', 'error.log',
  'debug.log', 'perf.log',

  // --- Локальные переменные окружения (Чувствительная информация) ---
  // ВАЖНО: .env.example или .env.template не игнорируются, что правильно.
  '.env', '.env.local', '.env.development', '.env.production', '.env.test',
  '.env.development.local', '.env.test.local', '.env.production.local', '.env.*.local',

  // --- Специфичные файлы инструментов и сборки ---
  'Dockerfile', 'docker-compose.yml', 'Makefile', 'Rakefile', 'Jenkinsfile',
  'Vagrantfile', '.dockerignore', 'gradlew', 'gradlew.bat',
  '*.tsbuildinfo', 'local.properties',

  // --- Метаданные проекта и документация (Часто нерелевантны для AI) ---
  'README', 'readme', 'README.md', 'readme.md', 'README.rst',
  'LICENSE', 'LICENSE.md', 'LICENSE.txt', 'UNLICENSE', 'COPYING',
  'CONTRIBUTING.md', 'CHANGELOG.md', 'HISTORY.md', 'NEWS.md', 'AUTHORS.md',
  'CODE_OF_CONDUCT.md', 'SECURITY.md', 'PULL_REQUEST_TEMPLATE.md',
  'ISSUE_TEMPLATE.md', 'FUNDING.yml', '.editorconfig', '.gitattributes',
  '.gitignore', '.gitmodules', '.gitkeep', '.mailmap',
  'robots.txt', 'humans.txt', 'manifest.json', 'now.json', 'netlify.toml',
  'Procfile', '.firebaserc',

  // --- Ассеты и иконки (Часто нерелевантны для анализа кода) ---
  'favicon.ico', 'favicon.png', 'favicon.svg', 'apple-touch-icon.png',
  'logo.svg', 'logo.png', 'icon.svg', 'icon.png',
  'screenshot.png', 'screenshot.jpg',

  // --- Сертификаты и ключи ---
  '*.pem', '*.key',
]);

export default defaultIgnoredFiles;