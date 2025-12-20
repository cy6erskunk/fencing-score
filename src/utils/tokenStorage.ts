const DEVICE_TOKEN_KEY = 'device_token';
const DEVICE_NAME_KEY = 'device_name';

export const saveToken = (token: string, name?: string): void => {
  try {
    localStorage.setItem(DEVICE_TOKEN_KEY, token);
    if (name) {
      localStorage.setItem(DEVICE_NAME_KEY, name);
    }
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

export const getDeviceName = (): string | null => {
  try {
    return localStorage.getItem(DEVICE_NAME_KEY);
  } catch (error) {
    console.error('Failed to get device name:', error);
    return null;
  }
};

export const removeToken = (): void => {
  try {
    localStorage.removeItem(DEVICE_TOKEN_KEY);
    localStorage.removeItem(DEVICE_NAME_KEY);
  } catch (error) {
    console.error('Failed to remove token:', error);
  }
};
