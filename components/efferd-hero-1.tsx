import { ArrowRight, BoxIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function EfferdHeroOne() {
  return (
    <section className="efferd-hero" id="top">
      <div className="efferd-hero__shade" aria-hidden="true" />
      <div className="efferd-hero__frame" aria-hidden="true">
        <span />
        <span />
      </div>

      <div className="efferd-hero__content">
        <div className="efferd-hero__rails" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>

        <a className="efferd-hero__badge" href="#products">
          <BoxIcon aria-hidden="true" />
          <span>Open-source developer products</span>
          <ArrowRight aria-hidden="true" />
        </a>

        <h1
          className={cn(
            "efferd-hero__title",
            "text-balance",
          )}
        >
          Tools for interfaces
          <br />
          that arrive considered.
        </h1>

        <p className="efferd-hero__body">
          Libraries, review utilities, and design-minded workflows for teams who
          want source code and surface quality to move together.
        </p>

        <div className="efferd-hero__actions">
          <Button asChild className="efferd-hero__button">
            <a href="#products">
              View Products
              <ArrowRight data-icon="inline-end" aria-hidden="true" />
            </a>
          </Button>
          <Button asChild variant="ghost" className="efferd-hero__button efferd-hero__button--ghost">
            <a href="#standards">Read Standards</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
