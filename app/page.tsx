import Image from "next/image";

import {
  ProductBoxGrid,
  type ProductBox,
} from "@/components/product-box-grid";
import { ThemeToggle } from "@/registry/spaceman/theme-toggle/theme-toggle";

const navItems = ["Products", "Integrations", "Docs", "Open Source"] as const;

const productBoxes: ProductBox[] = [
  {
    title: "Drag-and-drop builder",
    description:
      "Compose UIs from 90+ production components. Bind any element to a query and ship in minutes.",
    href: "#products",
  },
  {
    title: "Design-to-code",
    description:
      "Import design tokens and Figma frames. Designers and engineers work from the same source of truth.",
    href: "#products",
  },
  {
    title: "Connect any datasource",
    description:
      "Postgres, REST, GraphQL, gRPC, or your own SDK. Queries are typed and cached out of the box.",
    href: "#products",
  },
  {
    title: "Git-native workflow",
    description:
      "Everything is code. Branch, review, and roll back tools the same way you ship your product.",
    href: "#products",
  },
  {
    title: "Edge runtime",
    description:
      "Functions deploy to the edge automatically. Sub-50ms responses for tools your whole team relies on.",
    href: "#products",
  },
  {
    title: "Self-host or cloud",
    description:
      "Run Spaceman on your own infra under MIT, or let us host it. SOC 2, SSO, and audit logs included.",
    href: "#products",
  },
];

export default function Home() {
  return (
    <main className="min-h-svh bg-background text-foreground">
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
              className="spaceman-brand-logo size-6"
              height={24}
              priority
              src="/figma-assets/spaceman-logo-24.svg"
              width={24}
            />
          </a>

          <div className="ml-12 hidden items-center gap-8 font-mono text-sm leading-5 text-muted-foreground lg:flex">
            {navItems.map((item) => (
              <a
                className="spaceman-pressable -mx-1.5 -my-3 rounded-sm px-1.5 py-3 transition-colors duration-200 ease-out hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                href={`#${item.toLowerCase().replaceAll(" ", "-")}`}
                key={item}
              >
                {item}
              </a>
            ))}
          </div>

          <div className="ml-auto">
            <ThemeToggle className="spaceman-pressable" />
          </div>
        </nav>
      </header>

      <section
        className="w-full px-8 pb-8 pt-[99px] max-sm:px-6 max-sm:pt-12"
        id="top"
      >
        <div className="flex w-full max-w-[1023px] flex-col items-start gap-[58px]">
          <div className="flex flex-col items-start gap-6">
            <h1 className="spaceman-hero-title max-w-[896px] text-balance font-sans text-sp-display font-normal text-foreground">
              Build internal tools at the speed of thought.
            </h1>

            <p className="spaceman-hero-copy max-w-xl font-mono text-sm leading-[22.75px] text-muted-foreground">
              Spaceman is the open-source platform for developers and designers
              to assemble dashboards, admin panels, and design systems from real
              data, real components, and real code. No lock-in.
            </p>
          </div>

          <div className="flex w-full flex-col gap-8" id="products">
            <div className="flex flex-col gap-4">
              <p className="font-mono text-xs leading-4 text-muted-foreground">
                {"// the platform"}
              </p>
              <h2 className="max-w-2xl text-balance font-sans text-3xl font-normal leading-tight text-foreground sm:text-4xl">
                Everything you need to build, nothing you don&apos;t.
              </h2>
            </div>
            <ProductBoxGrid items={productBoxes} />
          </div>
        </div>
      </section>
    </main>
  );
}
