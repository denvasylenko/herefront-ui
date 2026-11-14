/* herefront-ui web components: the first five, each like its Apple counterpart (ui-craft/apple-components.md).
   No framework, Shadow DOM, colours and measures only from --hf-* tokens (dist/tokens.css), so a theme repaints them.
   <hf-button>   filled | tinted | gray | plain | destructive | glass; small | medium | large; fires on release
   <hf-segmented> 2–5 options, the thumb slides, ←/→ move the choice, change event
   <hf-toggle>   51×31 switch, the knob stretches while pressed, Space toggles, change event
   <hf-list> + <hf-row>  inset grouped list with header/footer, rows with value, chevron, icon, trailing slot
   <hf-chip>     a token: plain, selectable (aria-pressed) or removable */
(() => {
  if (typeof window === 'undefined' || !window.customElements) return
  const css = (s) => { const t = document.createElement('template'); t.innerHTML = `<style>${s}</style>`; return t }
  const reduced = () => window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches
  const FOCUS = `outline: var(--hf-focus-w, 3px) solid color-mix(in srgb, var(--hf-accent) 45%, transparent); outline-offset: 2px;`
  const BASE = `:host { font-family: var(--hf-font-sans, -apple-system, BlinkMacSystemFont, system-ui, sans-serif); -webkit-tap-highlight-color: transparent; }`

  /* ---------------------------------------------------------------- button */
  const buttonCss = css(`${BASE}
    :host { display: inline-flex; vertical-align: middle; }
    :host([block]) { display: flex; }
    button { all: unset; box-sizing: border-box; flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 6px;
      height: 36px; padding: 0 16px; border-radius: var(--hf-radius-pill); font-size: 15px; font-weight: 600; letter-spacing: -0.01em;
      white-space: nowrap; cursor: pointer; user-select: none; color: var(--hf-ink); background: var(--hf-fill);
      transition: transform .12s ease, filter .12s ease, background-color .2s, opacity .2s; }
    button:focus-visible { ${FOCUS} }
    button:active { transform: scale(var(--hf-press-button, .97)); filter: brightness(.92); }
    :host([size="small"]) button { height: 28px; padding: 0 12px; font-size: 13px; }
    :host([size="large"]) button { height: 50px; padding: 0 22px; font-size: 17px; border-radius: var(--hf-radius-3); }
    :host([variant="filled"]) button { background: var(--hf-accent); color: var(--hf-accent-ink); }
    :host([variant="tinted"]) button { background: var(--hf-accent-soft); color: var(--hf-accent); }
    :host([variant="plain"]) button { background: transparent; color: var(--hf-accent); padding: 0 8px; }
    :host([variant="plain"]) button:active { filter: none; opacity: .55; }
    :host([variant="destructive"]) button { background: var(--hf-danger-soft); color: var(--hf-danger); }
    :host([variant="glass"]) button { background: var(--hf-bar-bg); color: var(--hf-ink);
      -webkit-backdrop-filter: saturate(var(--hf-glass-sat)) blur(var(--hf-glass-blur)); backdrop-filter: saturate(var(--hf-glass-sat)) blur(var(--hf-glass-blur));
      box-shadow: inset 0 .5px 0 var(--hf-glass-rim), 0 0 0 .5px var(--hf-glass-edge); }
    :host([disabled]) button { opacity: .4; cursor: default; transform: none; filter: none; }
    ::slotted(svg), ::slotted([slot="icon"]) { width: 18px; height: 18px; flex: none; }
    @media (prefers-reduced-motion: reduce) { button { transition: none; } button:active { transform: none; } }`)
  class HfButton extends HTMLElement {
    static observedAttributes = ['disabled']
    constructor() {
      super()
      const r = this.attachShadow({ mode: 'open', delegatesFocus: true })
      r.append(buttonCss.content.cloneNode(true))
      this._b = Object.assign(document.createElement('button'), { type: 'button' })
      this._b.setAttribute('part', 'button')
      this._b.innerHTML = '<slot name="icon"></slot><slot></slot>'
      r.append(this._b)
      // a disabled button does not fire: stop the click before it reaches the page's listeners
      this.addEventListener('click', (e) => { if (this.hasAttribute('disabled')) { e.stopImmediatePropagation(); e.preventDefault() } }, true)
    }
    attributeChangedCallback() { this._b.disabled = this.hasAttribute('disabled'); this._b.setAttribute('aria-disabled', String(this.hasAttribute('disabled'))) }
    get disabled() { return this.hasAttribute('disabled') }
    set disabled(v) { this.toggleAttribute('disabled', !!v) }
  }

  /* ---------------------------------------------------------------- segmented */
  const segCss = css(`${BASE}
    :host { display: inline-block; max-width: 100%; }
    :host([block]) { display: block; }
    .track { position: relative; display: grid; grid-auto-flow: column; grid-auto-columns: 1fr; padding: var(--hf-seg-pad, 2px);
      border-radius: var(--hf-seg-r, 9px); background: var(--hf-fill); }  /* Apple: rgba(118,118,128,.12) light / .24 dark */
    .thumb { position: absolute; top: var(--hf-seg-pad, 2px); bottom: var(--hf-seg-pad, 2px); left: 0; border-radius: var(--hf-seg-thumb-r, 7px);
      background: var(--hf-seg-on); box-shadow: 0 1px 3px rgba(0, 0, 0, .12), 0 0 0 .5px rgba(0, 0, 0, .04);
      transition: transform var(--hf-motion-dur, .24s) var(--hf-motion-spring), width var(--hf-motion-dur, .24s) var(--hf-motion-ease); }
    button { all: unset; box-sizing: border-box; position: relative; z-index: 1; min-width: 0; height: 28px; padding: 0 12px; text-align: center;
      font-size: 13px; font-weight: 500; color: var(--hf-ink); cursor: pointer; border-radius: var(--hf-seg-thumb-r, 7px); white-space: nowrap;
      transition: opacity .15s; }
    button[aria-checked="true"] { font-weight: 600; color: var(--hf-seg-on-ink); }
    button:not([aria-checked="true"]):active { opacity: .5; }
    button:focus-visible { ${FOCUS} }
    :host([size="large"]) button { height: 34px; font-size: 15px; }
    @media (prefers-reduced-motion: reduce) { .thumb { transition: none; } }`)
  class HfSegmented extends HTMLElement {
    constructor() {
      super()
      const r = this.attachShadow({ mode: 'open' })
      r.append(segCss.content.cloneNode(true))
      this._t = document.createElement('div'); this._t.className = 'track'; this._t.setAttribute('role', 'radiogroup'); this._t.setAttribute('part', 'track')
      this._th = document.createElement('i'); this._th.className = 'thumb'; this._th.setAttribute('part', 'thumb')
      this._t.append(this._th); r.append(this._t)
      this._ro = new ResizeObserver(() => this._place(false))
    }
    connectedCallback() {
      this._build()
      this._mo = new MutationObserver(() => this._build()); this._mo.observe(this, { childList: true, subtree: true, characterData: true })
      this._ro.observe(this)
    }
    disconnectedCallback() { this._mo?.disconnect(); this._ro.disconnect() }
    static observedAttributes = ['value', 'aria-label']
    attributeChangedCallback(n) { if (n === 'aria-label') this._t.setAttribute('aria-label', this.getAttribute('aria-label') || ''); else if (this._btns) this._sync(true) }
    get value() { return this.getAttribute('value') ?? this._opts?.[0]?.value ?? '' }
    set value(v) { this.setAttribute('value', v) }
    _build() {
      this._opts = [...this.querySelectorAll('option')].map((o) => ({ value: o.value, label: o.textContent.trim() }))
      this._btns?.forEach((b) => b.remove())
      this._btns = this._opts.map((o, i) => {
        const b = document.createElement('button'); b.type = 'button'; b.textContent = o.label; b.setAttribute('role', 'radio'); b.setAttribute('part', 'segment')
        b.addEventListener('click', () => this._pick(o.value))
        b.addEventListener('keydown', (e) => {
          const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]
          if (!step) return
          e.preventDefault()
          const j = (i + step + this._opts.length) % this._opts.length
          this._pick(this._opts[j].value); this._btns[j].focus()
        })
        this._t.append(b); return b
      })
      this._sync(false)
    }
    _pick(v) {
      if (v === this.value) return
      this.setAttribute('value', v)
      this.dispatchEvent(new CustomEvent('change', { detail: { value: v }, bubbles: true }))
    }
    _sync(animate) {
      const v = this.value
      this._btns.forEach((b, i) => { const on = this._opts[i].value === v; b.setAttribute('aria-checked', String(on)); b.tabIndex = on ? 0 : -1 })
      this._place(animate)
    }
    _place(animate) {
      const i = Math.max(0, this._opts.findIndex((o) => o.value === this.value)), b = this._btns[i]
      if (!b) return
      if (!animate || reduced()) this._th.style.transition = 'none'
      this._th.style.width = b.offsetWidth + 'px'
      this._th.style.transform = `translateX(${b.offsetLeft}px)`
      if (!animate || reduced()) { void this._th.offsetWidth; this._th.style.transition = '' }
    }
  }

  /* ---------------------------------------------------------------- toggle */
  const toggleCss = css(`${BASE}
    :host { display: inline-flex; align-items: center; gap: 10px; vertical-align: middle; cursor: pointer; user-select: none; color: var(--hf-ink); font-size: 15px; }
    button { all: unset; box-sizing: border-box; position: relative; flex: none; width: 51px; height: 31px; border-radius: 999px;
      background: var(--hf-fill); transition: background-color var(--hf-motion-dur, .24s) var(--hf-motion-ease); cursor: pointer; }
    button::after { content: ""; position: absolute; top: 2px; left: 2px; width: 27px; height: 27px; border-radius: 999px; background: var(--hf-knob);
      box-shadow: 0 3px 8px rgba(0, 0, 0, .15), 0 1px 1px rgba(0, 0, 0, .16), 0 0 0 .5px rgba(0, 0, 0, .04);
      transition: left var(--hf-motion-dur, .24s) var(--hf-motion-spring), width .2s var(--hf-motion-ease); }
    button:active::after { width: 33px; }
    button[aria-checked="true"] { background: var(--hf-switch, var(--hf-ok)); }
    button[aria-checked="true"]::after { left: 22px; }
    button[aria-checked="true"]:active::after { left: 16px; }
    button:focus-visible { ${FOCUS} }
    :host([disabled]) { opacity: .4; cursor: default; pointer-events: none; }
    @media (prefers-reduced-motion: reduce) { button, button::after { transition: none; } }`)
  class HfToggle extends HTMLElement {
    static observedAttributes = ['checked', 'disabled', 'aria-label']
    constructor() {
      super()
      const r = this.attachShadow({ mode: 'open', delegatesFocus: true })
      r.append(toggleCss.content.cloneNode(true))
      this._b = Object.assign(document.createElement('button'), { type: 'button' })
      this._b.setAttribute('role', 'switch'); this._b.setAttribute('part', 'switch')
      const label = document.createElement('slot')
      r.append(label, this._b)
      // the whole row toggles (the label too), as in Settings
      this.addEventListener('click', () => { if (!this.hasAttribute('disabled')) this._flip() })
      // Space and Enter on the inner <button> fire a click, which the row listener above turns into one flip
    }
    connectedCallback() { this._sync() }
    attributeChangedCallback() { this._sync() }
    _sync() {
      this._b.setAttribute('aria-checked', String(this.checked))
      this._b.setAttribute('aria-label', this.getAttribute('aria-label') || this.textContent.trim())
      this._b.disabled = this.hasAttribute('disabled')
    }
    _flip() {
      this.checked = !this.checked
      this.dispatchEvent(new CustomEvent('change', { detail: { checked: this.checked }, bubbles: true }))
    }
    get checked() { return this.hasAttribute('checked') }
    set checked(v) { this.toggleAttribute('checked', !!v) }
  }

  /* ---------------------------------------------------------------- list + row */
  const listCss = css(`${BASE}
    :host { display: block; margin: 0 0 var(--hf-space-7, 24px); }
    .head, .foot { padding: 0 var(--hf-row-pad, 16px); font-size: 13px; color: var(--hf-ink-2); }
    .head { margin: 0 0 6px; text-transform: none; }
    .foot { margin: 6px 0 0; line-height: 1.35; }
    .group { background: var(--hf-panel); border-radius: var(--hf-radius-3); overflow: hidden; box-shadow: var(--hf-shadow-1); }
    .head:empty, .foot:empty { display: none; }`)
  class HfList extends HTMLElement {
    static observedAttributes = ['header', 'footer']
    constructor() {
      super()
      const r = this.attachShadow({ mode: 'open' })
      r.append(listCss.content.cloneNode(true))
      this._h = document.createElement('div'); this._h.className = 'head'; this._h.setAttribute('part', 'header')
      const g = document.createElement('div'); g.className = 'group'; g.setAttribute('part', 'group'); g.setAttribute('role', 'list'); g.innerHTML = '<slot></slot>'
      this._f = document.createElement('div'); this._f.className = 'foot'; this._f.setAttribute('part', 'footer')
      r.append(this._h, g, this._f)
    }
    attributeChangedCallback() { this._h.textContent = this.getAttribute('header') || ''; this._f.textContent = this.getAttribute('footer') || '' }
  }
  const rowCss = css(`${BASE}
    :host { display: block; position: relative; }
    .row { all: unset; box-sizing: border-box; display: flex; align-items: center; gap: 12px; width: 100%; min-height: var(--hf-row-h, 44px);
      padding: 8px var(--hf-row-pad, 16px); color: var(--hf-ink); font-size: 16px; line-height: 1.3; text-decoration: none; }
    a.row, button.row { cursor: pointer; }
    a.row:active, button.row:active { background: color-mix(in srgb, var(--hf-ink) var(--hf-tint-press, 8%), transparent); }
    a.row:focus-visible, button.row:focus-visible { ${FOCUS} outline-offset: -3px; }
    .title { flex: 1; min-width: 0; }
    .sub { display: block; font-size: 13px; color: var(--hf-ink-2); margin-top: 1px; }
    .value { color: var(--hf-ink-2); font-size: 16px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 50%; }
    .chev { width: 8px; height: 13px; flex: none; color: var(--hf-ink-3); }
    ::slotted([slot="icon"]) { width: 29px; height: 29px; flex: none; border-radius: 7px; display: grid; place-items: center; }
    :host(:not(:last-child))::after { content: ""; position: absolute; left: var(--hf-row-inset, 16px); right: 0; bottom: 0;
      border-bottom: var(--hf-row-sep, .5px) solid var(--hf-line-strong); }
    :host([has-icon]:not(:last-child))::after { left: calc(var(--hf-row-pad, 16px) + 41px); }
    :host([destructive]) .title { color: var(--hf-danger); }`)
  class HfRow extends HTMLElement {
    static observedAttributes = ['title', 'subtitle', 'value', 'href', 'nav']
    constructor() {
      super()
      this.attachShadow({ mode: 'open' }).append(rowCss.content.cloneNode(true))
    }
    connectedCallback() { this.setAttribute('role', 'listitem'); this._render() }
    attributeChangedCallback() { if (this.isConnected) this._render() }
    _render() {
      const href = this.getAttribute('href'), nav = href || this.hasAttribute('nav')
      const r = this.shadowRoot
      r.querySelector('.row')?.remove()
      const el = href ? Object.assign(document.createElement('a'), { href }) : document.createElement(this.hasAttribute('nav') ? 'button' : 'div')
      if (el.tagName === 'BUTTON') el.type = 'button'
      el.className = 'row'; el.setAttribute('part', 'row')
      const t = document.createElement('span'); t.className = 'title'; t.setAttribute('part', 'title'); t.textContent = this.getAttribute('title') || ''
      if (this.getAttribute('subtitle')) { const s = document.createElement('span'); s.className = 'sub'; s.textContent = this.getAttribute('subtitle'); t.append(s) }
      el.append(Object.assign(document.createElement('slot'), { name: 'icon' }), t)
      if (this.getAttribute('value')) { const v = document.createElement('span'); v.className = 'value'; v.setAttribute('part', 'value'); v.textContent = this.getAttribute('value'); el.append(v) }
      el.append(document.createElement('slot'))
      if (nav) el.insertAdjacentHTML('beforeend', '<svg class="chev" part="chevron" viewBox="0 0 8 13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1.5 1.5 6.5 6.5 1.5 11.5"/></svg>')
      r.append(el)
      this.toggleAttribute('has-icon', !!this.querySelector('[slot="icon"]'))
    }
  }

  /* ---------------------------------------------------------------- chip */
  const chipCss = css(`${BASE}
    :host { display: inline-flex; vertical-align: middle; }
    .chip { all: unset; box-sizing: border-box; display: inline-flex; align-items: center; gap: 6px; height: 32px; padding: 0 14px;
      border-radius: var(--hf-radius-pill); background: var(--hf-panel); color: var(--hf-ink); font-size: 14px; font-weight: 500; white-space: nowrap;
      box-shadow: inset 0 0 0 1px var(--hf-line-strong); cursor: pointer; transition: background-color .15s, transform .12s; }
    .chip:active { transform: scale(var(--hf-press-button, .97)); }
    .chip:focus-visible { ${FOCUS} }
    .chip[aria-pressed="true"] { background: var(--hf-ink); color: var(--hf-bg); box-shadow: none; }
    .x { all: unset; display: grid; place-items: center; width: 18px; height: 18px; margin-right: -6px; border-radius: 999px; color: var(--hf-ink-2); cursor: pointer; }
    .x:hover { background: var(--hf-fill); }
    .x:focus-visible { ${FOCUS} }
    ::slotted([slot="icon"]) { width: 16px; height: 16px; }
    :host([disabled]) { opacity: .4; pointer-events: none; }
    @media (prefers-reduced-motion: reduce) { .chip { transition: none; } .chip:active { transform: none; } }`)
  class HfChip extends HTMLElement {
    static observedAttributes = ['selected', 'removable', 'selectable']
    constructor() {
      super()
      const r = this.attachShadow({ mode: 'open' })
      r.append(chipCss.content.cloneNode(true))
      this._c = Object.assign(document.createElement('button'), { type: 'button', className: 'chip' })
      this._c.setAttribute('part', 'chip')
      this._c.innerHTML = '<slot name="icon"></slot><slot></slot>'
      r.append(this._c)
      this._c.addEventListener('click', () => {
        if (!this.hasAttribute('selectable')) return
        this.toggleAttribute('selected')
        this.dispatchEvent(new CustomEvent('change', { detail: { selected: this.hasAttribute('selected') }, bubbles: true }))
      })
    }
    connectedCallback() { this._sync() }
    attributeChangedCallback() { this._sync() }
    _sync() {
      if (this.hasAttribute('selectable')) this._c.setAttribute('aria-pressed', String(this.hasAttribute('selected'))); else this._c.removeAttribute('aria-pressed')
      this._c.querySelector('.x')?.remove()
      if (this.hasAttribute('removable')) {
        const x = Object.assign(document.createElement('span'), { className: 'x', tabIndex: 0, role: 'button' })
        x.setAttribute('part', 'remove'); x.setAttribute('aria-label', this.getAttribute('remove-label') || 'Remove')
        x.innerHTML = '<svg width="10" height="10" viewBox="0 0 10 10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M2 2l6 6M8 2 2 8"/></svg>'
        const out = (e) => { e.stopPropagation(); this.dispatchEvent(new CustomEvent('remove', { bubbles: true })) }
        x.addEventListener('click', out)
        x.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ' || e.key === 'Backspace' || e.key === 'Delete') { e.preventDefault(); out(e) } })
        this._c.append(x)
      }
    }
  }

  const define = (n, c) => { if (!customElements.get(n)) customElements.define(n, c) }
  define('hf-button', HfButton); define('hf-segmented', HfSegmented); define('hf-toggle', HfToggle)
  define('hf-list', HfList); define('hf-row', HfRow); define('hf-chip', HfChip)
})()
