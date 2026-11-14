# herefront-ui

The design system of Herefront: design tokens and themes (and soon web components) shared by every Herefront product and by Duchess (`<agui-chat>`).

## Use it

The built files are in `dist/`:

```html
<link rel="stylesheet" href="dist/tokens.css">   <!-- --hf-* variables and the themes -->
<html data-hf-theme="herefront">                  <!-- pick a theme; the default is "dashboard" (light and dark) -->
```

```css
.card { background: var(--hf-panel); color: var(--hf-ink); border-radius: var(--hf-radius-3); }
```

Any element can wear another theme or scheme: `<div data-hf-theme="herefront">`, `<div data-hf-scheme="dark">`.
`dist/tokens.json` has the same values for Python and other tools.

## Develop

```bash
npm run build   # tokens/*.json → dist/
npm test
```

- `tokens/base.json` — measures (radius, space, type, motion, glass, focus, highlight), `--hf-*`.
- `tokens/themes/*.json` — colours per theme.
- `tokens/compat.json` — older variable names kept as aliases while products move over.
