# Authwave homepage

Homepage: `/`.

The page follows the supplied mobile and desktop designs, using the existing monochrome treatment. It includes the header, hero, introduction disclosures, audience cards, feature showcase, contribution panel, pricing and footer. Illustrations and logo marks remain crossed-box SVG placeholders. The hero uses a real HTML login form and two supporting cards with simple inline security icons. The connecting-line background artwork has been removed. Placeholder graphics have accessible labels; they do not load remote resources.

## Structure and reuse

| Layer | Definitions used |
| --- | --- |
| Flair decorations | `%d-typography-heading`, `%d-typography`, `%d-highlight` |
| Flair objects | `%o-card`, `%o-disclosure`, `%o-badge`, `%o-button`, `%o-button-primary`, `%o-link`, `%o-progress` |
| Flair patterns | `%p-stack`, `%p-cluster`, `%p-navigation`, `%p-grid`, `%p-accordion`, `%p-checklist` |
| Local decorations | `%d-frame`, `%d-heading`, `%d-panel` |
| Local objects | `%o-kicker`, `%o-action`, `%o-placeholder`, `%o-intro-disclosure`, `%o-audience`, `%o-plan` |
| Local patterns | `%p-heading`, `%p-shell`, `%p-section` |
| Page | Specific section arrangements, element bindings and desktop enhancements |

`%p-checklist` is a general-purpose Flair pattern. The four external corner markers are provided by Flair’s `%d-highlight`; `%d-frame` maps the application’s marker and border sizes onto it. The checklist arranges explicit inclusion/exclusion markers beside text and is independent of pricing. The price-card layout, amounts, plan labels, selection-frame settings and two-part action links remain Authwave-specific.

The entry point is `style/style.scss`, which composes the following layers:

- `variable/`: `palette.scss`, `defaults.scss`, `light.scss`, `dark.scss` and `breakpoint.scss`. Palette and theme files each expose one mixin and emit nothing on import.
- `font/`: one definition-only font mixin per family, explicitly included by the entry point.
- `decoration/`: one visual placeholder per file, such as `frame.scss` defining `%d-frame`.
- `object/`: one reusable object placeholder per file. `%o-intro-disclosure` has a distinct name to avoid colliding with Flair's `%o-disclosure`.
- `pattern/`: one composition placeholder per file, such as `%p-shell` and `%p-heading`.
- `element/`: document selectors, accessibility rules and the root that applies palette/defaults.
- `layout/`: one page selector (or related selector group) per file, with its descendants and responsive variants kept together.
- `component/`: separate selectors for the interactive logo, its pixel and its filter container.

Reusable definitions import only the definitions they need, without applying root themes or fonts. Selector files emit only their own styling; `style.scss` determines their cascade order. Existing `authwave-*` HTML classes and custom properties are retained so this organisation does not change markup, JavaScript hooks or appearance.

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
