"use client";

import Image from "next/image";
import { useState } from "react";

const navItems = ["Products", "Integrations", "Docs", "Open Source"] as const;

const features = [
  {
    icon: "/figma-assets/feature-builder.svg",
    title: "Drag-and-drop builder",
    description:
      "Compose UIs from 90+ production components. Bind any element to a query and ship in minutes.",
  },
  {
    icon: "/figma-assets/feature-design.svg",
    title: "Design-to-code",
    description:
      "Import design tokens and Figma frames. Designers and engineers work from the same source of truth.",
  },
  {
    icon: "/figma-assets/feature-data.svg",
    title: "Connect any datasource",
    description:
      "Postgres, REST, GraphQL, gRPC, or your own SDK. Queries are typed and cached out of the box.",
  },
  {
    icon: "/figma-assets/feature-git.svg",
    title: "Git-native workflow",
    description:
      "Everything is code. Branch, review, and roll back tools the same way you ship your product.",
  },
  {
    icon: "/figma-assets/feature-edge.svg",
    title: "Edge runtime",
    description:
      "Functions deploy to the edge automatically. Sub-50ms responses for tools your whole team relies on.",
  },
  {
    icon: "/figma-assets/feature-cloud.svg",
    title: "Self-host or cloud",
    description:
      "Run Spaceman on your own infra under MIT, or let us host it. SOC 2, SSO, and audit logs included.",
  },
] as const;

const footerLinks = ["Privacy", "Terms", "Security"] as const;

export default function Home() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const nextTheme = theme === "dark" ? "light" : "dark";

  return (
    <main className={`${theme} min-h-screen bg-background text-foreground`}>
      <nav
        aria-label="Primary navigation"
        className="sticky top-0 z-20 border-b border-border bg-[color-mix(in_oklch,var(--background)_82%,transparent)] backdrop-blur-md"
      >
        <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-7 px-5 sm:px-7">
          <div className="flex min-w-0 items-center gap-7">
            <a aria-label="spaceman.sh home" href="#top" className="shrink-0">
              <Image
                src="/figma-assets/spaceman-logo.svg"
                alt="spaceman.sh"
                width={158}
                height={32}
                priority
                className={
                  theme === "light"
                    ? "h-8 w-39.5 brightness-0 invert"
                    : "h-8 w-39.5"
                }
              />
            </a>

            <div className="hidden items-center gap-7 whitespace-nowrap text-sm leading-5 text-muted-foreground md:flex">
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replaceAll(" ", "-")}`}
                  className="transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="inline-flex size-10 items-center justify-center rounded-lg border border-border bg-[color-mix(in_oklch,var(--secondary)_72%,transparent)] text-foreground transition-transform duration-200 ease-out hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-0"
              type="button"
              onClick={() => setTheme(nextTheme)}
              aria-label={`Switch to ${nextTheme} theme`}
              aria-pressed={theme === "light"}
            >
              <Image
                src="/figma-assets/theme-icon.svg"
                alt=""
                width={16}
                height={16}
                className={theme === "light" ? "brightness-0 invert" : ""}
              />
            </button>
            <a
              className="hidden h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium leading-5 text-primary-foreground transition-transform duration-200 ease-out hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:inline-flex"
              href="#start"
            >
              Start building
            </a>
          </div>
        </div>
      </nav>

      <section className="border-b border-border" id="top">
        <div className="mx-auto flex min-h-[80svh] w-full max-w-7xl flex-col justify-center px-5 py-12 sm:px-7 sm:py-14">
          <div className="grid w-full max-w-xl gap-7">
            <h1 className="max-w-[9em] text-balance text-[clamp(2.75rem,6vw,4rem)] font-medium leading-[0.95] tracking-[-0.03em] text-foreground sm:text-[clamp(3.5rem,5vw,4.5rem)]">
              Build internal tools at the speed of thought.
            </h1>
            <p className="max-w-lg text-pretty text-sm leading-6 text-muted-foreground sm:text-[15px] sm:leading-7">
              Spaceman is the open-source platform for developers and designers
              to assemble dashboards, admin panels, and design systems from real
              data, real components, and real code. No lock-in.
            </p>
            <a
              className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium leading-5 text-primary-foreground transition-transform duration-200 ease-out hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              href="#start"
            >
              <span>Start building free</span>
              <Image
                src="/figma-assets/arrow-right.svg"
                alt=""
                width={12}
                height={12}
              />
            </a>
          </div>
        </div>
      </section>

      <section className="border-b border-border" id="products">
        <div className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-7 sm:py-14">
          <div className="grid w-full max-w-2xl gap-4">
            <p className="text-xs leading-4 text-muted-foreground">
              // the platform
            </p>
            <h2 className="text-balance text-[clamp(2.25rem,4vw,3rem)] font-medium leading-none tracking-[-0.025em] text-foreground">
              Everything you need to build, nothing you don&apos;t.
            </h2>
          </div>

          <div className="mt-12 grid gap-px overflow-hidden rounded-xl bg-border sm:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="grid min-h-59 content-start gap-4 bg-card p-7"
              >
                <div className="flex size-12 items-center justify-center rounded-lg border border-border bg-background">
                  <Image src={feature.icon} alt="" width={20} height={20} />
                </div>
                <h3 className="text-lg font-semibold leading-7 tracking-[-0.02em] text-card-foreground">
                  {feature.title}
                </h3>
                <p className="max-w-72.25 text-sm leading-6 text-muted-foreground">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border" id="start">
        <div className="mx-auto grid w-full max-w-4xl justify-items-center gap-7 px-5 py-12 text-center sm:px-7 sm:py-14">
          <h2 className="max-w-210 text-balance text-[clamp(2.25rem,4vw,4rem)] font-medium leading-none tracking-[-0.025em] text-foreground">
            Start building in the next five minutes.
          </h2>
          <p className="max-w-xl text-pretty text-sm leading-7 text-muted-foreground sm:text-[15px]">
            Free forever for individuals and open-source projects. Upgrade when
            your team needs collaboration, SSO, and managed hosting.
          </p>
        </div>
      </section>

      <footer className="text-xs leading-4 text-muted-foreground">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <p>© 2026 Spaceman Labs · MIT License</p>
          <nav
            aria-label="Footer navigation"
            className="flex items-center gap-7"
          >
            {footerLinks.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </main>
  );
}
