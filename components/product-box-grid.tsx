import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

export type ProductBox = {
  label: string;
  title: string;
  description: string;
  href: string;
  action: string;
};

type ProductBoxGridProps = {
  items: ProductBox[];
  className?: string;
};

export function ProductBoxGrid({ items, className }: ProductBoxGridProps) {
  return (
    <div
      className={cn(
        "spaceman-product-grid grid w-full max-w-[970.4px] grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-3 lg:grid-cols-[repeat(3,315.5px)]",
        className,
      )}
    >
      {items.map((item) => (
        <a
          className="spaceman-product-card group relative flex min-h-[254px] flex-col overflow-hidden rounded-[14px] border border-border bg-card px-[24.8px] py-[24.8px] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          href={item.href}
          key={item.title}
        >
          <span className="font-mono text-xs leading-4 text-muted-foreground">
            {item.label}
          </span>
          <span className="mt-4 flex flex-col gap-3">
            <strong className="font-mono text-xl font-medium leading-7 tracking-normal text-foreground">
              {item.title}
            </strong>
            <span className="max-w-[266px] font-sans text-sm leading-[22.4px] text-muted-foreground">
              {item.description}
            </span>
          </span>
          <span className="mt-auto inline-flex items-center gap-2 pt-6 font-mono text-xs font-medium leading-4 text-foreground">
            {item.action}
            <ArrowRight
              aria-hidden="true"
              className="size-3.5 transition-transform duration-200 ease-out group-hover:translate-x-0.5"
            />
          </span>
        </a>
      ))}
    </div>
  );
}
