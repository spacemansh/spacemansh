import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-10 min-w-0 rounded-md bg-input px-3 py-1 text-base outline-none transition-[box-shadow,color] duration-200 ease-out placeholder:text-muted-foreground/65 focus-visible:ring-[3px] focus-visible:ring-ring/45 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
