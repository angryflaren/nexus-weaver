// Подстроки "мягкого игнора", которые могут быть в названиях файлов/папок
// По умолчанию отключены, но доступны для выбора

const defaultUncheckedSubstrings = new Set([
  '— копия',
  '— copy',
  
  // Файлы БД, Дампы и Логи
  '.sql',
  '.dump',
  '.log',
  'debug',
  'error',
  
  // Конфигурации Docker и Make
  'docker',        
  'makefile',
  'jenkins',
  'vagrant',
  
  // Файлы зависимостей
  '.lock',         
  '-lock',
  
  // Переменные окружения
  '.env',
  
  // Документация и метаданные
  'readme',
  'license',
  'changelog',
  'contributing',
  'authors',
  'history',
  'code_of_conduct',
]);

export default defaultUncheckedSubstrings;