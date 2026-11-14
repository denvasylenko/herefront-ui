# herefront-ui — notes for the agent

The design system of every Herefront product (dashboard and admin, client cabinet, herefront.com and its chat, demo and
client sites, the bot images) and of Duchess (`<agui-chat>`, field-highlight, its docs). The owner of this repository is
the session «Head of Design · UI/UX expert». The user speaks Russian; code and comments are in English.

The plan: `docs/design-system-plan.md` in the Cheese repo (a sibling folder, see `sync:cheese` in package.json).

## Rules

- **Public repo** github.com/denvasylenko/herefront-ui (owner, 14.11.2026). Push only your own commits; nothing private (paths, people, keys) in files.
- One source of truth: `tokens/*.json`. `dist/` and the copies in the products are generated — never edit them by hand.
- A product file is changed only by the owner of that zone, or with their explicit "yes" (Cheese CLAUDE.md, org rules).
  `build/sync.mjs` writes only the files listed in `TARGETS`.
- Every step keeps the products looking the same unless the step is meant to change the look. Proof: computed styles of
  every element before/after, fresh load each time (dashboard «Компании», «Компоненты»; cabinet «Сегодня», «Заявки»,
  «Настройки»; 1280 and 390, light and dark) — zero differences.
- The standard is the `ui-craft` skill (Apple components, Revolut path, Telegram speed). Until it moves here, its only
  copy is `.claude/skills/ui-craft/` in the Cheese repo.

## Tokens (step 1, done 14.11.2026)

- `tokens/base.json` — measures shared by all themes (radius, space, size, text, weight, row, tint, seg, press, motion,
  glass, focus, hl). CSS name `--hf-<group>-<key>`; `$legacy` gives the old `--ios-*` name the sites read.
- `tokens/themes/<id>.json` — colours, shadows, font per theme; `$scheme` auto | light | dark. `dashboard` is the default
  (on `:root`, weight 0,1,0 so a theme the dashboard injects later still wins); `herefront` is light-only, turned on by
  `data-hf-theme="herefront"` (the cabinet's `<html>`). Any container: `data-hf-theme`, `data-hf-scheme="light|dark"`.
  A new theme must have every key of `dashboard` (test).
- `tokens/compat.json` — old names (`--bg`, `--muted`, `--good`, `--radius`, `--font`…) → token. Emitted as aliases on the
  same elements as the theme values. Delete an entry when grep finds no reader.
- Build: `npm run build` → `dist/tokens.css`, `compat.css`, `ios-tokens.css` (sites: measures only, no palette colours),
  `tokens.json` (Python, bot images). Tests: `npm test`. Into Cheese: `npm run sync:cheese` → `frontend/ui/tokens.css`,
  `frontend/ui/compat.css`, `backend/app/site/ios-tokens.css`.

## Next

2. agui-chat and field-highlight read `--hf-*` (through the Duchess Owner). 3–4. Web components `hf-*` (button,
segmented, toggle, list/row, chip; then sheet, select/menu, text-field, badge, tab-bar) + React wrappers in
`frontend/kit`. 5. Sites. 6. Duchess docs. 7. Remove compat and the old kit CSS.
