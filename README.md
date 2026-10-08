# Authwave website

The website is reset to an empty homepage with shared document header and footer.
`style/style.scss` loads Flair's base theme and typography, plus the local Ubuntu
and Morion fonts. No website design or AWPixel theme is currently applied.

The pre-existing interactive logo source remains available in
`page/_component/interactive-logo.html`, `script/component/interactive-logo.es6`
and `style/component/interactive-logo.scss`, ready for later use.

Run `npm install`, `gt build`, then `gt run -p 8080` to develop locally. Flair is
linked from `../../BrightFlair/flair`.

The design implementation before this reset is saved on the local branch
`new-design-before-guidance`.
