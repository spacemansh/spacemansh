import Image from "next/image";
import { Moon, Sun } from "lucide-react";

import {
  ProductBoxGrid,
  type ProductBox,
} from "@/components/product-box-grid";

const navItems = ["Products", "Standards", "Docs", "GitHub"] as const;

const productBoxes: ProductBox[] = [
  {
    label: "component library",
    title: "spaceman/ui",
    description:
      "Production-ready primitives for building calm interfaces without losing control of the source.",
    href: "#products",
    action: "Browse components",
  },
  {
    label: "review utility",
    title: "surface checks",
    description:
      "Design-system audits for contrast, spacing, interaction states, and the details teams usually catch late.",
    href: "#standards",
    action: "Read standards",
  },
  {
    label: "workflow kit",
    title: "shipbench",
    description:
      "A small set of project patterns for keeping code, tokens, and visual quality moving together.",
    href: "#docs",
    action: "Open docs",
  },
];

export default function Home() {
  return (
    <main className="spaceman-page min-h-svh bg-background text-foreground">
      <header className="relative z-20 border-b border-border/70 bg-background/85 backdrop-blur">
        <nav
          aria-label="Primary navigation"
          className="spaceman-nav-reveal flex h-[65px] w-full items-center gap-0 overflow-hidden px-8 max-sm:px-6"
        >
          <a
            aria-label="spaceman.sh home"
            className="spaceman-pressable -m-1.5 shrink-0 rounded-sm p-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            href="#top"
          >
            <Image
              alt=""
              className="spaceman-brand-logo h-8 w-auto"
              height={32}
              priority
              src="/figma-assets/spaceman-logo.svg"
              width={158}
            />
          </a>

          <div className="ml-[86px] hidden items-center gap-8 font-mono text-sm leading-5 text-muted-foreground lg:flex">
            {navItems.map((item) => (
              <a
                className="spaceman-pressable -mx-1.5 -my-3 rounded-sm px-1.5 py-3 transition-colors duration-200 ease-out hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                href={`#${item.toLowerCase()}`}
                key={item}
              >
                {item}
              </a>
            ))}
          </div>

          <div className="relative ml-auto">
            <input
              aria-label="Use light theme"
              className="spaceman-theme-toggle absolute inset-0 z-10 size-11 cursor-pointer opacity-0"
              id="spaceman-theme-toggle"
              type="checkbox"
            />
            <label
              className="spaceman-theme-toggle-control inline-flex size-11 cursor-pointer items-center justify-center rounded-md text-muted-foreground hover:bg-card hover:text-foreground"
              htmlFor="spaceman-theme-toggle"
            >
              <Sun aria-hidden="true" className="spaceman-sun-icon size-4" />
              <Moon aria-hidden="true" className="spaceman-moon-icon size-4" />
            </label>
          </div>
        </nav>
      </header>

      <section
        className="w-full px-8 pb-8 pt-[99px] max-sm:px-6 max-sm:pt-12"
        id="top"
      >
        <div className="flex w-full max-w-[1023px] flex-col items-start gap-[58px]">
          <div className="flex flex-col items-start gap-6">
            <div className="spaceman-hero-kicker flex items-center gap-2 font-mono text-xs leading-4 text-muted-foreground">
              <span aria-hidden="true">Folder</span>
              <span className="text-foreground">Open-Source library.</span>
            </div>

            <h1 className="spaceman-hero-title max-w-[896px] text-balance font-sans text-sp-display font-normal text-foreground">
              Developer tools for interfaces that arrive considered.
            </h1>

            <p className="spaceman-hero-copy max-w-xl font-mono text-sm leading-[22.75px] text-muted-foreground">
              Open-source libraries, review utilities, and workflow patterns
              for teams who want source code and surface quality to be in sync.
            </p>
          </div>

          <ProductBoxGrid items={productBoxes} />
        </div>
      </section>
    </main>
  );
}
