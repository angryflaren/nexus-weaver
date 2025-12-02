// Если название файла/папки содержит какую-либо из подстрок, то флажок по умолчанию отключается

const defaultUncheckedSubstrings = new Set([
  '— копия',
  '— copy',
  
  // Конфигурации Docker и Make
  'docker',        // покроет Dockerfile, docker-compose, .dockerignore
  'makefile',
  'jenkins',
  'vagrant',
  
  // Файлы зависимостей (Lock files)
  '.lock',         // покроет package-lock.json, yarn.lock, Gemfile.lock и т.д.
  '-lock',
  
  // Переменные окружения (Осторожно, могут содержать секреты!)
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
