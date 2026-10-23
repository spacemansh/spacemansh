# Local verification — 2026-10-07

Verified on branch `feat/registry-installation`; changes remain uncommitted.

- Frozen lockfile install passed. Pinning direct dependencies changed only
  importer specifiers in the lockfile, preserving all resolved versions.
- Lint and formatting passed with `pnpm quality`.
- Registry validation passed for all 36 items: schemas, dependency graph,
  generated contents, artifact inventory and portable styling checks.
- Production Next.js build and OpenNext Cloudflare build passed.
- Local Worker preview served the homepage, gallery and all 36 item payloads.
  `/r/theme.json` returned 404. The gallery rendered 66 cards (two controls
  across 33 variants) with no removed theme listing.
- Installed all 36 items using shadcn 4.11.0 into a fresh Next.js project with
  `~/` aliases and a standard neutral shadcn theme. Base root/dark declarations,
  radius, fonts and body styles were preserved. Only accent selectors were added.
- Consumer build passed; all 33 card variants rendered. Light/dark switching,
  violet accent selection and clipboard confirmation worked without browser errors.
- Inspected desktop light/dark and mobile site screenshots, plus light/dark
  consumer screenshots. The site stylesheet was not changed.

The initial bulk install hit the temporary Python server's connection limit;
retrying with a Node HTTP server completed successfully. No registry workaround
or source change was required for that local fixture failure.

Public deployment and directory submission remain pending review. These local
checks do not establish that the live endpoint contains the new catalogue.
