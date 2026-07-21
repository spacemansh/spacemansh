import { cn } from "@/lib/utils";

export type ProductBox = {
  title: string;
  description: string;
  href: string;
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
          <span className="flex flex-col gap-3">
            <strong className="font-mono text-xl font-medium leading-7 tracking-normal text-foreground">
              {item.title}
            </strong>
            <span className="max-w-[266px] font-sans text-sm leading-[22.4px] text-muted-foreground">
              {item.description}
            </span>
          </span>
        </a>
      ))}
    </div>
  );
}
