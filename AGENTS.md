# spacemansh agent guide

Behavioural guidelines for coding agents working in spacemansh. Project and
domain knowledge lives in [CLAUDE.md](CLAUDE.md); design rules live in
[DESIGN.md](DESIGN.md). Plans for anything Spaceman live in `../.plan/`, outside
this repository.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks,
use judgment.

## 1. Think before coding

**Ask; do not assume. Do not hide confusion. Surface tradeoffs.**

Before implementing:

- State material assumptions explicitly.
- If intent, architecture, requirements, ownership, or scope is unclear, ask
  before writing code.
- If multiple reasonable interpretations exist, present them instead of choosing
  silently.
- When running unattended, use the safest reasonable interpretation, proceed only
  when the choice is reversible and within scope, and record the assumption.
- If a simpler approach exists, say so.
- Push back when the requested implementation creates avoidable accessibility,
  performance, brand, or maintenance risk.
- Flag uncertainty explicitly. Confidence without evidence is not certainty.
- When useful, run a small, localized, low-risk experiment and report the
  hypothesis and result before committing to a larger direction.
- Suggest durable improvements when they materially outperform a tactical change,
  but do not implement the expanded scope without authorization.

The site is pre-launch and still moving. Asking costs a message; guessing costs
a rebuild.

## 2. Simplicity first

**Use the minimum design that fully solves the problem.**

- Do not add features, sections, or pages beyond the request.
- Do not create abstractions for a single use unless they enforce a real
  boundary.
- Do not add speculative flexibility or configuration.
- Do not add handling for impossible states.
- Do not reach for a dependency when a few lines of CSS or a plain component will
  do. This is a static marketing site; the dependency list should stay boring.
- Use deeper designs for genuinely hard problems — interruptible motion, touch
  and pointer input, reduced motion, and theme parity.
- If an implementation is substantially larger than the problem requires,
  simplify it.

Ask: "Would a senior engineer consider this unnecessarily complicated?" If yes,
revise it.

## 3. Surgical changes

**Touch only what the task requires. Clean up only what your changes make
obsolete.**

- Do not reformat or refactor unrelated areas.
- Match existing repository style and patterns.
- Preserve user work and unrelated uncommitted changes.
- Remove imports, variables, functions, and files made unused by your own
  changes.
- Do not remove pre-existing dead code unless asked.
- Surface unrelated bugs, unsafe patterns, and design smells to the user as
  separate follow-up work — do not silently fix them.

Every changed line should trace to the requested outcome or a necessary
supporting invariant.

## 4. Goal-driven execution

**Define success, implement, verify, and loop until the evidence matches the
goal.**

Translate requests into verifiable outcomes:

- "Fix the layout" means look at the rendered page at the relevant breakpoints,
  not just at the diff.
- "Add a section" means it renders in **both light and dark mode**, at mobile and
  desktop widths, with visible focus states.
- "Change a token" means every surface using it still meets contrast, and
  spaceman-ui's `pnpm tokens:check` passes.
- "Refactor" means the rendered output is unchanged — verify before and after.
- "Change an animation" means recording it frame by frame in both directions,
  interrupted mid-flight, and under reduced motion, at phone and desktop widths.
- "Deploy" means the Worker build succeeds, not only `next build`.

For multi-step work, state a short plan:

```text
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Do not call work complete from static review when a realistic execution path can
be tested.

## 5. Testing

- **There is no test suite.** The signals are `pnpm quality`, `pnpm typecheck`,
  `pnpm build`, and looking at the rendered page.
- **NEVER write unit tests after you write code.**
  - Tautological tests considered harmful.
  - Change-detector tests considered harmful.
  - Do not create regression tests for bug fixes without a genuine gap in
    behaviour testing.
- If you must test a system in isolation, **FIRST** write all the ways it could
  fail, **THEN** write the code. Every test must answer:
  - What observable behaviour, invariant, or independent contract does it
    protect?
  - What credible regression makes it fail?
- Highly prefer E2E checks in a real browser. At the end, produce a verifiable
  and repeatable artifact: screenshots in both themes, or a per-frame log of the
  animated values.

## 6. Human communication and commits

- Use the `/reply` skill when working with a human on this project. Read the
  skill and follow its plain-language rules. Keep file paths, commands, and
  identifiers exact.
- Use the `/auto-commit` skill for commits. Read the skill before staging work.
  Keep each change in a separate, coherent commit. Keep fixes, tests, and release
  notes separate as the skill requires.
- Stage explicit paths. Preserve unrelated changes and existing stashes.
- Do not push unless the human has authorized the push. Honor authorization
  already given for the current task and branch.
- **`pnpm deploy` publishes the live site.** Never run it unless explicitly
  asked.
- Write plans, briefs and cross-repository notes in `../.plan/`, never in this
  repository.

## 7. Comments

Default to no comment. Write one only where the code cannot say it itself: a
decision whose obvious refactor reintroduces a bug, or a non-obvious constraint.

- One line, lowercase. Never a multi-line block.
- Never restate what the next line does. If the code reads fine, delete the
  comment.
- No JSDoc, no section banners, no `// handle X` above a function called
  `handleX`.

<!-- BEGIN:turborepo-agent-rules -->

# This is NOT the Turborepo you know

Turborepo configuration, task behavior, and CLI commands can vary between installed versions and may differ from your training data. Resolve the `turbo` package from this file's directory or relevant workspace; in monorepos, it may not be visible from the repository root. For example, run `node -p "require.resolve('turbo/package.json')"` from a workspace that depends on `turbo`.

Read `docs/README.md` inside that installed package first, then read the relevant pages from its `docs/` directory before changing Turborepo configuration or commands. Heed deprecation notices. These bundled docs match the installed package version and are available without network access.

This block is written and re-added by `turbo` before repository-scoped commands when an AI agent is detected. In the Turborepo source repository, its template is defined in `crates/turborepo-cli/src/cli/agent_guidance.rs`. Removing the managed block while updates are enabled means a later qualifying invocation will add it again. Set `"agentGuidance": false` in the root `turbo.json` or `turbo.jsonc` to opt out; this does not remove an existing block. Keep the block committed with your work to avoid an uncommitted change on the next agent invocation.
<!-- END:turborepo-agent-rules -->
