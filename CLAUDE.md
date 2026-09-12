# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static one-page landing site for **TotalTech**, a waterproof/thermal-insulating paint
membrane made by **Netcolor**. Three plain files, no build step, no package manager, no
framework:

```
index.html    all markup and copy (Spanish)
styles.css    all styles
script.js     all behavior (vanilla JS, IIFE, no dependencies)
assets/       casa-3d.mp4 (vertical hero video) + totaltech-envase.jpg (product render)
              + TOTAL TECH MERCADO LIBRE.pdf (source spec sheet, see below)
```

`src-etiqueta-y-render.jpeg` and `src-video-casa-3d.mp4` in the repo root are the original
source assets handed off for the project — do not edit or delete them. `assets/` holds the
versions actually referenced by the page (`totaltech-envase.jpg` is a cropped copy showing
only the product bucket, not the flat label). `inspiracion.webp.png` is the design reference
image the visual language was derived from; it is not used by the page itself.

`assets/TOTAL TECH MERCADO LIBRE.pdf` is a Mercado Libre listing mockup for the product. Its
product-render pages (1–3) are placeholders explicitly marked "DEBE SER FOTO REAL" ("must be
a real photo") — do not extract or embed those images, they're not licensed final photography.
Pages 4–7 are the real source of truth for copy already used on the page: the six benefit
claims (barrera solar, ahorra energía, techos y muros, confort térmico, aislante acústico,
anti granizo), application methods (pincel/rodillo/soplete-tolva), application surfaces
(chapa galvanizada/Cincalum, fibrocemento, concreto, mampostería, baldosas, asfalto), and the
`<dl class="specs">` numbers (1,5–2 L/m² rendimiento, 2–3 manos, 1–2 h secado al tacto,
6–8 h entre manos). If more copy/specs are ever needed, that PDF is the reference — re-read
it rather than guessing.

There is no README, no git repo, and no package.json — this file is the only project
documentation.

## Running it locally

No build step. Because the hero section uses a `<video>` element, opening `index.html`
directly via `file://` mostly works but it's safer to serve it over HTTP:

```bash
python -m http.server 5173
```

Then open `http://localhost:5173`. A Claude Code launch config for this is already set up
at `.claude/launch.json` (name: `landing`, port 5173) — use the browser preview tool's
`preview_start` with that name rather than reinventing a dev server.

There are no tests, no linter, and no build/deploy commands in this repo.

## Architecture

### HTML (`index.html`)
Single document, sections in reading order, each with a stable `id` used both for anchor
nav and for JS hooks: `#inicio` (hero) → `#producto` (the "Verano/Invierno" explainer,
despite the anchor name) → `#nosotros` → `#beneficios` → `#testimonios` → closing CTA →
footer. A fixed `.bg` layer (gradient + inline SVG hex pattern + noise) sits behind
everything at `z-index:-1`, and a fixed WhatsApp FAB (`#waFab`) sits above everything.

### CSS (`styles.css`)
One file, organized as 16 numbered sections in this fixed order (grep for
`/* ---------- N. ---------- */` to jump around): Tokens → Base → Atmospheric background →
Glass/buttons → Header → Hero → Section headings → Seasons → About → Benefits →
Testimonials → Final CTA → Footer → WhatsApp FAB → Reveals → Reduced motion. Keep new rules
in the matching numbered section rather than appending to the end of the file.

Everything is driven by CSS custom properties defined once in `:root` (section 1):
brand colors sampled from the actual product label (`--azul-*`, `--verde`, `--rojo`,
`--naranja`, `--amarillo`), two "thermal" accent colors used throughout to represent
heat/cold (`--calor`, `--frescor`), text opacity tokens (`--tx-1/2/3`), and a shared glass
recipe (`--glass-bg`, `--glass-line`, `--glass-blur`) applied via the `.glass` class. Change
a brand color or the glass look in one place (the tokens) rather than overriding it per
component.

Layout is mobile-first with breakpoints at `620px`/`720px`/`820px`/`900px`/`1024px`/`1280px`
depending on the component (there isn't one single global breakpoint set — check the
component's own media queries). Fluid sizing (`clamp()`) is used for section padding and
type sizes instead of per-breakpoint overrides where possible.

Two things are easy to regress if touched carelessly:
- **Hero title sizing**: `.hero__title` has a deliberately lower `clamp()` max than you'd
  expect between 1024–1280px, plus a separate `@media (min-width: 1280px)` override that
  raises it again. This exists because the unclamped size caused the three-line title to
  wrap mid-line in that range — don't "simplify" it back to a single clamp.
- **`prefers-reduced-motion`**: section 16 forces all reveal/transition/animation durations
  to ~0 and forces `.reveal`/`.wa-fab` to their visible end state. `script.js` also checks
  `reduceMotion` before running scroll animations. Any new animated UI needs a corresponding
  reduced-motion fallback in both files.

### JS (`script.js`)
One IIFE, no modules, no build step — organized as independent feature blocks in this
order: footer year → header compact-on-scroll → mobile nav toggle → `IntersectionObserver`
scroll-reveal (`.reveal` → `.is-in`) → active-nav-link-on-scroll → hero video (autoplay,
mute toggle, pause-when-offscreen) → WhatsApp FAB visibility → testimonial carousel.

Each block reads `reduceMotion` once at the top of the file (`prefers-reduced-motion`) and
skips animated behavior when it's set.

The testimonial carousel (last block) does **not** use `scrollTo({behavior:'smooth'})` —
that API is a no-op on a container with `scroll-snap-type: x mandatory` in Chromium. It
instead animates `element.scrollLeft` by hand via `requestAnimationFrame` (see `glideTo` /
`centerFor`). If you touch the carousel, keep that manual-animation approach; don't
"simplify" it back to `scrollTo`, it will silently stop working.

### Copy/content rules already established in this file
The `<dl class="specs">` numbers and the "se aplica con" / "superficies" tag rows in the
benefits section are now real, sourced from `assets/TOTAL TECH MERCADO LIBRE.pdf` (see
above) — don't revert them to placeholder dashes.

One thing is still intentionally fictional: the three testimonials in `#testimonios`,
marked as such in an HTML comment. Replace with real customer quotes before shipping;
don't invent new ones or treat them as real.

## Content language

All copy is in Spanish (`lang="es"`). Keep new copy in the same register (informal "vos"
Argentine Spanish, e.g. "Protegé", "Contanos") to match the existing content.
