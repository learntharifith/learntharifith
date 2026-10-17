# Learntharifith — Amazigh Riffian Language Teaching Site (Next.js rebuild)

Project: Rebuild dev.learntharifith.com (currently a WordPress clone) as a modern,
full-stack Next.js 16 application with the best UX for teaching the Amazigh Riffian
language. Single-page experience on `/` with tab-based navigation
(Home / Learn / Culture / Shop / Courses / Support), lesson modal with YouTube
embeds, progress tracking, search & filters, Amazigh-inspired design.

Source data extracted from the original WordPress lessons page (post 36):
- 25 video lessons across 4 levels: intro (3), beginner (8), intermediate (9), culture (5)
- Ko-fi support links (K1, K2)
- Menu: Home / Learn / Culture / Shop / Online Courses

---
Task ID: 1
Agent: main (Z.ai Code)
Task: Set up Prisma schema (Lessons, Articles, Products, Courses) and seed with the 25 Riffian lessons + culture/shop/courses data

Work Log:
- Designing schema for lessons, articles, products, courses + user progress
- Seeding all 25 lessons extracted from the WP lessons page (post 36)

Stage Summary:
- (in progress)

Work Log:
- Created Prisma schema with Lesson, Article, Product, Course, UserProgress models
- Ran db:push to sync schema; seeded all 25 Riffian lessons (3 intro, 8 beginner,
  9 intermediate, 5 culture) + 4 articles + 6 merch products + 3 online courses
- Built Amazigh-inspired design system in globals.css: terracotta/saffron/olive/henna
  palette, warm cream backgrounds, dark mode with rich brown night-sky tones,
  custom utility classes (lt-sand-bg, lt-zigzag, lt-dots, level chips, marquee,
  fade-up, gradient text, card-hover, custom scrollbar)
- Created decorative SVG components: AmazighBand (woven rug divider), AmazighStar
  (eight-point khatam logo), AmazighField (background diamond field), TifinaghStrip
  (marquee of Tifinagh glyphs)
- Updated layout.tsx with SEO metadata, Geist fonts, ThemeProvider (next-themes),
  Sonner Toaster
- Built SiteHeader: sticky, logo + Tifinagh wordmark, tab nav (Home/Learn/Culture/
  Shop/Courses/Support), dark-mode toggle, mobile hamburger drawer, animated
  underline active state
- Built SiteFooter: sticky-to-bottom (flex min-h-screen + flex-1 main), Tifinagh
  marquee strip, 4-column links, Ko-fi support buttons, Amazigh band divider
- Built Hero: gradient headline, Tifinagh tagline (ⵜⴰⵔⵉⴼⵉⵜ), dual CTAs, stats,
  featured-lesson stack, generated Amazigh art as subtle background medallion
- Built LearnSection: search box, 5 level filter chips, progress bar (X/25, %),
  grouped-by-level layout, lesson cards with YouTube thumbnails + level chips +
  duration + completion badge
- Built LessonModal: YouTube nocookie embed (autoplay), mark-as-complete with
  API persistence, prev/next navigation, onInteractOutside/onEscapeKeyDown
  preventers so the iframe doesn't accidentally close it
- Built CultureSection: Rif-mountains banner image, 5 culture videos grid, 4
  articles with modal reader
- Built ShopSection: 6 products with Tifinagh-glyph covers, prices, Ko-fi buy
  links, "100% revenue funds free lessons" note
- Built CoursesSection: 3 course cards with ratings/students/duration, free
  beginner CTA
- Built SupportSection: two Ko-fi cards (one-off + monthly), 3 "other ways"
  cards, "free forever" promise panel
- Built HomeContent: hero + 4-step path overview + featured lessons + continue-
  learning strip + culture/courses previews + support CTA
- Created API routes: /api/lessons, /api/progress (GET+POST, browser-id keyed),
  /api/articles, /api/products, /api/courses
- Wired page.tsx: boot effect generates persisted browser id, fetches lessons +
  progress; Zustand store drives tab/level/query/completed/openLesson state
- Generated 2 authentic Amazigh images via image-generation skill (hero geometric
  art + Rif mountains culture banner)
- Ran ESLint → clean (0 errors, 0 warnings)

Self-verification with Agent Browser:
- Home page renders: hero, path cards (3/8/9/5 counts), featured lessons, previews ✓
- Learn tab: search ("greetings" → 1 result), filters, progress bar updates ✓
- Lesson modal: YouTube iframe loads, mark-as-complete persists to DB (POST 200),
  button toggles to "Completed", progress bar shows 1/25 (4%) ✓
- Culture tab: banner image + 5 culture videos + 4 articles ✓
- Shop tab: 6 products with prices ✓
- Courses tab: 3 courses with Enrol buttons ✓
- Support tab: Ko-fi cards + other ways + promise panel ✓
- Dark mode: html.dark applied, VLM confirms "rich brown tones, accents pop" ✓
- Mobile (390px): fully responsive, hamburger menu, stacked layout ✓
- VLM analysis: "high-quality, production-ready design", 8/10 polish ✓
- Sticky footer: min-h-screen flex flex-col + flex-1 main pattern ✓
- Dev log: no errors ✓

Stage Summary:
- Production-ready Next.js 16 app replacing the WordPress clone for
  dev.learntharifith.com, teaching the Amazigh Riffian language.
- 25 video lessons across 4 levels with search, filter, progress tracking
  (browser-id keyed, persisted to SQLite via Prisma).
- Amazigh-inspired design: terracotta/saffron/olive palette, Tifinagh script,
  geometric SVG patterns, generated cultural imagery, full dark mode.
- Single-page tab architecture (Home/Learn/Culture/Shop/Courses/Support) with
  lesson modal, all on the / route.
- Ko-fi support integration (both summary links from the WP site).
- Clean lint, verified end-to-end in the browser.
