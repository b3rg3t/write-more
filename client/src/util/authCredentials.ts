export const TOKEN_STORAGE_KEY = "token";
export const USER_STORAGE_KEY = "user";

export const clearCredentials = () => {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
};
