# Stylesheet structure

Use Flair's base objects, patterns and decorations first. Keep AWPixel's palette
and visual overrides in `theme/awpixel.scss`. Build layouts mobile-first and add
enhancements with `(width > $breakpoint)` media or container queries.

## Responsive rules

Use range syntax: `@media (width > $breakpoint)` or
`@container name (width > $breakpoint)`. Never use `min-width`, `max-width`
or upper-bound width conditions in queries. Put small-screen behaviour in the
base declarations; enhancements apply strictly above their breakpoint.

Nest each media or container query inside the narrowest selector shared by its adjustments.
For a change to one selector, put the properties directly inside its query:

```scss
.card-title {
	font-size: 1rem;

	@media (width > 40rem) {
		font-size: 1.25rem;
	}
}
```

Keep related parent/child changes together when they implement one layout or
interaction. The parent selector is already the query's scope, so do not repeat
it inside the query. Independent overrides belong beside their own base styles.
Queries in declaration mixins inherit the selector where the mixin is included.

The structure check rejects unscoped responsive queries and queries that merely wrap
one selector. Choosing which related adjustments to group remains a code-review
decision.

Prefer a named container query when a component's available space determines
its layout. Declare `container: name / inline-size` on its containing element,
and query that container from its descendants. A container cannot query its own
size to style itself. Sass variables in container conditions need interpolation,
for example `@container cards (width > #{flair.$break-wide})`. Keep viewport queries for coordinated page layouts,
viewport framing and device capabilities; do not replace those mechanically.

Article listings query their own grid width, contribution notices query their
illustration column, pricing summaries query their panel, and the footer
wordmark queries its brand row. Keep query declarations nested in the affected
selector just as with media queries.

## Components

`component/name.scss` is only for a WebEngine component with a matching
`page/_component/name.html`. It has one top-level selector: `name { ... }`.
Keep its media queries and internal selectors inside that boundary.

```scss
@use "../../node_modules/flair/style/lib/flair";

site-header {
	> header {
		@extend %o-panel;

		.site-menu-button { @extend %o-button; }
	}
}
```

Semantic wrappers such as `header` and `section` keep their layout and landmarks.
Internal classes remain useful hooks for the component, theme and scripts;
they must not become independent, global component selectors. A component must
not style its parent or another component's internals.

## Reusable layers

- `object/`: individual elements, with `%o-` placeholders.
- `pattern/`: compositions of objects, with `%p-` placeholders.
- `decoration/`: appearance or motion treatments, with `%d-` placeholders.
- `variable/` and `font/`: shared sizing, spacing and font definitions.

Each object, pattern and decoration file defines exactly one root placeholder,
matching its filename and layer. For example, `decoration/glass-panel.scss`
defines `%d-glass-panel`. Keep media/supports queries and internal selectors
inside that root. Put independent patterns into separate files.

Use nested `&` selectors for logical derivatives of a treatment:

```scss
%d-floating {
	// Shared floating treatment.

	&-entrance {
		@extend %d-floating;
		// Additional entrance treatment.
	}
}
```

Keyframes belong inside the decoration that uses them; Sass emits the animation
definitions at the correct CSS scope. Typed `@property` registrations are global
CSS definitions in `style.scss`, after its `@use` declarations. Nesting them
under selectors would produce invalid registrations.

Consumers extend these placeholders through component or page selectors, or
through global rules in `style.scss` after all `@use` declarations. Reusable
layers do not attach themselves to arbitrary page classes. For example,
both circuit components extend `%o-circuit-background`; neither component owns
the other one's positioning or shared square styling.

## Pages

`page/` composes the reusable layers for markup that isn't a custom component:

- `_common.scss`: `body { ... }`, for shared page structure, content pages,
  footer and site-wide link/reveal treatments.
- `articles.scss`: `body.dir--articles { ... }`, covering the article directory.
- `help.scss`: `body.uri--help { ... }`, for the Help page's curated links.

Use `body.uri--name` for an individual page and `body.dir--name` for a directory.
The footer comes from `page/_footer.html`, so its reusable pattern is composed
in `_common.scss`; it is not a WebEngine component.

`style.scss` configures Flair and loads the layers, component and page modules.
Do not use `@at-root` to escape a component or page boundary.

Run `node test/style-structure.mjs` to check component/page boundaries, one
matching root placeholder per reusable file, and mobile-first queries.
Run `gt build` to compile the stylesheets.
