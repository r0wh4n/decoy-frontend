# Pattern & component catalog

A library of proven scroll/motion recipes and signature-component blueprints to
reach for when matching a reference site's feel. Pick the 2–4 that match the
reference's energy — don't pile them all on. Every recipe must degrade under
`prefers-reduced-motion` (gate the JS exactly as the template components do).

The template already ships the **base layer**: `.rise` reveals, `[data-speed]`
parallax, word-mask headings (`Reveal.tsx`), and the progress bar. The sticky
tab rail and signature-mockup starters live in `build-guide.md`. This file adds
the rest.

## How to choose (by reference energy)

| Reference feels like…                    | Reach for…                                        |
| ---------------------------------------- | ------------------------------------------------- |
| Calm / editorial (Linear, Granola)       | word-mask headings, gentle `.rise`, hairline rows |
| Cinematic / product (Apple, Superhuman)  | pinned scroll, scroll-scrub sequence, clip reveal |
| Energetic / dev-tool (Vercel, Resend)    | horizontal scroll, marquee, count-ups, spotlight  |
| Playful / brand                          | magnetic buttons, gradient mesh, sticker floats   |

---

## Animation recipes

### Pinned / sticky scroll ("standout" pattern)
See `build-guide.md` → *Scroll-linked sticky section*. Left sticky rail, right
stacked panels; a ScrollTrigger per panel sets the active tab and scrubs a
background. Best for "how it works" / before→after stories.

### Horizontal scroll gallery
Pin a track and translate it on vertical scroll — vertical gesture, horizontal
motion. Great for a steps strip or screenshot carousel.
```js
const track = el.querySelector(".track");
gsap.to(track, {
  x: () => -(track.scrollWidth - innerWidth),
  ease: "none",
  scrollTrigger: { trigger: el, pin: true, scrub: 1,
    end: () => "+=" + (track.scrollWidth - innerWidth) },
});
```

### Scroll-scrub sequence (pin + timeline)
Pin a scene and drive a timeline with `scrub` so the visitor "scrubs" an
animation (device assembling, chart drawing, text swapping).
```js
const tl = gsap.timeline({ scrollTrigger: { trigger: el, pin: true, scrub: true, end: "+=1500" } });
tl.from(".layer-1", { yPercent: 40, opacity: 0 })
  .from(".layer-2", { scale: 0.8, opacity: 0 }, "<0.2")
  .to(".headline", { opacity: 0 }, ">");
```

### Clip-path image reveal
Reveal a visual by wiping its `clip-path` as it enters — a cinematic "developing"
feel without opacity-only fades.
```css
.clip-reveal { clip-path: inset(0 0 100% 0); }
```
```js
gsap.to(".clip-reveal", { clipPath: "inset(0 0 0% 0)", ease: "power3.out",
  scrollTrigger: { trigger: ".clip-reveal", start: "top 80%" } });
```

### Count-up stats
Animate numbers when a stat block enters. Format in the `onUpdate`.
```js
gsap.utils.toArray(".stat").forEach((el) => {
  const to = parseFloat(el.dataset.to);
  gsap.fromTo(el, { v: 0 }, { v: to, duration: 1.4, ease: "power2.out", snap: { v: 1 },
    scrollTrigger: { trigger: el, start: "top 85%" },
    onUpdate() { el.textContent = Math.round(this.targets()[0].v).toLocaleString(); } });
});
```

### Marquee / logo wall
Infinite horizontal drift for a logo strip or ticker. Duplicate the row so the
loop is seamless.
```js
gsap.to(".marquee-row", { xPercent: -50, repeat: -1, duration: 20, ease: "none" });
```
Pause on `prefers-reduced-motion` and on hover if it carries real content.

### Magnetic button / link
Button eases toward the cursor within a small radius — a tactile dev-tool tell.
```js
btn.addEventListener("pointermove", (e) => {
  const r = btn.getBoundingClientRect();
  gsap.to(btn, { x: (e.clientX - r.left - r.width / 2) * 0.3,
                 y: (e.clientY - r.top - r.height / 2) * 0.3, duration: 0.4 });
});
btn.addEventListener("pointerleave", () => gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1,0.4)" }));
```

### Cursor spotlight
A soft radial glow following the pointer over a dark hero (track CSS vars, paint
with `radial-gradient(... at var(--mx) var(--my) ...)`). Skip on touch.

### Text scramble / decode
Headline settles from random glyphs — a technical/AI tell. Use GSAP's
ScrambleText plugin if available, else a short `setInterval` that locks one
character at a time left→right. Reveal whole (never scramble non-Latin scripts).

### Sticky section headers
`position: sticky; top: 0` on a section label so it parks while its content
scrolls past — cheap editorial polish, pure CSS, no JS.

---

## Signature component blueprints

Recreate the reference's hero visual as original markup — never embed its logo
or screenshots (see the Originality guardrail). Build them data-driven so rows
can stagger in via `.rise` or a scoped `useGSAP`.

- **Browser / device frame** — a rounded chrome bar (three dots, a URL pill) wrapping
  a CSS-built mock UI. The most common SaaS hero tell.
- **Bento grid** — unequal rounded cells (`grid-template` with spanning items),
  each a mini-feature. Linear/Vercel style. Stagger cells on reveal.
- **Dashboard / data card** — a card with a CSS-drawn chart (bars via flex heights,
  a line via inline SVG `polyline`). Pair with count-ups.
- **Floating pills / notifications** — small cards drifting over the hero with gentle
  `sine.inOut` yoyo or `[data-speed]` parallax. Granola/Superhuman tell.
- **Oversized numbers / index** — giant `01 02 03` section markers in the display
  font; editorial, no JS.
- **Gradient mesh / aurora background** — layered blurred radial gradients (like the
  template's `.blob`), optionally drifting slowly. Dark-hero staple.
- **Code block / terminal** — monospace card with a window bar and syntax-coloured
  spans (static). Dev-tool tell; pair with text scramble or a typed effect.
- **Logo wall** — a muted grid or marquee of CSS-wordmark chips ("as seen in" /
  integrations). Keep them generic shapes, not real trademarked logos.

---

## Gotchas (carry over from build-guide)

- Don't `display:flex` a line of running prose that contains inline `<b>`/`<span>`
  — it shatters into columns. Flex wrappers of block children only.
- Non-Latin copy needs its own webfont (`next/font` with the right `subsets`).
- Pinned/horizontal ScrollTriggers need a `ScrollTrigger.refresh()` after fonts
  and images load (the template already schedules one). Recompute `end` in a
  function (`end: () => …`) so it survives resize.
