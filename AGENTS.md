# AGENTS.md - PokéCards

## Quick Start

```bash
pnpm install        # Use pnpm (node-linker=hoisted in .npmrc)
pnpm dev             # Dev server at http://localhost:4322
pnpm build           # Production build to /dist
pnpm preview         # Preview production build
```

## Reference

- `CLAUDE.md` - Available AI skills (accessibility, astro, seo, tailwind, etc.)
- `ANALISIS/ARQUITECTURA.md` - Full system architecture (v2.0)
- `ANALISIS/SEO.md` - SEO audit (100/100, all implemented)

## Project Structure

- **Framework**: Astro 6.1.7 with **SSR mode** (`output: "server"`)
- **Adapter**: Vercel (`@astrojs/vercel@10.0.4`)
- **Styling**: Tailwind CSS 4.2.2 via `@tailwindcss/vite`
- **Auth**: `auth-astro@4.2.0` with Google OAuth only
- **Database**: Turso (libSQL) - requires `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN`
- **API**: TCGdex SDK 2.8.0 (`@tcgdex/sdk`) for Pokémon TCG data

## Key Paths

| Path              | Purpose                                           |
| ----------------- | ------------------------------------------------- |
| `src/pages/`      | Astro pages + API routes                          |
| `src/components/` | Reusable UI components                            |
| `src/handlers/`   | Business logic (PokeCardHandler, UserListHandler) |
| `src/adapters/`   | Data access (TCGdex, Turso)                       |
| `src/models/`     | TypeScript types                                  |
| `ANALISIS/`       | Architecture + SEO docs                           |

## Alias

`@/` → `./src/` (set in `tsconfig.json` and `astro.config.mjs`)

## Environment

Copy `.env.example` to `.env` and fill:

- `AUTH_GOOGLE_ID` + `AUTH_GOOGLE_SECRET` (Google OAuth)
- `TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN` (Turso DB)
- `AUTH_SECRET` (random string for session encryption)
- `AUTH_TRUST_HOST=true`

## Commands Order

```bash
pnpm dev              # Dev server (port 4322)
# Edit files
pnpm build            # Verify production build
```

## Known Quirks

- **`lang` property**: Some pages reference `Astro.locals.lang` which may not exist in TypeScript types. This is a known LSP error but runtime works.
- **LSP errors**: Expect `Property 'lang' does not exist on type 'Locals'` in `sets.astro`, `explore.astro`, `search.astro`, `card/[cardId].astro`, `index.astro`. These are pre-existing type issues.
- **`output: "server"`**: This is an SSR project, not static. Use `pnpm build` not `astro build --static`.
- **API cache**: `src/adapters/cardApi/ApiCache.ts` caches TCGdex responses for 24 hours in memory.
- **Pokedex lists**: Special list type `"pokedex"` auto-generates slots 1-1025 using `src/utils/UserListUtils.ts`.

## Testing

No test framework configured. Verify by:

1. `pnpm build` - must complete without errors
2. Check pages render: `/`, `/sets`, `/set/base1`, `/card/base1-1`
3. Lighthouse audit for SEO (100/100 achieved - see `ANALISIS/SEO.md`)

## Important Files

- `astro.config.mjs` - Framework config, Vercel adapter, Tailwind plugin, `@/` alias
- `auth.config.ts` - Google OAuth setup, JWT session with user ID
- `src/layouts/Layout.astro` - Global SEO (canonical, Open Graph, Twitter Cards, JSON-LD Organization)
- `src/adapters/bbdd/TursoAdapter.ts` - All DB queries (users, lists, list_cards)
- `ANALISIS/ARQUITECTURA.md` - Full architecture v2.0
- `ANALISIS/SEO.md` - SEO audit (100/100)
