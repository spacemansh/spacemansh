'use client'

import { useCallback, useState } from 'react'

import { BounceWrapper } from '@/components/bounce-wrapper'
import { GalleryCard } from '@/components/gallery-card'
import { ActionRow, StepButton, VisitLink } from '@/components/tour-actions'
import { onReplayCards } from '@/lib/replay-cards'
import { products } from '@/lib/site'

import './hero-cards.css'

export function HeroCards() {
  const [replay, setReplay] = useState(0)

  // the Explore tour asks for the pop-in again when it closes
  const listen = useCallback((node: HTMLDivElement | null) => {
    if (!node) return

    return onReplayCards(() => setReplay((count) => count + 1))
  }, [])

  return (
    <div
      className='relative mt-18 flex min-h-40 flex-1'
      data-hero-cards
      ref={listen}
    >
      <BounceWrapper
        className='flex-1'
        labels={products.map((product) => product.name)}
        openAttribute='data-cards-open'
        renderCaption={(i) => {
          const product = products[i]

          if (!product) return null

          return (
            <>
              <p className='text-muted-foreground font-mono text-sm'>
                {String(i + 1).padStart(2, '0')} /{' '}
                {String(products.length).padStart(2, '0')} · {product.domain}
              </p>
              <h2 className='text-card-title font-normal'>{product.name}</h2>
              <p className='text-copy md:text-copy-lg text-muted-foreground max-w-130 text-pretty'>
                {product.description}
              </p>
              <ActionRow className='justify-center'>
                <VisitLink href={product.href} name={product.name} />
                <StepButton data-bounce-close>Back to all</StepButton>
              </ActionRow>
            </>
          )
        }}
        replayKey={replay}
      >
        {products.map((product, i) => (
          <GalleryCard
            index={i}
            item={{
              id: product.id,
              alt: product.name,
              label: product.name,
              detail: product.domain,
              href: product.href,
            }}
            key={product.id}
          />
        ))}
      </BounceWrapper>
    </div>
  )
}
