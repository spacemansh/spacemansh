import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'

import { registryItemSchema, registrySchema } from 'shadcn/schema'

const readJson = async (path) => JSON.parse(await readFile(path, 'utf8'))

const catalogue = registrySchema.parse(await readJson('registry.json'))

const names = new Set(catalogue.items.map((item) => item.name))

assert.equal(names.size, catalogue.items.length, 'Duplicate registry names')

assert(!names.has('theme'), 'The site theme must stay local')

assert.deepEqual(
  await readJson('public/r/registry.json'),
  await readJson('registry.json'),
  'Rebuild the registry index',
)

const expectedFiles = [...names]
  .map((name) => `${name}.json`)
  .concat('registry.json')
  .sort()

assert.deepEqual(
  (await readdir('public/r')).filter((name) => name.endsWith('.json')).sort(),
  expectedFiles,
  'Stale or missing registry artifacts',
)

const visiting = new Set()

const visited = new Set()

function visit(name) {
  assert(!visiting.has(name), `Circular registry dependency: ${name}`)

  if (visited.has(name)) return
  visiting.add(name)
  const item = catalogue.items.find((entry) => entry.name === name)

  for (const dependency of item.registryDependencies ?? []) {
    assert(
      dependency.startsWith('@spaceman/'),
      `Unqualified registry dependency: ${dependency}`,
    )
    const target = dependency.slice('@spaceman/'.length)
    assert(names.has(target), `Missing registry dependency: ${dependency}`)
    visit(target)
  }

  visiting.delete(name)
  visited.add(name)
}

for (const item of catalogue.items) {
  visit(item.name)
  assert.notEqual(item.type, 'registry:theme', 'Do not publish site themes')
  assert(
    !item.cssVars && !item.fonts,
    `Unexpected global tokens or fonts: ${item.name}`,
  )

  const built = registryItemSchema.parse(
    await readJson(`public/r/${item.name}.json`),
  )

  const expected = {
    ...item,
    $schema: 'https://ui.shadcn.com/schema/registry-item.json',
  }

  if (item.files)
    expected.files = await Promise.all(
      item.files.map(async (file) => ({
        ...file,
        content: await readFile(file.path, 'utf8'),
      })),
    )
  assert.deepEqual(
    built,
    registryItemSchema.parse(expected),
    `Stale payload: ${item.name}`,
  )
  const ownFiles = new Set((item.files ?? []).map((file) => file.path))
  const dependencyFiles = new Set()

  function collect(name) {
    const entry = catalogue.items.find((candidate) => candidate.name === name)

    for (const file of entry.files ?? []) dependencyFiles.add(file.path)

    for (const dependency of entry.registryDependencies ?? [])
      collect(dependency.slice('@spaceman/'.length))
  }

  collect(item.name)

  for (const file of built.files ?? []) {
    const content = file.content ?? ''
    assert(!content.includes('spaceman-'), `Site-only styling in ${file.path}`)

    for (const match of content.matchAll(/from\s+['"]([^'"]+)['"]/g)) {
      const specifier = match[1]

      if (specifier === 'react' || specifier === '@/lib/utils') continue

      if (specifier.startsWith('@/registry/')) {
        const target = specifier.slice(2)
        assert(
          [...ownFiles, ...dependencyFiles].some(
            (path) => path === `${target}.tsx` || path === `${target}.ts`,
          ),
          `Undeclared source dependency: ${specifier}`,
        )
      } else if (!specifier.startsWith('.') && !specifier.startsWith('@/')) {
        const npmName = specifier.startsWith('@')
          ? specifier.split('/').slice(0, 2).join('/')
          : specifier.split('/')[0]

        assert(
          (item.dependencies ?? []).some(
            (dependency) =>
              dependency === npmName || dependency.startsWith(`${npmName}@`),
          ),
          `Undeclared npm dependency: ${npmName} in ${item.name}`,
        )
      } else if (specifier.startsWith('@/')) {
        assert.fail(`Site-only import: ${specifier} in ${item.name}`)
      }
    }

    assert(
      !/(?<![\w-])(?:bg-inset|border-border-strong|bg-border-strong|bg-muted-strong|text-primary-ink|bg-tag|text-tag-foreground|shadow-lift)(?![\w-])/.test(
        content,
      ),
      `Missing standard theme fallback: ${file.path}`,
    )
  }
}

console.log(
  `Validated ${names.size} items: schemas, dependencies, source payloads and portable styling.`,
)
