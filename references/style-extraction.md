# Style extraction checklist

When researching a reference site, capture these into a short spec. Base it on
what you actually see in screenshots, not assumptions.

## 1. Foundation
- Background: pure white, warm paper/off-white, near-black, gradient?
- Contrast level: airy/low-contrast vs punchy/high-contrast.
- Overall density: lots of whitespace vs packed.

## 2. Palette
- 1 ink/text color, 1–2 neutrals, 1 signature accent (name the hex you'll use).
- Any secondary accent or a signature "block" color (e.g. Granola's lime).
- Grab colors from buttons, links, and highlighted words.

## 3. Typography
- Display face character: editorial serif (Times/Tiempos-like), geometric sans,
  grotesque, rounded, mono? Pick the closest free Google Font.
- Body face: usually a clean neutral sans (Inter, etc.).
- Scale: how big is the hero headline relative to body? Tight or loose leading?
- Any italic / accent-word treatment.

## 4. Layout patterns (the reusable structures)
- Nav: floating pill? full-width? centered links?
- Hero: split (copy left / visual right), centered, full-bleed?
- Section rhythm: hairline dividers, two-column "serif heading + body" rows,
  bento grids, sticky tab sections, logo walls, dark bands.
- Signature component: floating product mockup, device frame, screenshot with
  texture behind it, oversized numbers, etc.

## 5. Motion character
- Calm fades, dramatic pinned scroll, parallax, word-by-word reveals,
  count-ups, marquees? Match the energy, don't over-animate a calm brand.

## 6. Signature "tells"
- The 1–3 details that make the site recognizable (grainy duotone photos, a
  specific button shape, a texture, a color block). Reproduce at least one.

## Font matching cheat-sheet (free Google Fonts)
- Tiempos / Times editorial serif → Newsreader, Source Serif 4, Instrument Serif
- Warm characterful serif → Fraunces
- Neutral grotesque → Inter, Space Grotesk
- Geometric/friendly → Sora, Poppins, DM Sans
- Mono/technical → JetBrains Mono, IBM Plex Mono
- Devanagari / Hindi support → Noto Sans Devanagari (add to the font stack)

## Evidence first, then the eye

Run `scripts/extract-style.js` in the opened reference page (via the Chrome
tools' `javascript_tool`) to get a computed-style draft — the real fonts in use,
color frequencies, the type-size scale, and border-radii. That catches values
the eye misjudges. **Then** refine it against your screenshots: the script can't
read layout rhythm, the signature "tells", or motion character — you supply
those. Map the finished spec straight onto the template's design tokens
(`:root` in `app/globals.css`).

## Structured spec (fill this, then build from it)

Keep one of these per reference site. The `--token` column is where each value
lands in `globals.css`, so research → build is a direct copy.

```json
{
  "reference": "linear.app",
  "foundation": { "background": "#08090a", "contrast": "high", "density": "airy" },
  "palette": {
    "ink": "#f7f8f8",        // --ink
    "muted": "#8a8f98",      // --muted
    "accent": "#5e6ad2",     // --accent  (the ONE signature color)
    "line": "rgba(255,255,255,0.08)" // --line
  },
  "type": {
    "display": { "ref": "grotesque", "googleFont": "Inter Tight" }, // --f-display
    "body":    { "ref": "neutral sans", "googleFont": "Inter" },    // --f-body
    "heroVsBody": "~5x", "leading": "tight", "accentWords": "italic/coloured?"
  },
  "shape": { "radius": "8px", "shadowCharacter": "soft, low" }, // --radius / --shadow
  "layout": {
    "nav": "floating pill | full-width | centered",
    "hero": "split | centered | full-bleed",
    "sectionRhythm": ["hairline rows", "bento", "sticky tabs", "logo wall"],
    "signatureComponent": "browser frame | bento | floating pills | …"
  },
  "motion": "calm fades | pinned scroll | parallax | word reveals | count-ups",
  "tells": ["the 1-3 details that make it recognizable — reproduce ≥1"]
}
```

Pick exactly ONE accent. If the reference has a signature block color (Granola's
lime, Stripe's purple), that's your `--accent`; everything else stays neutral.
