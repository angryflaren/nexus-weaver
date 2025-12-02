// Полный список файлов, игнорируемых по умолчанию.
// Этот список в основном содержит сгенерированные файлы, логи, настройки IDE и другие метаданные,
// которые обычно не содержат основной исходный код.

const defaultIgnoredFiles = new Set([
  // --- Исполняемые файлы, библиотеки и установщики ---
  '.exe', '.msi', '.bat', '.cmd', '.sh', '.com', '.pif', '.scr',
  '.jar', '.dll', '.so', '.dylib', '.app', '.pkg', '.dmg',
  '.deb', '.rpm', '.msu',

  // --- Архивы ---
  '.zip', '.rar', '.7z', '.tar', '.gz', '.bz2', '.tgz',
  '.iso', '.img', '.toast', '.arj', '.lzh',

  // --- Медиа-файлы ---
  '.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a', '.aiff',
  '.mp4', '.mov', '.avi', '.mkv', '.webm', '.wmv', '.flv',

  // --- Шрифты ---
  '.ttf', '.otf', '.woff', '.woff2', '.eot',

  // --- Файлы баз данных ---
  '.sqlite', '.sqlite3', '.db', '.mdb', '.accdb', '.sql',
  '.dump', '.sdf',

  // --- Системные и OS-специфичные файлы ---
  '.DS_Store', '._*', 'Thumbs.db', 'desktop.ini',
  '.Spotlight-V100', '.Trashes', 'NTUSER.DAT', 'Ink',

  // --- Скомпилированный код и бинарные объекты ---
  '.o', '.obj', '.class', '.pyc', '.pyo', '.pyd', '.a', '.lib',
  '.egg', '.whl',

  // --- Кэши и логи (если они не нужны, можно оставить тут) ---
  '*.log', 'npm-debug.log', 'yarn-debug.log', 'yarn-error.log',
  'pnpm-debug.log', 'lerna-debug.log', '*.pid', '*.seed', 'error.log',
  'debug.log', 'perf.log',

  // --- Ассеты и иконки ---
  'favicon.ico', 'favicon.png', 'favicon.svg', 'apple-touch-icon.png',
  'logo.svg', 'logo.png', 'icon.svg', 'icon.png',
  'screenshot.png', 'screenshot.jpg',

  // --- Сертификаты и ключи (Оставляем для безопасности, если нужно - убери) ---
  '*.pem', '*.key',
]);

export default defaultIgnoredFiles;
