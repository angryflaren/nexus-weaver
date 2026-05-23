// Файлы "жесткого игнора" (бинарники, архивы, медиа и тяжелые системные файлы)
// Отключены, выбрать нельзя

const defaultIgnoredFiles = new Set([
  // --- Исполняемые бинарники, библиотеки и установщики ---
  '.exe', '.msi', '.com', '.pif', '.scr', '.jar', '.dll', '.so', '.dylib', '.app', '.pkg', '.dmg', '.deb', '.rpm', '.msu',

  // --- Архивы ---
  '.zip', '.rar', '.7z', '.tar', '.gz', '.bz2', '.tgz', '.iso', '.img', '.toast', '.arj', '.lzh',

  // --- Медиа-файлы ---
  '.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a', '.aiff', '.mp4', '.mov', '.avi', '.mkv', '.webm', '.wmv', '.flv',

  // --- Шрифты ---
  '.ttf', '.otf', '.woff', '.woff2', '.eot',

  // --- Базы данных ---
  '.sqlite', '.sqlite3', '.db', '.mdb', '.accdb', '.sdf',

  // --- Системный и OS-специфичный мусор ---
  '.DS_Store', '._*', 'Thumbs.db', 'desktop.ini', '.Spotlight-V100', '.Trashes', 'NTUSER.DAT', 'Ink',

  // --- Скомпилированные объекты и кэш кода ---
  '.o', '.obj', '.class', '.pyc', '.pyo', '.pyd', '.a', '.lib', '.egg', '.whl',

  // --- Базовые иконки ---
  'favicon.ico', 'apple-touch-icon.png',

  // --- Сертификаты и ключи ---
  '*.pem', '*.key',
]);

export default defaultIgnoredFiles;
