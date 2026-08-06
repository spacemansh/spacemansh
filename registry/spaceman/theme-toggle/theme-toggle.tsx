"use client";

import type * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@space-man/react-theme-animation";

import { cn } from "@/lib/utils";

/**
 * Toggles between light and dark, revealing the new theme from the button.
 *
 * The icons cross-fade through the `dark` variant rather than through React
 * state, so the button renders correctly on the server and never flashes the
 * wrong icon before hydration. Requires `ThemeProvider` above it in the tree.
 */
function ThemeToggle({ className, ...props }: React.ComponentProps<"button">) {
  const { ref, toggleTheme } = useTheme();

  return (
    <button
      aria-label="Toggle theme"
      className={cn(
        "inline-grid size-11 cursor-pointer place-items-center rounded-md text-muted-foreground transition-colors duration-200 ease-out hover:bg-card hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
      onClick={() => toggleTheme()}
      ref={ref}
      type="button"
      {...props}
    >
      <Sun
        aria-hidden="true"
        className="col-start-1 row-start-1 size-4 rotate-90 scale-90 opacity-0 transition-[transform,opacity] duration-200 ease-out motion-reduce:transition-none dark:rotate-0 dark:scale-100 dark:opacity-100"
      />
      <Moon
        aria-hidden="true"
        className="col-start-1 row-start-1 size-4 rotate-0 scale-100 opacity-100 transition-[transform,opacity] duration-200 ease-out motion-reduce:transition-none dark:-rotate-90 dark:scale-90 dark:opacity-0"
      />
    </button>
  );
}

export { ThemeToggle };
