const setLocalStorage = <T>(storeKey: string, data: T) => {
  const stringData = JSON.stringify(data);

  localStorage.setItem(storeKey, stringData);
};

const getLocalStorage = <T>(storeKey: string) => {
  const storageData = localStorage.getItem(storeKey);

  if (storageData) {
    return JSON.parse(storageData) as T;
  }
  return undefined;
};

export { setLocalStorage, getLocalStorage };
