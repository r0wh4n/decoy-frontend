# Decoy Frontend

> A [Claude Code](https://claude.com/claude-code) skill that turns any product into a
> polished demo landing page **in the visual style of a reference website** — its
> palette, typography, layout, and motion — while telling *your* product's story.

Point it at your product and one or more sites you admire (`linear.app`,
`granola.ai`, `stripe.com`, …). It interviews you, actually researches the
references, and builds a **real, runnable** project with rich scroll animation —
not a mockup, not a screenshot. A convincing *decoy*: it wears the reference's
look, but every word and section is yours.

**Golden rule: clone the _style_, never the _content_.** The reference supplies
the look; your site supplies the words. It borrows the reference's layout
skeleton and signature components — not its copy, logos, or trademarked assets.

---

## What you get

- A production-grade **Next.js 14 + GSAP + Lenis** project (static export), or a
  single self-contained **HTML** file — your choice.
- Smooth scroll, word-mask heading reveals, parallax, a scroll-progress bar, and a
  catalog of advanced patterns (pinned scroll, horizontal scroll, scrub timelines,
  clip reveals, count-ups, marquees, magnetic buttons…).
- An **evidence-driven** style extraction step — real fonts, colors, radii, and
  type scale pulled from the reference, not eyeballed.
- One-command **build verify**, optional **deploy to a live URL**, and a
  **Lighthouse** audit.

## Requirements

- [Claude Code](https://claude.com/claude-code)
- Node.js 18+ (for the Next.js output and scripts)
- Optional: a browser for live screenshots, `npx playwright` for headless shots,
  `npx lighthouse` for audits, and a static host (Vercel/Netlify/any) for deploys

## Install

It's a Claude Code skill — drop it in your skills directory:

```bash
git clone https://github.com/r0wh4n/decoy-frontend.git ~/.claude/skills/decoy-frontend
```

Or download the latest release zip and unzip it into `~/.claude/skills/`. Restart
Claude Code (or start a new session) so it indexes the skill.

## Use

In Claude Code:

```
/decoy-frontend
```

…or just ask: *"build me a landing page for my app in the style of linear.app."*
The skill takes over from there:

1. **Interviews you** — your product/URL, the reference site(s), fonts, theme,
   vibe, motion level, accent, depth, and output format.
2. **Researches** both the reference *and* your own site (so it knows what to
   diverge from), capturing a structured style spec.
3. **Builds** from a known-good template, mapping your content onto the
   reference's structure and reaching into the pattern catalog.
4. **Verifies** the production build and (locally) shows you the rendered result.
5. **Ships** — optional deploy to a live URL plus a Lighthouse score.

## What's inside

| Path | What it is |
|---|---|
| `SKILL.md` | The skill itself — the end-to-end workflow Claude follows. |
| `template/` | A **buildable** Next 14 + GSAP + Lenis scaffold (motion layer pre-wired). |
| `template-html/` | The same tokens + motion layer as one self-contained HTML file. |
| `scripts/new-demo.sh` | Scaffold a new project from the template and install deps. |
| `scripts/verify.sh` | Type-check → static-export build → grep the output. |
| `scripts/extract-style.js` | Browser snippet: pull real fonts/colors/radii/scale into a spec. |
| `scripts/shoot.mjs` | Headless Playwright screenshots (for display-less environments). |
| `scripts/deploy.sh` | Ship the static output to a live URL (Vercel by default). |
| `scripts/audit.sh` | Lighthouse perf / a11y / best-practices / SEO. |
| `references/style-extraction.md` | Checklist + structured spec schema for the reference's look. |
| `references/patterns.md` | Animation recipes + signature-component blueprints. |
| `references/build-guide.md` | The scaffold + the reusable scroll-animation layer in detail. |

## Output formats

- **Next.js (default)** — `output: "export"`, so it builds to a folder of static
  files you can host anywhere.
- **Single-file HTML** — one `index.html` with GSAP/Lenis via CDN; no build step.

## Guardrails

This skill is for building *your own* product's page in another site's *aesthetic*.
It will not:

- reproduce the reference's copy, logos, or trademarked image assets;
- impersonate a real company or pass a demo off as the genuine site;
- drop the "illustrative demo data" note when a page shows placeholder numbers.

For sensitive domains (health, finance, legal), it keeps tone responsible, labels
demo data, and avoids guarantees.

## Contributing

Issues and PRs welcome. Good additions: new animation recipes or component
blueprints in `references/patterns.md`, more font-matching entries, and
output targets. Keep the template **buildable** — run `scripts/verify.sh` on a
scaffolded project before opening a PR.

## License

[MIT](./LICENSE) — free to use, modify, and share.
