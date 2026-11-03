/* extract-style.js — evidence-driven style extraction.
 *
 * Run this INSIDE a reference page you've already opened with the Chrome tools
 * (the skill's Step 2 uses claude-in-chrome). Pass it to the `javascript_tool`
 * as the script to evaluate; it returns a JSON style spec AND logs it to the
 * console (readable via read_console_messages, filter "STYLE-SPEC"). Then refine
 * the spec against your screenshots — computed styles catch palette/type/scale
 * that the eye misses, screenshots catch layout + "signature tells".
 *
 * Zero dependencies, read-only, no network. Safe to re-run.
 */
(() => {
  const rgb = (c) => {
    const m = (c || "").match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const [r, g, b, a = "1"] = m[1].split(",").map((s) => parseFloat(s));
    return { r, g, b, a: parseFloat(a) };
  };
  const hex = (c) => {
    const p = rgb(c);
    if (!p || p.a === 0) return null;
    const h = (n) => Math.round(n).toString(16).padStart(2, "0");
    return "#" + h(p.r) + h(p.g) + h(p.b);
  };
  const sat = (c) => {
    const p = rgb(c);
    if (!p) return 0;
    const mx = Math.max(p.r, p.g, p.b), mn = Math.min(p.r, p.g, p.b);
    return mx === 0 ? 0 : (mx - mn) / mx; // 0 = gray, 1 = vivid
  };
  const bump = (map, k) => { if (k) map.set(k, (map.get(k) || 0) + 1); };
  const top = (map, n = 6) =>
    [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, n)
      .map(([v, count]) => ({ v, count }));

  const fonts = new Map(), sizes = new Map(), radii = new Map();
  const inkColors = new Map(), bgColors = new Map(), accentColors = new Map();

  const els = [...document.querySelectorAll("body *")].filter((el) => {
    const r = el.getBoundingClientRect();
    return r.width > 2 && r.height > 2; // visible-ish only
  });

  for (const el of els) {
    const s = getComputedStyle(el);
    const fam = (s.fontFamily || "").split(",")[0].replace(/['"]/g, "").trim();
    if (fam) bump(fonts, fam);
    if (el.textContent && el.textContent.trim()) {
      bump(sizes, Math.round(parseFloat(s.fontSize)));
      bump(inkColors, hex(s.color));
    }
    bump(bgColors, hex(s.backgroundColor));
    const br = parseFloat(s.borderBottomLeftRadius);
    if (br > 0) bump(radii, Math.round(br) + "px");
    // accent candidates: coloured links/buttons & their backgrounds
    const tag = el.tagName.toLowerCase();
    if (tag === "a" || tag === "button" || el.getAttribute("role") === "button") {
      if (sat(s.color) > 0.35) bump(accentColors, hex(s.color));
      if (sat(s.backgroundColor) > 0.35) bump(accentColors, hex(s.backgroundColor));
    }
  }

  const headline = (() => {
    const h = document.querySelector("h1, h2");
    return h ? getComputedStyle(h).fontFamily.split(",")[0].replace(/['"]/g, "").trim() : null;
  })();

  const spec = {
    url: location.href,
    palette: {
      pageBackground: hex(getComputedStyle(document.body).backgroundColor),
      topInkColors: top(inkColors),
      topBackgrounds: top(bgColors),
      accentCandidates: top(accentColors, 4),
    },
    type: {
      headlineFont: headline,
      fontsByFrequency: top(fonts),
      sizeScalePx: [...sizes.keys()].sort((a, b) => a - b),
    },
    shape: { borderRadii: top(radii, 4) },
    layout: {
      sections: document.querySelectorAll("section").length,
      hasNav: !!document.querySelector("nav, header"),
      headings: { h1: document.querySelectorAll("h1").length, h2: document.querySelectorAll("h2").length },
    },
    note: "Computed-style draft. Verify palette/type against screenshots and add signature 'tells' by hand.",
  };

  try { window.__styleSpec = spec; } catch {}
  console.log("STYLE-SPEC " + JSON.stringify(spec));
  return spec;
})();
