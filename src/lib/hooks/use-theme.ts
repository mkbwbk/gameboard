'use client';

import { useEffect, useRef, useState } from 'react';

type Theme = 'light' | 'dark';

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  // Migrate from old localStorage key
  const oldStored = localStorage.getItem('gameboard-theme');
  if (oldStored) {
    localStorage.setItem('scoredoor-theme', oldStored);
    localStorage.removeItem('gameboard-theme');
  }
  const stored = localStorage.getItem('scoredoor-theme') as Theme | null;
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return stored ?? (prefersDark ? 'dark' : 'light');
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  }, [theme]);

  function setTheme(t: Theme) {
    setThemeState(t);
    localStorage.setItem('scoredoor-theme', t);
    document.documentElement.classList.toggle('dark', t === 'dark');
  }

  function toggleTheme() {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }

  return { theme, setTheme, toggleTheme };
}
