'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Button } from '../atoms/Button';
import { Palette } from 'lucide-react';

export function ThemeSwitcher() {
  const { theme, setTheme, themes } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    setIsPopoverOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="secondary"
        size="icon"
        onClick={() => setIsPopoverOpen(!isPopoverOpen)}
        aria-label="Toggle theme switcher"
      >
        <Palette className="w-5 h-5" />
      </Button>

      {isPopoverOpen && (
        <div className="absolute bottom-full right-0 mb-2 w-40 p-2 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50">
          {themes.map((t) => {
            const displayName = t.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            const isSelected = theme === t;
            return (
              <Button
                key={t}
                variant={isSelected ? "primary" : "ghost"}
                onClick={() => handleThemeChange(t)}
                className="w-full justify-start mb-1"
              >
                {displayName}
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}