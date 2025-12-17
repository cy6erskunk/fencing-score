const DEVICE_TOKEN_KEY = 'device_token';

export const saveToken = (token: string): void => {
  try {
    localStorage.setItem(DEVICE_TOKEN_KEY, token);
  } catch (error) {
    console.error('Failed to save token:', error);
  }
};

export const getToken = (): string | null => {
  try {
    return localStorage.getItem(DEVICE_TOKEN_KEY);
  } catch (error) {
    console.error('Failed to get token:', error);
    return null;
  }
};

export const removeToken = (): void => {
  try {
    localStorage.removeItem(DEVICE_TOKEN_KEY);
  } catch (error) {
    console.error('Failed to remove token:', error);
  }
};
