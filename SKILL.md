---
name: decoy-frontend
description: >-
  Build a polished demo landing page for a product in the VISUAL STYLE of one
  or more reference websites. Use whenever the user wants to create a demo site,
  landing page, or marketing page "in the style of" another site, clone/borrow a
  website's look and feel, or turn a product into a styled cinematic/animated
  page. The skill interviews the user first (their site, reference sites, fonts,
  theme, and more), then researches the references and builds a real, runnable
  Next.js + GSAP project with rich scroll animations. Ships a buildable starter
  template (Next + single-file HTML), scaffold/verify/screenshot scripts, an
  evidence-driven style extractor, a pattern & component catalog, and optional
  one-command deploy + Lighthouse audit.
---

# Style Demo Builder

Turn any product into a beautiful demo landing page that **borrows the visual
style of a reference website** — its palette, typography, layout patterns, and
motion — while telling the user's own product story.

Golden rule: **clone the *style*, never the *content*.** The reference site
supplies the look; the user's site/product supplies the words. The output must
not reproduce the reference's copy, and must not just re-skin the user's
existing layout either — it should be a fresh page in the borrowed style.

> **This is the #1 mistake.** Copying the *reference's* palette but keeping the
> *user's own site's* section skeleton (its numbered feature blocks, its card
> motifs, its ordering) produces a page that still reads as the user's original
> site in new colors. Recoloring is not restyling. You must borrow the
> reference's **layout skeleton and signature components**, not just its hex
> values. Always research the user's OWN site's structure too (Step 2) so you
> know what to diverge from.

**Supported layout patterns** (pick per request):
- *Single borrowed style* — the whole page in one reference's look.
- *Section-by-section style tour* — each section borrows a different site's
  identity (e.g. hero → projectdiscovery, pricing → linear, CTA → superhuman).
  Give each `<section>` its own scoped theme block: background, accent, type,
  radius, and a signature component. Great when the user says "each section its
  own theme". Keep them all coherent (e.g. all-dark) unless they want contrast.

## Toolkit (ships with this skill — use it, don't re-derive it)

Paths are relative to this skill directory. Prefer these over hand-writing from
scratch; they encode the gotchas below so you don't re-hit them.

- `template/` — a **buildable** Next 14 + GSAP + Lenis scaffold with the motion
  layer already wired (`SmoothScroll`, `ScrollProgress`, `Reveal`, tokenized
  `globals.css`, a starter `page.tsx`). Every build starts here.
- `template-html/index.html` — the same tokens + motion layer as ONE
  self-contained file (GSAP/Lenis via CDN). Use when the user picks single-file
  HTML output; no scaffold/install needed.
- `scripts/new-demo.sh <dest>` — copy the template to `<dest>` and `npm install`.
- `scripts/verify.sh <dir>` — Step 5 as a script: refuses to build while `next
  dev` runs, type-checks, builds the static export, greps `out/index.html`.
- `scripts/extract-style.js` — run in an open reference page via the Chrome
  tools' `javascript_tool` to pull real fonts/colors/radii/scale into a spec
  draft (Step 2).
- `scripts/shoot.mjs <url>` — headless Playwright screenshots, for display-less
  sandboxes/CI only. Locally, screenshot with the Chrome tools instead.
- `scripts/deploy.sh [dir] [--prod]` — ship the built static dir (`out/`, or the
  single-file HTML's folder) to a live URL. Vercel by default; it's just static
  files, so any host works. Outward-facing — build first and confirm with the
  user before `--prod`.
- `scripts/audit.sh <url>` — Lighthouse scores (perf/a11y/best-practices/SEO)
  against a dev server or a deploy.
- `references/patterns.md` — animation recipes + signature-component blueprints,
  chosen by the reference's energy.

## Step 1 — Interview the user (do this first)

Use the **AskUserQuestion** tool. Ask these together. The first two are free-text
(tell the user to type them via the "Other" field or answer in chat); the rest
are multiple-choice with sensible options. Always include an "add your own"
path.

1. **Your website / product** — a URL (e.g. `www.acme.com`) or a short
   description. This is the *content* source.
2. **Reference website(s)** — one or more URLs whose *style* to borrow
   (e.g. `granola.ai`, `linear.app`, `stripe.com`). This is the *look* source.
3. **Font style** *(multi-select)* — e.g. Editorial serif · Clean sans-serif ·
   Monospace/technical · Rounded/friendly · Match the reference.
4. **Theme** *(optional, multi-select)* — e.g. Light / paper · Dark / cinematic ·
   Bold color-block · Minimal / lots of whitespace · Match the reference.

Add these extra questions (they materially change the result):

5. **Vibe / tone** — Calm & editorial · Cinematic & dramatic · Playful &
   optimistic · Corporate & trustworthy.
6. **Motion level** — Subtle (gentle reveals) · Rich scroll animation
   (parallax, scroll-linked sections) · Interactive (clickable demo the visitor
   drives). Default: Rich scroll animation.
7. **Accent color** — Match the reference · a specific color · let me choose.
8. **Depth** — Hero + a few sections · Full story (tell everything: how it
   works, features, proof, CTA). Default: Full story.
9. **Output** — Runnable Next.js project (recommended) · Single self-contained
   HTML file.

If the user already supplied some answers in their message, don't re-ask those.

## Step 2 — Research the reference site(s)

You must actually look at the reference, not guess.

1. Try `mcp__workspace__web_fetch` first. Marketing sites are usually
   client-rendered, so it often returns empty — that's expected.
2. Switch to the Chrome browser tools (load via ToolSearch if deferred):
   `navigate` → `get_page_text` for copy/structure, then `computer` screenshots
   (scroll down and capture 3–5 frames) to read the actual **visual** language.
   Dismiss cookie banners with the most privacy-preserving option.
3. Get an **evidence draft** cheaply: paste `scripts/extract-style.js` into the
   Chrome tools' `javascript_tool` on the open reference page — it returns real
   fonts, color frequencies, the type scale, and radii. Then write the short
   **style spec** (fill the schema in `references/style-extraction.md`):
   background, palette + accent, type pairing, section/layout patterns,
   signature components (e.g. floating product mockups), and motion character.
   The script catches values the eye misjudges; your screenshots catch layout
   and the signature "tells". Use both.
4. Also read the user's site the same way — for real product content **and to
   note its own layout/section skeleton, fonts, and footer**. You need this so
   you can deliberately *diverge* from it (borrow the reference's structure, not
   the product's) and so you can reuse the product's real footer/legal text
   verbatim instead of inventing one.
5. **Non-Latin content:** if the product's copy includes Devanagari, CJK,
   Arabic, Cyrillic, etc. (e.g. a Hindi + English code-switching demo), note it
   now — you must load a font that covers that script (see build-guide Pitfalls).

If a domain can't be fetched or is blocked, tell the user and continue from
screenshots / their description — never try to bypass the fetch restriction.

## Step 3 — Plan

Map the user's product content onto the reference's structural patterns. Make a
short section outline. Pick fonts (closest free Google Fonts to the reference),
the palette, and the motion plan. Confirm anything genuinely ambiguous, then
build.

## Step 4 — Build

Default stack: **Next.js 14 (App Router, static export) + GSAP ScrollTrigger +
Lenis**, hand-written CSS with design tokens at the top of `globals.css`.

**Scaffold from the template — don't hand-write the stack.** Run
`scripts/new-demo.sh <dest>`; it copies `template/` (motion layer already wired
and known to build) and installs deps. Then:

1. Set the design tokens in `app/globals.css` `:root` from your style spec, and
   swap the fonts in `app/layout.tsx` for the matched Google Fonts.
2. Replace `app/page.tsx` with the real sections — the user's content mapped
   onto the **reference's** layout skeleton (not the user's own site's).
3. Build the signature component and pick 2–4 motion recipes from
   `references/patterns.md`; `references/build-guide.md` has the sticky-tab and
   mockup starters. Reuse `.rise`, `[data-speed]`, and `<Reveal>` for the rest.

If the user chose single-file HTML, start from `template-html/index.html`
instead (same tokens + motion layer, GSAP/Lenis via CDN, no install) and replace
its content. See build-guide's per-section-tour notes for a multi-theme variant.

Always honor `prefers-reduced-motion`. Keep the reference's *feel* but write
original markup and copy.

## Step 5 — Verify

Run `scripts/verify.sh <dir>` — it type-checks, builds the static export, and
greps `out/index.html`. Add your own greps for the real product copy, the accent
hex, and the font name (the script reminds you). Fix anything until it's green.

**Look at the result.** In a local session you *can* see it rendered: start
`npm run dev`, point the Chrome tools at `http://localhost:3000`, and `computer`
screenshot it (scroll through). This is the real quality check — do it, don't
just trust the grep. In a display-less sandbox where localhost isn't reachable,
use `scripts/shoot.mjs http://localhost:3000` (or against a deploy) for headless
screenshots, and say so if even that isn't available.

> **NEVER run `npm run build` while `npm run dev` is running.** Both write to
> `.next`; the build clobbers the dev server's chunks mid-flight and the page
> dies with `Error: Cannot find module './31.js'` (or similar). This bit us and
> looks like a code bug but isn't. While a dev server is live:
> - type-check with **`npx tsc --noEmit`** (does not touch `.next`);
> - to do a real `npm run build`, **stop `dev` first**;
> - if the dev server is already corrupted: `pkill -f "next dev"`, `rm -rf
>   .next`, then restart `npm run dev`.
>
> When editing a running dev server, prefer `tsc --noEmit` + a `curl
> localhost:3000 | grep` for your content to confirm it compiled, rather than
> building.

## Step 6 — Package & hand off

Remove `node_modules`, `.next`, `out`, zip the project, and share it with
`mcp__cowork__present_files`. Give the run commands (`npm install && npm run
dev`) and a one-paragraph summary of how the reference's style was applied.

## Step 7 — Go live & audit (optional)

If the user wants a shareable URL or a quality number:

- **Audit:** `scripts/audit.sh http://localhost:3000` (dev server running) prints
  Lighthouse perf/a11y/best-practices/SEO. Aim for 90+; accessibility and SEO are
  the cheap wins to fix before shipping.
- **Deploy:** build first (`scripts/verify.sh <dir>` produces `out/`), then
  `scripts/deploy.sh out` for a preview URL. Deploying is **outward-facing** —
  confirm with the user before `scripts/deploy.sh out --prod`, and don't deploy a
  stale `out/`. It's static files, so Vercel/Netlify/any host works.
- Re-run `audit.sh <deploy-url>` against the live URL for a real-network score.

## Guardrails

- **Originality:** never copy the reference's text, and don't embed its logos or
  trademarked image assets — use CSS-generated textures/shapes instead. Company
  names in a comparison/word context are fine.
- **Sensitive domains:** if the product is health, finance, legal, or similar,
  keep tone responsible and accurate, label demo data as illustrative, avoid
  guarantees, and include appropriate notices (e.g. a crisis-resources line for
  mental-health sites). Keep loading/marketing language non-alarming.
- **Illustrative data:** note that any names, numbers, quotes, or availability
  shown are placeholder demo content — but keep it **small and unobtrusive** (a
  short line), never a giant disclaimer block, and **never jammed into the
  footer as if it were the site's footer**. If the user wants the product's real
  footer, replicate that (see below) and tuck the illustrative note elsewhere or
  drop it if they explicitly override — then tell them nothing marks the demo
  data as illustrative anymore.
- **Footer:** prefer the target *product's* real footer — fetch it and reuse its
  tagline, links, and copyright verbatim — rather than inventing one or leaving
  a build-note there.
- **Motion:** every animation must degrade gracefully under reduced motion.

## Pitfalls learned (do NOT repeat)

Hard-won from real runs. Full technical detail in `references/build-guide.md`.

1. **Recoloring ≠ restyling.** Don't keep the user's own site's section skeleton
   and just swap colors — it still looks like their original. Borrow the
   reference's *structure and signature components*. (See the Golden rule.)
2. **`display:flex` on a text list-item / paragraph that contains inline markup
   (`<b>`, `<span>`) splits each inline run into its own flex column** — text
   shatters into broken columns. Use a positioned `::before` for bullets; keep
   text containers `display:block`. Only flex the wrapper, never the line of
   prose itself.
3. **Never `npm run build` while `npm run dev` is running** (corrupts `.next`).
   Use `npx tsc --noEmit` to verify while dev is live. (See Step 5.)
4. **Non-Latin scripts need their own webfont.** Devanagari/CJK/Arabic won't
   render in Inter/JetBrains Mono; load the matching `next/font` with the right
   `subsets` (e.g. `Noto_Sans_Devanagari`, `subsets:["devanagari"]`) and apply a
   `.hi{font-family:var(--f-deva)}` class. Don't rely on OS fallback fonts.
5. **Reuse the product's real footer**, don't invent one or dump a build-note
   there (see Footer guardrail).

## Quality bar

Aim for something that could pass as a real launch page: confident type scale,
restrained palette, a signature visual element from the reference, and motion
that reveals content as you scroll rather than decorating it. Don't reuse the
same layout for different references — the whole point is that each result looks
like the site it borrowed from.
