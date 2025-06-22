import { QRMatchResult } from '../types';

export const submitMatchResult = async (
  submitUrl: string, 
  result: QRMatchResult
): Promise<void> => {
  try {
    const response = await fetch(submitUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(result),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Match result submitted successfully:', data);
  } catch (error) {
    console.error('Failed to submit match result:', error);
    throw error;
  }
};