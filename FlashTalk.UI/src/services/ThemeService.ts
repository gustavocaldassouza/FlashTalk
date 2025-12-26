import { UserThemePreferences } from '../types/theme';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function getUserThemePreferences(userId: number, token: string): Promise<UserThemePreferences | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/userthemesettings/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch theme preferences:', response.statusText);
      return null;
    }

    const data = await response.json();
    return {
      id: data.id,
      userId: data.userId,
      themeMode: data.themeMode || 'light',
      fontSizeScale: data.fontSizeScale || 'medium',
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
    };
  } catch (error) {
    console.error('Error fetching theme preferences:', error);
    return null;
  }
}

export async function updateUserThemePreferences(
  userId: number,
  preferences: Partial<UserThemePreferences>,
  token: string
): Promise<UserThemePreferences | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/userthemesettings/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        themeMode: preferences.themeMode || 'light',
        fontSizeScale: preferences.fontSizeScale || 'medium',
      }),
    });

    if (!response.ok) {
      console.error('Failed to update theme preferences:', response.statusText);
      return null;
    }

    const data = await response.json();
    return {
      id: data.id,
      userId: data.userId,
      themeMode: data.themeMode || 'light',
      fontSizeScale: data.fontSizeScale || 'medium',
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
    };
  } catch (error) {
    console.error('Error updating theme preferences:', error);
    return null;
  }
}
