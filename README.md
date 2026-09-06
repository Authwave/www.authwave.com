# Authwave homepage

Homepage: `/`.

The page follows the supplied mobile and desktop designs, using the existing monochrome treatment. It includes the header, hero, introduction disclosures, audience cards, feature showcase, contribution panel, pricing and footer. Illustrations and logo marks remain crossed-box SVG placeholders. The hero uses a real HTML login form and two supporting cards with simple inline security icons. The connecting-line background artwork has been removed. Placeholder graphics have accessible labels; they do not load remote resources.

## Structure and reuse

| Layer | Definitions used |
| --- | --- |
| Flair decorations | `%d-heading`, `%d-typography`, `%d-highlight` |
| Flair objects | `%o-card`, `%o-disclosure`, `%o-badge`, `%o-button`, `%o-button-primary`, `%o-link`, `%o-progress` |
| Flair patterns | `%p-stack`, `%p-cluster`, `%p-navigation`, `%p-grid`, `%p-accordion`, `%p-checklist` |
| Authwave decorations | `%d-authwave-frame` (selection-style border corners), `%d-authwave-heading` (display typography) |
| Authwave objects | `%o-authwave-kicker`, `%o-authwave-action`, `%o-authwave-placeholder`, `%o-authwave-disclosure`, `%o-authwave-audience`, `%o-authwave-plan` |
| Authwave patterns | `%p-authwave-heading`, `%p-authwave-shell`, `%p-authwave-section` |
| Page | Specific section arrangements, element bindings and desktop enhancements |

`%p-checklist` is a general-purpose Flair pattern. The four external corner markers are provided by Flair’s `%d-highlight`; `%d-authwave-frame` maps the application’s marker and border sizes onto it. It arranges explicit inclusion/exclusion markers beside text and is independent of pricing. The price-card layout, amounts, plan labels, selection-frame settings and two-part action links remain Authwave-specific.

The entry point is `style/style.scss`. The `style/authwave/` directory contains:

- `font.scss`: all licensed Morion face declarations.
- `theme.scss`: defaults, monochrome tokens, light/dark scope mixins and the wide-layout breakpoint.
- `decoration.scss`: Authwave-specific visual treatments.
- `object.scss`: reusable Authwave objects built from Flair definitions.
- `pattern.scss`: heading groups, content shell and section spacing.
- `page.scss`: selectors and responsive arrangements for this homepage.

Changes to `--authwave-*` properties stay in this application. The light/dark mixins map those properties onto Flair's semantic colours. The page initializes `flair.defaults` once at its own root. The application owns its root tokens and does not load Flair’s website styles or theme selector.

## Responsive behaviour

The base CSS uses a stacked mobile layout. At `min-width: 60rem`, the header reveals navigation, the hero adds supporting security cards, the introduction divides into heading/content columns, audience cards surround their heading, all four features appear around a central graphic, and the contribution/footer arrangements expand into columns.

Pricing uses `%p-grid` with up to three columns and a 20rem minimum column width, so it responds to the containing width independently. Its zero gap is expressed as `0rem`, because the grid calculation requires a length. Main content remains in document flow. Only the hero's supplementary cards are positioned relative to their graphic region.

The introduction and audience sections use native `details`/`summary`. The introduction's shared `name` provides an exclusive group. It remains operable without JavaScript.

`script/authwave.es6` enhances the feature section on narrow screens with previous/next controls, an accessible status and progress indicator. Without JavaScript every feature is visible. The script reads the breakpoint emitted by Sass, restores all features on desktop and preserves selection when resizing back to mobile. Native hidden attributes control visibility; the Authwave stylesheet includes its own scoped hidden rule for portability.

## Morion fonts

Copied from `/home/g105b/Downloads/Morion/` into `asset/font/morion/`. The original `.woff` files are actually WOFF2; destination filenames use `.woff2`, and the declarations use `format("woff2")`. File contents are unchanged.

| Face names | CSS weight | Styles |
| --- | --- | --- |
| Thin / Thin Italic | 100 | normal / italic |
| UltraLight / UltraLight Italic | 200 | normal / italic |
| Light / Light Italic | 300 | normal / italic |
| Regular / Italic | 400 | normal / italic |
| Semibold / Semibold Italic | 600 | normal / italic |
| Bold / Bold Italic | 700 | normal / italic |

The family/subfamily names agree with the supplied filenames, but some internal OS/2 numeric weights and italic flags do not. Explicit `@font-face` descriptors map the named faces to conventional CSS weights/styles. Font synthesis is disabled in this preview. Display headings and wordmarks use Morion; navigation, feature/plan labels and body text use Ubuntu, following the design's serif/sans-serif distinction.

Only requested faces download, using `font-display: swap`. These licensed assets and font declarations belong to Authwave and are not imported by the public Flair Sass entry point.

## Local development

Run `npm install`, then `gt build`. Start the site with `gt run -p 8080` and open `http://localhost:8080/`.

`package.json` requires `flair` from `file:../../BrightFlair/flair`. npm links the sibling checkout at `~/Code/BrightFlair/flair`; that checkout must exist before installation. `build.ini` adds `node_modules/flair/style` to Sass’s load path, so application modules use `@use "flair"`. Run `gt build` after changing shared Flair sources; the app watcher watches its own source directories.

Morion and Ubuntu assets are owned by this website. The local Flair package exposes only library Sass, excluding its demo website, scripts and fonts. The existing HTML head and analytics configuration are retained. The interactive-logo markup, script and isolated stylesheet remain available in their component directories, but are not included by the homepage.

Booking, account creation, billing and policy destinations still lead to the explicit preview note. Social account names are noninteractive text until their real destinations are supplied. Prices and plan inclusions are static design content. The login form uses native required-field validation and shows a local preview message on submission. Its fields have no names, so the no-JavaScript fallback leads to the preview note without including credentials in the URL. No authentication, signup service, payment processing or background animation is connected.

## Verification

`gt build` compiles the website. Flair’s Sass API tests remain in the Flair repository (`npm test` there). Optional browser checks use Playwright and axe installed outside this repository:

```sh
npm install --prefix /tmp/flair-review playwright @axe-core/playwright
```

With Chromium at `/usr/bin/chromium`, run:

```sh
NODE_PATH=/tmp/flair-review/node_modules node test/authwave-browser.cjs
```

The browser check covers narrow/large widths and the 60rem boundary, pricing columns, all twelve Morion font faces, automated accessibility, disclosure keyboard use, feature navigation and resizing, and the no-JavaScript fallback.

Set `AUTHWAVE_TEST_URL` or `FLAIR_CHROMIUM_PATH` to override the browser test URL or executable. Browser tests block analytics requests. The login remains a local preview.
