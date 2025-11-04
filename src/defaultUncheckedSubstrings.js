// Если название файла/папки содержит какую-либо из подстрок, то флажок по умолчанию отключается

const defaultUncheckedSubstrings = new Set([
  '— копия',
  '— copy',
]);

export default defaultUncheckedSubstrings;