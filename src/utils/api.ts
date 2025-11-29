import { QRMatchResult, DeviceRegistrationRequest, DeviceRegistrationResponse } from '../types';

export const registerDevice = async (
  apiBaseUrl: string,
  request: DeviceRegistrationRequest
): Promise<DeviceRegistrationResponse> => {
  try {
    const url = `${apiBaseUrl}/api/submitter/register`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Device registered successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to register device:', error);
    throw error;
  }
};

export const submitMatchResult = async (
  submitUrl: string,
  result: QRMatchResult,
  token?: string
): Promise<void> => {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(submitUrl, {
      method: 'POST',
      headers,
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