import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';

// LocalStorage key
const STORAGE_KEY = 'ui.theme';

type ThemeMode = 'light' | 'dark';

function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light';
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    if (stored === 'light' || stored === 'dark') return stored;
    // Fallback to system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = React.useState<ThemeMode>(() => getInitialTheme());

  // Apply theme class to document
  React.useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark'); else root.classList.remove('dark');
    try { localStorage.setItem(STORAGE_KEY, theme); } catch { /* ignore */ }
  }, [theme]);

  const toggle = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      onClick={toggle}
      className="relative transition-transform hover:rotate-6 focus-visible:ring-2"
    >
      <Sun className={`h-5 w-5 transition-all duration-300 ${theme === 'light' ? 'scale-100 rotate-0 opacity-100' : 'absolute scale-0 -rotate-90 opacity-0'}`} />
      <Moon className={`h-5 w-5 transition-all duration-300 ${theme === 'dark' ? 'scale-100 rotate-0 opacity-100' : 'absolute scale-0 rotate-90 opacity-0'}`} />
    </Button>
  );
};

export default ThemeToggle;
