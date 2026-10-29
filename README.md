# Authwave website

## Stylesheets

See [the CSS development rules](style/README.md) for component boundaries, reusable
layers and page composition. Run `node test/style-structure.mjs` to enforce the
structure and `gt build` to compile the site.

## Content pages

`/about/` renders `data/content/about.md` through the shared CommonMark renderer.
The Markdown supplies the page's `h1` and body; its first heading sets the browser
title and its first paragraph supplies the description. There is no separate
copy in the template. `ContentRepository` loads named files from `data/content`,
and `style/pattern/content-page.scss` composes Flair's prose, reading measure and
shared frame through `style/page/_common.scss`.
The header/footer and light/dark preference are shared with the article pages.

## Articles

`/articles/` uses one `data-list="articles"` template, with native category
links and server-side pagination. One category can be selected at a time and
is preserved in page links. Selecting another category resets the page number;
All removes the category filter.
The ellipsis is a native `details` disclosure containing a keyboard-accessible,
scrollable list of all pages; no JavaScript handles these controls.

Each article lives in one Markdown file directly inside `data/articles`, named
`YYYY-MM-DD-slug.md`, for example `2026-10-26-hello-world.md`. The date and slug
come from the filename; the URL stays `/articles/hello-world/`. Files are sorted
newest first and URL slugs must be unique, even if dates differ.

Start each file with YAML front matter:

```markdown
---
title: Hello world
category: guides
summary: A short description for the article header and listing cards.
---

## Your first section

Write the article in **Markdown**, with [links](https://authwave.com).

### A subsection

- One point
- Another point

> A quotation.
```

`title`, `category` and `summary` are required. Category must be `guides`,
`tutorials`, `product`, or `engineering`. The title is rendered by the article
header, so begin the body with `##` section headings. A multi-line YAML summary
can use `summary: >-` followed by indented text.

PHP uses League CommonMark with the core, attributes and front-matter
extensions, following TrackShift's content-rendering approach. Markdown images,
links, lists, quotes and fenced code are supported. Attributes such as
`## A section {#my-section}` can set explicit anchors; the generated contents
navigation preserves them and makes repeated IDs unique. Raw HTML is allowed
for trusted repository-authored markup such as figures and captions, as in
TrackShift; this is not a sanitiser for untrusted uploads.

The nine prototype articles are all standalone Markdown files. Adding or
editing a file updates its listing metadata and article body without a JSON
registry, separate HTML body or preview switch. Keep unfinished drafts outside
this directory. Twelve-page pagination remains covered by in-memory test data,
so the number of editable sample files does not dictate pagination behaviour.

The article body, sticky contents navigation and related cards use the same
HTML on every viewport. The related cards and listing expand the shared
`page/_component/articles-cards.html` template. `ArticleView` supplies their common
URL/date/category fields. Flair provides the reading layout, prose, contents,
article media and highlight-frame primitives; AWPixel supplies colour accents.
The same highlight frame is used by pricing, the footer and the article body.

Colour schemes follow the system preference by default. The footer's icon button
cycles System, Light and Dark (starting with the opposite of the current system
scheme), storing explicit choices in the `authwave-color-scheme` localStorage
entry. System removes the entry and follows live OS changes. The head restores
a valid saved choice before the stylesheet loads; blocked storage still allows
changes for the current page. Choices synchronise across tabs. On the homepage,
`body.uri--index` keeps Introduction and Features light, while the hero, audience
and contribution retain their dark treatment. Pricing and the footer follow the
selected scheme, and the footer selector remains available on every page.
Removing `data-flair-theme="awpixel"`
reveals the monochrome Flair layout. `style/pattern/page-hero.scss` and
the article patterns in `style/pattern/`, composed by `style/page/articles.scss`,
compose Flair's existing objects and the upstream article-preview/page-picker
objects; AWPixel owns category tints and selected states.

Run `composer install` after pulling the Markdown dependencies, then
`php test/articles.php` for Markdown, catalogue, filtering, pagination and article
checks. `gt build` compiles the site assets.

The homepage contains `site-header`, `hero-area`, `introduction-area`,
`audience-area`, `features-area`, `contribution-area` and `pricing-area` WebEngine components.
Each has markup in `page/_component` and styling in `style/component`.
`style/style.scss` starts with Flair's monochrome base theme and typography,
with local Inter body text and Morion headings. The site enables its local
AWPixel theme through `data-flair-theme="awpixel"` on the document root.
`style/theme/awpixel.scss` contains the palette, section colour blocks and
button treatments; it is separate from the linked Flair library. Remove the
theme attribute to see the base layout again.

AWPixel combines warm charcoal and white sections with blue, pink, lime and
coral accents. Buttons use filled pills for navigation, pricing and the footer,
and light pills with square arrow accents for the main section CTAs. Each split
CTA is one native button, with a decorative arrow hidden from screen readers.

Section controls use native HTML and CSS. The script bundle loads `@phpgt/flux`
at a pinned revision containing its CSS-property runtime; v1.1.0 predates these
features. Flux supplies pointer, scroll, size and visibility measurements through
`data-flux` directives. CSS controls the effects and reduced-motion preferences.
The hero retains its layout without JavaScript.

The header uses Flair's panel, navigation and `%o-popover` definitions. Its MENU
button targets a native `popover="auto"` below 60rem. The browser handles opening,
Escape and clicking outside. The same links remain visible on desktop,
including when resizing with the mobile popover open.

`page/_component/site-header.php` compares `Uri::getPath()` with the navigation
paths, choosing the longest matching section. Home matches only `/`. Exact
matches receive `aria-current="page"`; nested pages use `aria-current="location"`.
Flux updates each persistent link's attributes. CSS anchors place a shared
square at the popover's left border on mobile and below the current link on
desktop. Hovering or keyboard-focusing a link morphs this same marker
into a coloured highlight behind its text. Each move changes its palette colour.
Clicking changes colour while retaining the rectangle until the pointer leaves;
leaving restores the square beneath the current link. Native position and size
animations use CSS timing and reduced-motion settings consistently across browsers. The shared
`ShuffleBag` rotates through AWPixel's four marker colours without immediate
repeats. Browsers without anchors retain an underlined current link.

The hero uses Flair's stack, button and card definitions. Its heading, tagline,
CTA and illustration placeholder are centred. `style/variable/space.scss`
contains the full-size fluid spacing based on the 840px reference: 42px header padding,
204px between the CTA and illustration, and a section spacing capped at 256px.
The hero bottom padding and Introduction top padding share that spacing.
Introduction, audience and Features use the shared frame in `style/pattern/section-frame.scss`,
with 2.5rem (40px) outside and inside horizontal spacing at full size. The hero retains its own
fluid horizontal inset, capped at 76px. Its placeholder keeps the 618:692 aspect ratio. Smaller
screens reduce the spacing; content can expand the section on wider screens.
The Get started button has no action attached yet.

`style/variable/size.scss` defines a fluid sizing unit, growing from 0.5rem at
20rem (320px) to 1rem at 37.5rem (600px). Shared spacing, icons and large
typography follow this unit. Its `fluid()` function interpolates individual
sizes such as panel heights and pricing numbers between the same widths.
Section insets grow smoothly from 20px to 40px. Body copy stays at least 16px
and buttons at least 44px tall. The existing wider layout is retained from
600px upwards, with no sudden size changes at that breakpoint.

Introduction uses Flair's accordion pattern and native `details` elements with
a shared name, so only one item opens at a time without JavaScript. Each summary
uses Flair's highlight decoration with four square corner markers.
The optional `data-reserve-concertina` helper measures the tallest single-open
state and reserves that height, recalculating after resizing, font loading and
image loading. Measurements use a temporary inert copy, leaving the real
disclosures untouched. Without JavaScript, the native concertina still works.

The audience section shares the hero's Get started button definition in
`style/object/get-started.scss`. Its three Inter panels use Flair's disclosure
styling and native `details` elements. Each full-panel summary toggles a same-size
overlay with placeholder copy; the corner indicator changes from + to −.
Panels sit 80px from the page edge, have 40px internal padding and 6rem vertical
gaps. The title and indicator share the bottom row at every screen width.
Features follows with the shared section frame, heading style and Get started
button. Its three placeholder frames use Inter throughout, an inline SVG icon,
copy and an image inset 40px inside Flair's highlight decoration. Frames scroll
horizontally and snap to the container width. Native CSS scroll buttons provide
previous/next navigation; scroll markers form a cumulative progress bar between
them. Browsers without these CSS controls retain a scrollbar and numbered links.
No JavaScript is used for carousel navigation.

Pricing uses Flair's responsive grid, highlight decoration, badges and checklist
pattern. Its three plans use Inter text, the shared CTA style and 40px panel
padding. Check and cross markers have accessible included/excluded labels.

The shared footer markup lives in `page/_footer.html`, with styling in
`style/pattern/site-footer.scss`, composed in `style/page/_common.scss`. It uses
a highlight frame, the shared CTA,
two navigation columns, the existing interactive logo and a Morion wordmark.
The logo has a static SVG fallback when JavaScript is disabled. Social links
include external-link indicators; LinkedIn currently links to its homepage.

The header logo uses `/asset/logo.svg` as a CSS mask.
Run `npm install`, `gt build`, then `gt run -p 8080` to develop locally. Flair is
linked from `../../BrightFlair/flair`, with its definitions in `style/lib`.

The earlier design is saved on the local branch `new-design-before-guidance`.

## Flux navigation

The shared footer logic marks internal, root-relative links with
`data-flux="link"` and the page's `main` with `data-flux="update-link"`.
External links, downloads, new-tab links and fragment destinations retain native
browser navigation. Links still work normally without JavaScript.

Flux updates the title, description and body attributes alongside the main
content. The shared header, footer, theme preference and interactive logo stay
in place. `data-flux-scroll="auto"` follows the root's CSS `scroll-behavior` after
the replacement has painted: smooth normally, automatic for reduced motion.
Modified clicks retain their normal browser behaviour. Shared link processing
preserves existing CSS-source directives on anchors.

Before Flux inserts a replacement main, its render hook adds `data-view-fade`
to the new view. The shared `view-fade` decoration fades it in over 500ms using CSS
`@starting-style`. Initial page loads appear immediately. The persistent header
and footer stay in place. Reduced-motion preferences disable the transition;
browsers without starting-style support display the destination immediately.

`script/ui/page-effects.es6` disposes page-owned listeners, observers, timers and
animations through Flux's `flux:before-render` event, then initialises the
destination's effects on `flux:after-render`. The shared footer effects initialise
once. This prevents duplicate animation loops and stale element references.

Run `php test/navigation.php` to check which links receive Flux behaviour.

## Flux CSS effects

- Pricing ticks and crosses declare `flux-first-visible`. The reusable viewport-bounce
  decoration transitions their scale from 0.5 to 1 on their first appearance.
- Contribution elements declare `flux-scroll-progress flux-size`. The shared
  scroll-reveal decoration derives the reveal distance from Flux's passage and
  element height, retaining independent blur/opacity transitions for each item.
- Introduction declares the same scroll and size sources. Its rail marker uses
  CSS arithmetic to start at the viewport's upper quarter, travel 1.5 pixels per
  scroll pixel and clamp to the section's bottom.
- The hero declares `flux-pointer-global flux-scroll-progress flux-size`. CSS
  preserves its eased pointer offsets, reset on mouse leave, and scroll blur.
- Circuit backgrounds declare `flux-visible flux-size`. Their renderer consumes
  changed Flux properties through `script/ui/flux-properties.es6`; the same
  adapter watches demo/control sizes and concertina width. Flux owns the shared
  intersection and resize observers, and discovers sources after page updates.

Keep custom JavaScript for application behaviour: generated paths, trains and
shimmers; the interactive logo and favicon; theme preference persistence;
measuring the tallest concertina state; selecting features on mouse hover; and
recognising real taps for individual demo blur pulses. Flux supplies measurements
but does not implement these interactions. The measurement adapter watches Flux
style outputs only, ignoring its own renderer's unrelated style changes.

## Hero circuit background

The hero's decorative SVG is rendered with complete paths by
`class/Graphics/CircuitBackground.php`. Its `CONFIG` block controls the number
of changing routes (`density` and `mobileDensity`), corner radius in CSS pixels,
minimum parallel spacing in radii (`spacing`, default 3),
branch probability per eligible straight segment (`branchChance`, from 0 to 1),
`maxBranches`, and the replacement interval and erase/draw durations in milliseconds.
The two permanent gutter connections are additional to the configured density.
`initialDelay` starts the first replacement after one second; a track is reserved
at startup so passengers cannot postpone it. Later replacements use `interval`.
Short shimmer overlays follow complete tracks in either direction at independently
randomised intervals. `shimmerInterval`, `shimmerDuration` (milliseconds) and
`shimmerLength` (CSS pixels) control their frequency, maximum travel time and
length. Shorter tracks use a shorter duration so the shimmer always travels at
least twice as fast as the squares' peak speed.
They stop when off-screen, hidden or reduced motion is selected, and are removed
before their underlying track is erased.
Density is an upper limit: routes and forks that cannot maintain the spacing
are omitted. Replacements retract completely before growing when there is not
enough room to show both paths with the required clearance.

`script/ui/circuit-background.es6` adapts the SVG to the actual drawing area and
Introduction's gutter stroke centres. It replaces one route at a time using
normalised SVG dash offsets, drawing forks only once their junction is reached.
On mobile, the measured demo bounds guide horizontal runs through the open space
above and below the panel, with their connecting stretch behind it.
A second mobile route passes behind the demo, with its bends off-screen, to
leave the gutter connections clear. A third enters beside the CTA and continues
across the scene to the opposite viewport edge. Desktop uses the same entry rule,
preferring the available space on either side of the button. Complete rounded
paths, including forks, are checked against the measured button and hero text
with a clearance margin. The mobile layout is randomly mirrored to use either
side. The defaults allow four changing desktop
routes, three mobile routes, four stopping squares and two continuously travelling
squares. The two initially parked squares remain ready on page load.
The two gutter paths are never erased. The drawing area reaches into the gap
above the CTA on both mobile and desktop. All routes are clipped
to the drawing area. Animation stops off-screen, in hidden tabs and
for reduced-motion preferences; without JavaScript the initial SVG stays visible.

Run `node test/circuits.mjs` to check the route geometry and branch connections.

Travelling squares are configured in the same `CONFIG` block: `names` and
`colours` are independent shuffled round-robin lists, `trainCount` and
`mobileTrainCount` cap the stopping passengers. `transitTrainCount` and
`mobileTransitTrainCount` control the continuously moving squares. `trainSpeed`,
`stopDuration` and `labelFade` control their journey and label timing.
`gradientEvery` controls the infrequent two-gradient variant. Palette mappings
stay in AWPixel; the base component remains monochrome without the theme.

Squares follow SVG path lengths with sub-pixel translations, ease to a stop,
show their label, then continue. Stops reserve room for both the square and
label outside the demo panels and their floating motion. Occupied tracks are
not replaced; incomplete tracks cannot receive a passenger. Empty tracks are
preferred, with the least occupied suitable track as a fallback. A route waiting
to regenerate closes to new passengers until its current passenger finishes.
In the hero, a non-stopping entry makes the next entry on that same track a
stopping one (`requireStopAfterTransit`). The rule applies in either direction;
if no safe stop fits, another non-stopping square cannot take its place. Track
history follows the actual SVG path, so a freshly regenerated path starts anew.
Movement pauses
when hidden or off-screen, and reduced-motion visitors see stationary squares.
Run `node test/shuffle-bag.mjs` to verify the selection rounds.

The audience section uses the same renderer, geometry and square animation,
configured in `page/_component/audience-circuit.php`. Its two gutter connections
enter from the top; tracks sit behind the cards and avoid the section heading
and CTA. It has three continuously moving squares on mobile and four on desktop,
with no stopping squares or labels, and `requireStopAfterTransit` disabled.
`transitLinear` keeps their speed constant
and `transitStagger` distributes initial positions along the tracks. `redraw` and
`shimmer` are disabled for this quieter decorative treatment. Both scenes pause
off-screen or in hidden tabs and respect reduced-motion preferences.
