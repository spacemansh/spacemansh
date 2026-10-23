# Registry release checklist

## Local review

- Review all uncommitted changes; commit only after approval.
- Run `pnpm install --frozen-lockfile`, `pnpm quality` and `pnpm build`.
- Confirm `pnpm registry:check` passes with 36 items and no theme payload.
- Install every item into a clean shadcn project with custom aliases. Confirm
  no base colors, fonts or radius are injected and build the consumer project.
- Check cards, picker and toggle in light and dark, including the local Worker
  preview from `pnpm preview`. Check clipboard interaction and browser errors.

## Authorized publication

- Deploy only after approval, then check `/`, `/preview-cards`,
  `/r/registry.json` and every published item URL on https://spaceman.sh.
- Verify `/r/theme.json` is absent and the catalogue has 36 items.
- Repeat namespace installation against the public endpoint.
- Submit the directory entry only after the public endpoint checks pass.
  Follow the [shadcn directory instructions](https://ui.shadcn.com/docs/registry/registry-index):
  update `apps/v4/registry/directory.json`, run `pnpm validate:registries`,
  then prepare the submission for review.

## Directory entry to prepare

The proposed entry is [registry-directory-entry.json](registry-directory-entry.json).
It follows the current directory fields and uses the existing site logo.

The intended registry identity is `@spaceman`, its homepage is
https://spaceman.sh, repository https://github.com/spacemansh/spacemansh, and
URL template `https://spaceman.sh/r/{name}.json`. The directory description
should describe React components, animated theme controls, clipboard controls
and preview cards. Do not advertise a base theme or font installation.

This file prepares the release; it does not deploy or submit anything.
