# Authwave website

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

Section and navigation controls use HTML and CSS without JavaScript.
The header uses Flair's panel, navigation and `%o-popover` definitions. Its MENU
button targets a native `popover="auto"` below 60rem. The browser handles opening,
Escape and clicking outside. Separate in-flow links are always visible on desktop,
including when resizing with the mobile popover open.

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
`style/component/site-footer.scss`. It uses a highlight frame, the shared CTA,
two navigation columns, the existing interactive logo and a Morion wordmark.
The logo has a static SVG fallback when JavaScript is disabled. Social links
include external-link indicators; LinkedIn currently links to its homepage.

The header logo uses `/asset/logo.svg` as a CSS mask.
Run `npm install`, `gt build`, then `gt run -p 8080` to develop locally. Flair is
linked from `../../BrightFlair/flair`, with its definitions in `style/lib`.

The earlier design is saved on the local branch `new-design-before-guidance`.
