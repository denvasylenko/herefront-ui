# herefront-ui

Design tokens, themes and (soon) web components shared by the Herefront products and Duchess.

```bash
npm run build        # tokens/*.json → dist/
npm test
npm run sync:cheese  # copy the built files into the Cheese repo
```

- `tokens/base.json` — measures (radius, space, motion, glass, focus, highlight…), `--hf-*`.
- `tokens/themes/*.json` — colours per theme: `dashboard` (default, light/dark), `herefront` (light).
- `tokens/compat.json` — the old variable names, aliased while the products move over.

Use a theme on any element: `<div data-hf-theme="herefront">`, force a scheme with `data-hf-scheme="dark"`.
