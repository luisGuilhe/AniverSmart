import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { LightColors, DarkColors, ThemeColors } from '../styles/colors';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  isDark: boolean;
  colors: ThemeColors;
}

const PREFS_PATH = `${FileSystem.documentDirectory}theme_prefs.json`;

async function loadSavedMode(): Promise<ThemeMode> {
  try {
    const raw = await FileSystem.readAsStringAsync(PREFS_PATH);
    const parsed = JSON.parse(raw);
    if (parsed.mode === 'light' || parsed.mode === 'dark' || parsed.mode === 'system') {
      return parsed.mode;
    }
  } catch {
    // file doesn't exist yet — use default
  }
  return 'system';
}

async function saveMode(mode: ThemeMode): Promise<void> {
  try {
    await FileSystem.writeAsStringAsync(PREFS_PATH, JSON.stringify({ mode }));
  } catch {
    // ignore write errors
  }
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: 'system',
  setMode: () => {},
  isDark: false,
  colors: LightColors,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadSavedMode().then(saved => {
      setModeState(saved);
      setLoaded(true);
    });
  }, []);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    saveMode(next);
  }, []);

  const isDark =
    mode === 'dark' ? true :
    mode === 'light' ? false :
    systemScheme === 'dark';

  const colors = isDark ? DarkColors : LightColors;

  if (!loaded) return null;

  return (
    <ThemeContext.Provider value={{ mode, setMode, isDark, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  return useContext(ThemeContext);
}
