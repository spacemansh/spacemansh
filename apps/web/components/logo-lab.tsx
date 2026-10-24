'use client'

import { type ReactNode, useState } from 'react'

import { HeroTitle, heroLogo } from '@/components/hero-title'
import { LogoChip, type LogoChipProps } from '@/components/logo-chip'

type Settings = {
  logo: string
  label: string
  logoSize: number
  logoRadius: number
  smoothing: number
  ring: number
  ringColor: string
  gap: number
  padding: number
  paddingEnd: number
  concentric: boolean
  radius: number
  background: string
  useGradient: boolean
  gradientFrom: string
  gradientTo: string
  gradientAngle: number
  borderWidth: number
  borderColor: string
  color: string
  weight: number
  interval: number
  hold: number
  delay: number
  tilt: number
  zoom: number
  dip: number
  origin: 'label' | 'center'
  paused: boolean
}

const defaults: Settings = {
  logo: heroLogo.logo,
  label: heroLogo.label,
  logoSize: 1,
  logoRadius: 0.3,
  smoothing: 0.6,
  ring: 0.06,
  ringColor: 'var(--foreground)',
  gap: 0.28,
  padding: 0.14,
  paddingEnd: 0.24,
  concentric: true,
  radius: 0.36,
  background: 'var(--muted)',
  useGradient: false,
  gradientFrom: 'var(--muted)',
  gradientTo: 'var(--muted-strong)',
  gradientAngle: 135,
  borderWidth: 0,
  borderColor: 'var(--border)',
  color: '',
  weight: 0,
  interval: 10000,
  hold: 5000,
  delay: 1000,
  tilt: 10,
  zoom: 1.35,
  dip: 0.78,
  origin: 'label',
  paused: false,
}

// lab-only: the three reference chips, to show the props can reach them; the
// brand colours are the reference's, not Spaceman tokens
const presets = {
  Default: {},
  'Cal.com': {
    ring: 0,
    gap: 0.3,
    padding: 0.32,
    paddingEnd: 0.95,
    radius: 0.36,
    background: 'var(--muted)',
    borderWidth: 1,
    borderColor: 'var(--border-strong)',
    weight: 600,
  },
  Airbnb: {
    ring: 0,
    gap: 0.3,
    padding: 0.32,
    paddingEnd: 0.85,
    radius: 0.36,
    background: 'color-mix(in oklch, #ff385c 10%, var(--background))',
    borderWidth: 1,
    borderColor: 'color-mix(in oklch, #ff385c 28%, var(--background))',
    color: '#ff385c',
    weight: 600,
  },
  Meta: {
    ring: 0,
    gap: 0.25,
    padding: 0.32,
    paddingEnd: 0.85,
    radius: 0.36,
    background: 'color-mix(in oklch, #0866ff 12%, var(--background))',
    borderWidth: 1,
    borderColor: 'color-mix(in oklch, #0866ff 30%, var(--background))',
    color: '#1c2b33',
    weight: 500,
  },
} satisfies Record<string, Partial<Settings>>

type NumberKey = {
  [K in keyof Settings]: Settings[K] extends number ? K : never
}[keyof Settings]

type TextKey = {
  [K in keyof Settings]: Settings[K] extends string ? K : never
}[keyof Settings]

type Range = {
  key: NumberKey
  label: string
  min: number
  max: number
  step: number
  unit: string
}

const groups: { title: string; ranges: Range[] }[] = [
  {
    title: 'Logo',
    ranges: [
      {
        key: 'logoSize',
        label: 'size',
        min: 0.5,
        max: 2,
        step: 0.05,
        unit: ' cap',
      },
      {
        key: 'logoRadius',
        label: 'radius',
        min: 0,
        max: 0.5,
        step: 0.01,
        unit: '',
      },
      {
        key: 'smoothing',
        label: 'smoothing',
        min: 0,
        max: 1,
        step: 0.05,
        unit: '',
      },
      { key: 'ring', label: 'ring', min: 0, max: 0.16, step: 0.01, unit: 'em' },
    ],
  },
  {
    title: 'Chip',
    ranges: [
      { key: 'gap', label: 'gap', min: 0, max: 1, step: 0.02, unit: 'em' },
      {
        key: 'padding',
        label: 'padding (around the logo)',
        min: 0,
        max: 0.8,
        step: 0.02,
        unit: 'em',
      },
      {
        key: 'paddingEnd',
        label: 'padding after the name',
        min: 0,
        max: 1.5,
        step: 0.02,
        unit: 'em',
      },
      {
        key: 'radius',
        label: 'radius (when not concentric)',
        min: 0,
        max: 1,
        step: 0.02,
        unit: 'em',
      },
      {
        key: 'borderWidth',
        label: 'border',
        min: 0,
        max: 4,
        step: 0.5,
        unit: 'px',
      },
      {
        key: 'weight',
        label: 'weight (0 inherits)',
        min: 0,
        max: 800,
        step: 100,
        unit: '',
      },
      {
        key: 'gradientAngle',
        label: 'gradient angle',
        min: 0,
        max: 360,
        step: 5,
        unit: '°',
      },
    ],
  },
  {
    title: 'Motion',
    ranges: [
      {
        key: 'interval',
        label: 'interval',
        min: 0,
        max: 20000,
        step: 500,
        unit: 'ms',
      },
      { key: 'hold', label: 'hold', min: 0, max: 10000, step: 250, unit: 'ms' },
      {
        key: 'delay',
        label: 'delay',
        min: 0,
        max: 5000,
        step: 250,
        unit: 'ms',
      },
      { key: 'tilt', label: 'tilt', min: -30, max: 30, step: 1, unit: '°' },
      { key: 'zoom', label: 'zoom', min: 1, max: 2, step: 0.05, unit: '×' },
      { key: 'dip', label: 'dip', min: 0.5, max: 1, step: 0.02, unit: '×' },
    ],
  },
]

const colourFields: { key: TextKey; label: string }[] = [
  { key: 'background', label: 'background (any CSS)' },
  { key: 'gradientFrom', label: 'gradient from' },
  { key: 'gradientTo', label: 'gradient to' },
  { key: 'borderColor', label: 'border colour' },
  { key: 'color', label: 'name colour (empty inherits)' },
  { key: 'ringColor', label: 'ring colour' },
]

const fieldClasses =
  'border-border bg-background text-foreground h-9 rounded-md border px-2 text-sm'

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className='flex flex-col gap-1.5 text-sm'>
      <span className='text-muted-foreground'>{label}</span>
      {children}
    </label>
  )
}

const chipProps = (settings: Settings): LogoChipProps => {
  const {
    useGradient,
    gradientFrom,
    gradientTo,
    color,
    weight,
    concentric,
    radius,
    ...rest
  } = settings

  return {
    ...rest,
    radius: concentric ? 'auto' : radius,
    gradient: useGradient ? [gradientFrom, gradientTo] : undefined,
    color: color || undefined,
    weight: weight || undefined,
  }
}

const textKeys = ['ringColor', 'background', 'borderColor', 'origin'] as const

const numberKeys = [
  'logoSize',
  'logoRadius',
  'smoothing',
  'ring',
  'gap',
  'padding',
  'paddingEnd',
  'gradientAngle',
  'borderWidth',
  'interval',
  'hold',
  'delay',
  'tilt',
  'zoom',
  'dip',
] as const

// the snippet lists the logo and name, then only what differs from the defaults
const snippetFor = (settings: Settings) =>
  [
    '<LogoChip',
    `  logo="${settings.logo}"`,
    `  label="${settings.label}"`,
    ...textKeys.flatMap((key) =>
      settings[key] === defaults[key] ? [] : [`  ${key}="${settings[key]}"`],
    ),
    ...(settings.concentric ? [] : [`  radius={${settings.radius}}`]),
    ...numberKeys.flatMap((key) =>
      settings[key] === defaults[key] ? [] : [`  ${key}={${settings[key]}}`],
    ),
    ...(settings.useGradient
      ? [`  gradient={["${settings.gradientFrom}", "${settings.gradientTo}"]}`]
      : []),
    ...(settings.color ? [`  color="${settings.color}"`] : []),
    ...(settings.weight ? [`  weight={${settings.weight}}`] : []),
    ...(settings.paused ? ['  paused'] : []),
    '/>',
  ].join('\n')

export function LogoLab() {
  const [settings, setSettings] = useState(defaults)
  const [run, setRun] = useState(0)

  const set = <K extends keyof Settings>(key: K, value: Settings[K]) =>
    setSettings((current) => ({ ...current, [key]: value }))

  const props = chipProps(settings)
  const play = { playOnMount: run > 0 }

  return (
    <div className='grid gap-12 lg:grid-cols-3'>
      <form
        aria-label='Chip settings'
        className='flex flex-col gap-8'
        onSubmit={(event) => event.preventDefault()}
      >
        <div className='flex flex-wrap gap-2'>
          {Object.entries(presets).map(([name, preset]) => (
            <button
              className='border-border-strong hover:bg-muted h-9 cursor-pointer rounded-md border px-3 text-sm font-medium'
              key={name}
              onClick={() =>
                setSettings((current) => ({
                  ...defaults,
                  ...preset,
                  logo: current.logo,
                  label: name === 'Default' ? defaults.label : name,
                }))
              }
              type='button'
            >
              {name}
            </button>
          ))}
        </div>

        <fieldset className='flex flex-col gap-4'>
          <legend className='mb-2 font-medium'>Content</legend>
          <Field label='Logo image (a path in public/ or a link; empty for none)'>
            <input
              className={fieldClasses}
              inputMode='url'
              onChange={(event) => set('logo', event.target.value.trim())}
              placeholder='/spaceman.webp or https://…'
              spellCheck={false}
              value={settings.logo}
            />
          </Field>
          <Field label='Name'>
            <input
              className={fieldClasses}
              onChange={(event) => set('label', event.target.value)}
              value={settings.label}
            />
          </Field>
        </fieldset>

        {groups.map((group) => (
          <fieldset className='flex flex-col gap-4' key={group.title}>
            <legend className='mb-2 font-medium'>{group.title}</legend>
            {group.ranges.map(({ key, label, min, max, step, unit }) => (
              <Field key={key} label={`${label} · ${settings[key]}${unit}`}>
                <input
                  className='accent-primary'
                  max={max}
                  min={min}
                  onChange={(event) => set(key, Number(event.target.value))}
                  step={step}
                  type='range'
                  value={settings[key]}
                />
              </Field>
            ))}
            {group.title === 'Chip' ? (
              <>
                <label className='flex items-center gap-2 text-sm'>
                  <input
                    checked={settings.concentric}
                    className='accent-primary'
                    onChange={(event) =>
                      set('concentric', event.target.checked)
                    }
                    type='checkbox'
                  />
                  concentric radius (logo radius + padding)
                </label>
                <label className='flex items-center gap-2 text-sm'>
                  <input
                    checked={settings.useGradient}
                    className='accent-primary'
                    onChange={(event) =>
                      set('useGradient', event.target.checked)
                    }
                    type='checkbox'
                  />
                  gradient background
                </label>
                {colourFields.map(({ key, label }) => (
                  <Field key={key} label={label}>
                    <input
                      className={fieldClasses}
                      onChange={(event) => set(key, event.target.value)}
                      spellCheck={false}
                      value={settings[key]}
                    />
                  </Field>
                ))}
              </>
            ) : null}
            {group.title === 'Motion' ? (
              <>
                <Field label='grow from'>
                  <select
                    className={fieldClasses}
                    onChange={(event) =>
                      set(
                        'origin',
                        event.target.value === 'center' ? 'center' : 'label',
                      )
                    }
                    value={settings.origin}
                  >
                    <option value='label'>the side facing the name</option>
                    <option value='center'>the centre</option>
                  </select>
                </Field>
                <label className='flex items-center gap-2 text-sm'>
                  <input
                    checked={settings.paused}
                    className='accent-primary'
                    onChange={(event) => set('paused', event.target.checked)}
                    type='checkbox'
                  />
                  paused
                </label>
              </>
            ) : null}
          </fieldset>
        ))}

        <div className='flex gap-2'>
          <button
            className='bg-foreground text-background h-10 cursor-pointer rounded-md px-4 text-sm font-medium'
            onClick={() => setRun((count) => count + 1)}
            type='button'
          >
            Play
          </button>
          <button
            className='border-border-strong hover:bg-muted h-10 cursor-pointer rounded-md border px-4 text-sm font-medium'
            onClick={() => setSettings(defaults)}
            type='button'
          >
            Reset
          </button>
        </div>
      </form>

      <div className='flex flex-col gap-12 lg:sticky lg:top-8 lg:col-span-2 lg:self-start'>
        <section aria-label='The chip' className='text-card-title'>
          <p className='text-muted-foreground mb-4 font-mono text-sm'>
            the component
          </p>
          <LogoChip {...props} {...play} key={`chip-${run}`} />
        </section>

        <section aria-label='In a sentence' className='text-card-title'>
          <p className='text-muted-foreground mb-4 font-mono text-sm'>
            in a sentence
          </p>
          <p>
            Design engineer at{' '}
            <LogoChip {...props} {...play} key={`line-${run}`} />
          </p>
        </section>

        <section aria-label='Hero preview'>
          <p className='text-muted-foreground mb-4 font-mono text-sm'>
            in the home page hero
          </p>
          <HeroTitle as='p' key={`hero-${run}`} logo={{ ...props, ...play }} />
        </section>

        <pre className='bg-inset inset-ring-border overflow-x-auto rounded-lg p-4 font-mono text-sm inset-ring'>
          {snippetFor(settings)}
        </pre>
      </div>
    </div>
  )
}
