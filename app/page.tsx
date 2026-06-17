"use client";

import Image from "next/image";
import { useState } from "react";

const navItems = ["Products", "Integrations", "Docs", "Open Source"];

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
];

export default function Home() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const nextTheme = theme === "dark" ? "light" : "dark";

  return (
    <main className="spaceman-page" data-theme={theme}>
      <nav className="spaceman-nav" aria-label="Primary navigation">
        <div className="spaceman-nav__inner">
          <div className="spaceman-nav__left">
            <a className="spaceman-brand" href="#top" aria-label="spaceman.sh home">
              <Image
                src="/figma-assets/spaceman-logo.svg"
                alt=""
                width={158}
                height={32}
                priority
              />
            </a>

            <div className="spaceman-nav__links">
              {navItems.map((item) => (
                <a href={`#${item.toLowerCase().replaceAll(" ", "-")}`} key={item}>
                  {item}
                </a>
              ))}
            </div>
          </div>

          <div className="spaceman-nav__actions">
            <button
              className="spaceman-icon-button"
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
              />
            </button>
            <a className="spaceman-button spaceman-button--nav" href="#start">
              Start building
            </a>
          </div>
        </div>
      </nav>

      <section className="spaceman-hero" id="top">
        <div className="spaceman-container">
          <div className="spaceman-hero__copy">
            <h1>Build internal tools at the speed of thought.</h1>
            <p>
              Spaceman is the open-source platform for developers and designers
              to assemble dashboards, admin panels, and design systems — from real
              data, real components, and real code. No lock-in.
            </p>
            <a className="spaceman-button spaceman-button--hero" href="#start">
              <span>Start building free</span>
              <Image
                src="/figma-assets/arrow-right.svg"
                alt=""
                width={16}
                height={16}
              />
            </a>
          </div>
        </div>
      </section>

      <section className="spaceman-features" id="products">
        <div className="spaceman-container">
          <div className="spaceman-section-heading">
            <p>{"// the platform"}</p>
            <h2>Everything you need to build, nothing you don&apos;t.</h2>
          </div>

          <div className="spaceman-feature-grid">
            {features.map((feature) => (
              <article className="spaceman-feature-card" key={feature.title}>
                <div className="spaceman-feature-card__icon">
                  <Image src={feature.icon} alt="" width={20} height={20} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="spaceman-cta" id="start">
        <div className="spaceman-container spaceman-cta__inner">
          <h2>Start building in the next five minutes.</h2>
          <p>
            Free forever for individuals and open-source projects. Upgrade when
            your team needs collaboration, SSO, and managed hosting.
          </p>
        </div>
      </section>

      <footer className="spaceman-footer">
        <div className="spaceman-footer__inner">
          <p>© 2026 Spaceman Labs · MIT License</p>
          <nav aria-label="Footer navigation">
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms</a>
            <a href="#security">Security</a>
          </nav>
        </div>
      </footer>
    </main>
  );
}
