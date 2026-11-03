# Build guide — Next.js + GSAP scaffold & animation layer

The proven, fast-to-build stack for these demos. Copy these patterns; swap in
the researched style tokens and the user's content.

## Project layout

```
package.json            deps: next@14, react, react-dom, gsap, @gsap/react, lenis
tsconfig.json           standard Next TS config, paths { "@/*": ["./*"] }
next.config.mjs         output: "export"; images.unoptimized: true
app/
  layout.tsx            metadata (title/description = the user's product)
  globals.css           ALL styling; design tokens in :root at the top
  page.tsx              composes the scenes
components/
  SmoothScroll.tsx      Lenis + ScrollTrigger, generic .rise + [data-speed] parallax
  ScrollProgress.tsx    thin top progress bar
  Reveal.tsx            word-by-word masked heading reveal
  <Mockup>.tsx          the reference's signature component (e.g. a notepad/device)
  scenes/               Hero, then one component per section
```

Deps in `package.json` (versions that build cleanly):
`gsap ^3.12.5`, `@gsap/react ^2.1.1`, `lenis ^1.1.14`, `next ^14.2.15`,
`react ^18.3.1`, `react-dom ^18.3.1`.

## Design tokens (top of globals.css)

Define `--bg --ink --muted --accent --line`, font vars, radii, and shadows from
the researched palette. Import fonts from Google Fonts. Everything else
references these tokens so the whole look is retunable from one place.

## SmoothScroll.tsx (Lenis + reveal + parallax)

```tsx
"use client";
import { ReactNode, useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(raf); gsap.ticker.lagSmoothing(0);
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".rise").forEach((el) =>
        gsap.to(el, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%" } }));
      gsap.utils.toArray<HTMLElement>("[data-speed]").forEach((el) => {
        const s = parseFloat(el.dataset.speed || "0");
        gsap.fromTo(el, { y: s }, { y: -s, ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
      });
    });
    const r = setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => { clearTimeout(r); ctx.revert(); gsap.ticker.remove(raf); lenis.destroy(); };
  }, []);
  return <>{children}</>;
}
```

CSS: `.rise{opacity:0;transform:translateY(24px)}` and under
`@media (prefers-reduced-motion: reduce){ .rise{opacity:1;transform:none} }`.
(Because `.rise` starts hidden in CSS, SmoothScroll animates it **to** visible —
never `gsap.from`, or it would stay invisible.)

## Reveal.tsx (word-mask heading reveal)

Split a string into words, wrap each in an `overflow:hidden` mask, and rise them
on scroll with `useGSAP` (a layout effect, so no flash). Support `accent` words.

```tsx
"use client";
import { ElementType, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Reveal({ text, as="h2", className="", accent=[], start="top 82%", stagger=0.06 }:{
  text:string; as?:ElementType; className?:string; accent?:string[]; start?:string; stagger?:number; }) {
  const ref = useRef<HTMLElement>(null); const Tag = as as ElementType;
  useGSAP(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.from(ref.current!.querySelectorAll(".rw-word"), { yPercent:115, duration:0.8,
      ease:"power3.out", stagger, scrollTrigger:{ trigger:ref.current, start } });
  }, { scope: ref });
  const clean = (w:string)=>w.replace(/[.,]/g,"").toLowerCase();
  const words = text.split(" ");
  return (<Tag className={className} ref={ref as never}>
    {words.map((w,i)=>(<span className="rw-mask" key={i}>
      <span className={`rw-word${accent.includes(clean(w))?" it":""}`}>{w}</span>
      {i<words.length-1?" ":""}</span>))}
  </Tag>);
}
```

CSS:
```css
.rw-mask{display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:.14em;margin-bottom:-.14em}
.rw-word{display:inline-block;will-change:transform}
.rw-word.it{font-style:italic;color:var(--accent)}
```
Note: word-split headings won't grep as a contiguous phrase in the exported
HTML — verify with single words instead.

## Scroll-linked sticky section (the standout pattern)

Left column = sticky tab rail; right column = stacked tall panels. A
ScrollTrigger per panel sets the active tab (`onToggle` at `top 55%`), the panel
mockup rises in (`gsap.from ... start:"top 80%"`), and a background block gets a
`scrub` parallax. Clicking a tab does `panel.scrollIntoView({block:"center"})`.
Great for "how it works" / before-during-after stories.

## Signature mockup component

Recreate the reference's hero visual as a data-driven component (a notepad, a
device frame, a dashboard card). Give it an optional `reveal` prop that staggers
its inner rows in on scroll via `useGSAP` + ScrollTrigger. Float small
pills/cards over it and give them gentle `sine.inOut` yoyo motion or parallax.

## ScrollProgress.tsx

A `position:fixed` 3px bar; in a rAF loop set `scaleX = scrollTop/(scrollHeight
- clientHeight)`.

## Verify

```bash
npm install --no-audit --no-fund
npm run build          # must end with "Compiled successfully" + type check pass
# then confirm in out/index.html:
#  - real product words present
#  - style tokens in the css (font name, accent hex)
#  - anim hooks: rw-word / data-speed / progress / any sticky-panel class
```

The sandbox has no display and the user's browser can't reach it, so you can't
screenshot the result — say so, and rely on the build + grep checks. Then zip
(excluding node_modules/.next/out) and present.

## Pitfalls & gotchas (learned the hard way)

### 1. Never `npm run build` while `npm run dev` is running
Both write to `.next`; the build overwrites the dev server's chunks mid-request
and the page dies with `Error: Cannot find module './31.js'`. Looks like a code
bug, isn't. While a dev server is live, verify with **`npx tsc --noEmit`**
(doesn't touch `.next`) plus `curl -s localhost:3000 | grep <your content>`. To
do a real build, stop dev first. Recovery: `pkill -f "next dev"; rm -rf .next;
npm run dev`.

### 2. flexbox shreds inline markup inside a text line
A flex container makes **every** in-flow child its own flex item — including
inline `<b>`/`<span>` and each surrounding text run. So this:
```css
.tags li{display:flex;gap:12px}   /* BROKEN if the li has inline <b> */
```
```html
<li>Understands <b>code-switched speech</b> — Hindi + English</li>
```
renders "Understands", "code-switched speech", and "— Hindi + English" as three
separate columns. Fix: don't flex the line of prose. Bullet via positioned
pseudo-element:
```css
.tags li{position:relative;padding-left:20px;line-height:1.55}
.tags li::before{content:"";position:absolute;left:0;top:8px;width:6px;height:6px;border-radius:50%;background:currentColor}
```
Rule: only flex a *wrapper* of block children; never a container of running text
that includes inline elements.

### 3. Non-Latin scripts need a matching webfont
Inter / JetBrains Mono / most Google sans do NOT carry Devanagari, CJK, Arabic,
etc. glyphs. Add the right `next/font` and a class:
```tsx
import { Noto_Sans_Devanagari } from "next/font/google";
const deva = Noto_Sans_Devanagari({ subsets:["devanagari"], weight:["400","500","600"], variable:"--f-deva", display:"swap" });
// add ${deva.variable} to <html className>
```
```css
:root{ --deva:var(--f-deva),var(--f-sans),system-ui,sans-serif; }
.hi{font-family:var(--deva)}
```
Then wrap the non-Latin runs: `<span class="hi">ठीक है, मैं</span>
<span class="en">invoices backfill</span> <span class="hi">कर दूँगी</span>`.
For a code-switching demo, highlight the switched-language tokens so the mix is
visible. Don't type Devanagari char-by-char in a typewriter effect — combining
marks render awkwardly mid-type; reveal such lines whole.

### 4. Reuse the product's real footer
Fetch the target product's footer and reproduce its tagline, links, copyright
verbatim. Don't invent a footer, and don't dump a "Demo landing page — styles
borrowed from…" build-note there. Keep any illustrative-data note small and
elsewhere; if the user removes it, tell them the demo numbers are no longer
marked as illustrative.

### 5. Per-section style tour (when each section gets its own theme)
Give each `<section>` a scoped class (`.s-hero`, `.s-verify`, …) and, inside it,
its own background, accent, type treatment, radius, and a signature component.
Full-bleed section backgrounds with an inner `.inner{max-width;margin:auto}` make
the theme boundaries read edge-to-edge. Keep the set coherent (e.g. all-dark)
unless the user wants light/dark contrast between sections. A `dangerouslySet
InnerHTML` static-string body is an acceptable lazy way to reuse verified markup
verbatim in a Next page (no injection surface for a static string) — pair it with
one `"use client"` effect component that wires progress bar, IntersectionObserver
reveals, any typewriter, and demo form handlers. Vanilla IntersectionObserver +
one rAF handler is a fine zero-dependency alternative to GSAP/Lenis for reveals,
a progress bar, and light parallax.
