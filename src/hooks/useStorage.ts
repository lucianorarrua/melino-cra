export const useStorage = () => {
  const _prefix = '__MELINO__';

  const KEYS = {
    MELI_CODE: 'MELI_CODE',
    MELI_TOKEN: 'MELI_TOKEN',
  };

  const customStore = {
    save: (key: string, value: string) =>
      localStorage.setItem(`${_prefix}${key}`, value),
    stringifyAndSave: (key: string, value: any) =>
      localStorage.setItem(`${_prefix}${key}`, JSON.stringify(value)),
    getAndParse: <T>(key: string) => {
      let value = localStorage.getItem(`${_prefix}${key}`);
      return value ? (JSON.parse(value) as T) : null;
    },
    get: (key: string) => localStorage.getItem(`${_prefix}${key}`),
    remove: (key: string) => localStorage.removeItem(`${_prefix}${key}`),
    clear: () => localStorage.clear(),
  };

  return { ...customStore, KEYS };
};
