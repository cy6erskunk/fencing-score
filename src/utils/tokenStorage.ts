const TOKEN_PREFIX = 'tournament_token_';

export const saveToken = (tournamentId: number, token: string): void => {
  try {
    localStorage.setItem(`${TOKEN_PREFIX}${tournamentId}`, token);
  } catch (error) {
    console.error('Failed to save token:', error);
  }
};

export const getToken = (tournamentId: number): string | null => {
  try {
    return localStorage.getItem(`${TOKEN_PREFIX}${tournamentId}`);
  } catch (error) {
    console.error('Failed to get token:', error);
    return null;
  }
};

export const removeToken = (tournamentId: number): void => {
  try {
    localStorage.removeItem(`${TOKEN_PREFIX}${tournamentId}`);
  } catch (error) {
    console.error('Failed to remove token:', error);
  }
};

export const clearAllTokens = (): void => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(TOKEN_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Failed to clear tokens:', error);
  }
};
