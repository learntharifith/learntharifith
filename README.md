# Learntharifith — Amazigh Riffian Language Learning

A modern, full-stack Next.js 16 application for teaching **Tarifit** (the Riffian Amazigh language), replacing the legacy WordPress site at learntharifith.com.

## What's inside

- **25 video lessons** across 4 levels: Start here, Beginner, Intermediate, Culture & stories
- **Lesson player** with YouTube embeds, prev/next navigation, and progress tracking
- **Search & filter** by level, with a progress bar saved per-browser (no login required)
- **Culture** articles, **Shop** merch, **Courses** paths, and **Ko-fi support** integration
- **Amazigh-inspired design**: terracotta/saffron/olive palette, Tifinagh script, geometric SVG patterns, dark mode

## Tech stack

- Next.js 16 (App Router, standalone output) + TypeScript 5
- Tailwind CSS 4 + shadcn/ui (New York)
- Prisma ORM + SQLite
- Zustand (client state) + TanStack Query (server state)
- next-themes (dark mode), Sonner (toasts), Framer Motion

## Local development

```bash
bun install
bun run db:push     # create the SQLite schema
bun run scripts/seed.ts   # seed 25 lessons + articles + products + courses
bun run dev         # http://localhost:3000
```

## Deploy to production

See `deploy/` for the server-side deploy script and OpenLiteSpeed reverse-proxy config.

```bash
# on the server, after cloning:
bash deploy/deploy.sh
```

## Project structure

```
src/
  app/           # routes, API endpoints, layout, globals.css
  components/    # site header/footer, sections, lesson card/modal, UI kit
  lib/           # db client, zustand store, utils
prisma/          # schema.prisma
scripts/         # seed.ts
deploy/          # deploy.sh, deploy.ps1, ols-reverse-proxy.conf
public/images/   # generated Amazigh art
```

---

Free Riffian lessons, forever. ⵜⴰⵔⵉⴼⵉⵜ
