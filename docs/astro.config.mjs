// The documentation of herefront-ui: one site for every product and Duchess. Same stack as the Duchess docs (Starlight,
// topic tabs in the header, Starlight search on ⌘K). Tokens and themes are read from ../dist at build time, so the
// pages never lag behind the JSON.
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightSidebarTopics from 'starlight-sidebar-topics';

const repo = 'https://github.com/denvasylenko/herefront-ui';
const base = process.env.DOCS_BASE ?? '/herefront-ui';
export default defineConfig({
  site: process.env.DOCS_SITE ?? 'https://denvasylenko.github.io',
  base: process.env.DOCS_BASE ?? '/herefront-ui',
  vite: { server: { fs: { allow: ['..'] } } },
  integrations: [
    starlight({
      title: 'Herefront UI',
      description: 'Tokens, themes and components shared by every Herefront product.',
      social: [{ icon: 'github', label: 'GitHub', href: repo }],
      editLink: { baseUrl: `${repo}/edit/main/docs/` },
      lastUpdated: false,
      customCss: ['./src/styles/docs.css'],
      head: [
        { tag: 'link', attrs: { rel: 'stylesheet', href: `${base}/hf/tokens.css` } },
        { tag: 'script', attrs: { src: `${base}/hf/components.js`, defer: true } },
        // the tokens follow the docs' own Light / Dark switch (Starlight sets data-theme on <html>), not only the OS
        { tag: 'script', content: "(function(){var h=document.documentElement;function s(){h.setAttribute('data-hf-scheme',h.dataset.theme==='light'?'light':'dark')}s();new MutationObserver(s).observe(h,{attributes:true,attributeFilter:['data-theme']})})()" },
      ],
      plugins: [starlightSidebarTopics([
        { label: 'Get started', link: '/get-started/', icon: 'rocket', items: [
          { label: 'What it is', slug: 'get-started' },
          { label: 'React', slug: 'get-started/react' },
          { label: 'Web component', slug: 'get-started/web-component' },
          { label: 'Jinja site', slug: 'get-started/jinja' },
        ] },
        { label: 'Tokens', link: '/tokens/', icon: 'seti:css', items: [{ label: 'All tokens', slug: 'tokens' }] },
        { label: 'Themes', link: '/themes/', icon: 'star', items: [{ label: 'Themes', slug: 'themes' }] },
        { label: 'Components', link: '/components/', icon: 'puzzle', items: [
          { label: 'Overview', slug: 'components' },
          { label: 'Button', slug: 'components/button' },
          { label: 'Segmented control', slug: 'components/segmented' },
          { label: 'Toggle', slug: 'components/toggle' },
          { label: 'List', slug: 'components/list' },
          { label: 'Chip', slug: 'components/chip' },
        ] },
        { label: 'Guidelines', link: '/guidelines/', icon: 'open-book', items: [{ label: 'The twelve laws', slug: 'guidelines' }] },
      ])],
    }),
  ],
});
