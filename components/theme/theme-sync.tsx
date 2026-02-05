"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { useSettingsStore } from "@/stores/settings-store";

export function ThemeSync() {
  const { theme, setTheme } = useTheme();
  const settingsTheme = useSettingsStore((state) => state.theme);

  // Only sync FROM Settings TO Next-Themes
  useEffect(() => {
    if (settingsTheme && theme !== settingsTheme) {
      setTheme(settingsTheme);
    }
    // We remove 'theme' from the dependency array to prevent the ping-pong effect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settingsTheme, setTheme]);

  return null;
}