import { test } from 'node:test'
import assert from 'node:assert/strict'
import { load, tokensCss, compatCss, iosCss, DEFAULT_THEME } from '../build/build.mjs'

const all = load()

test('every theme has the colours of the default theme (a component never meets an unset colour)', () => {
  const need = Object.keys(all.themes[DEFAULT_THEME].light)
  for (const [id, t] of Object.entries(all.themes)) {
    for (const k of need) assert.ok(k in t.light, `${id}.light has no ${k}`)
    if (t.scheme === 'auto') for (const k of need) if (k !== 'font-sans') assert.ok(k in t.dark, `${id}.dark has no ${k}`)
  }
})

test('every compat alias points at a token that exists somewhere', () => {
  const themeKeys = new Set(Object.values(all.themes).flatMap((t) => [...Object.keys(t.light), ...Object.keys(t.dark)]))
  for (const [old, spec] of Object.entries(all.compat.theme)) {
    const tok = typeof spec === 'string' ? spec : spec.token
    assert.ok(themeKeys.has(tok), `${old} → ${tok}`)
  }
  assert.doesNotThrow(() => compatCss(all))
})

test('values are plain CSS values: they end up in <style>', () => {
  const bad = /[;{}<>]|\/\*|url\(/i
  for (const t of all.base) assert.ok(!bad.test(t.value), t.name)
  for (const [id, t] of Object.entries(all.themes)) for (const [k, v] of Object.entries({ ...t.light, ...t.dark })) assert.ok(!bad.test(v), `${id}.${k}`)
})

test('the sites get measures only, never a colour of a palette', () => {
  const css = iosCss(all)
  assert.match(css, /--ios-row-h: 44px;/)
  assert.ok(!/#[0-9a-f]{3,6}\b/i.test(css))
})

test('the default theme keeps the weight of :root so a theme injected later still wins', () => {
  const css = tokensCss(all)
  assert.match(css, /^:root, \[data-hf-theme="dashboard"\] \{/m)
  assert.match(css, /:root\[data-hf-theme="herefront"\], \[data-hf-theme="herefront"\] \{/)
})
