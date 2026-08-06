"use client";

import type * as React from "react";
import { ThemeProvider as ThemeAnimationProvider } from "@space-man/react-theme-animation";

/**
 * Wraps the app in theme state and applies the `dark` class to <html>.
 *
 * Renders a pre-hydration script so the stored theme is applied before first
 * paint, which keeps the page from flashing the wrong theme on load.
 */
function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeAnimationProvider
      attribute="class"
      defaultTheme="dark"
      duration={300}
      enableSystem
    >
      {children}
    </ThemeAnimationProvider>
  );
}

export { ThemeProvider };
