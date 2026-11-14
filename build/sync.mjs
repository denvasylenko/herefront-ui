// Copies the built tokens into a product checkout (until the packages are published: the owner decides public/private).
//   node build/sync.mjs cheese <path to the Cheese repo>
// Writes only these files, each with a "generated, version" header; nothing else in the product is touched.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'
import { build } from './build.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'))

export const TARGETS = {
  // Cheese: dashboard + cabinet read frontend/ui/*, the kit and the sites read backend/app/site/ios-tokens.css
  cheese: { 'tokens.css': 'frontend/ui/tokens.css', 'compat.css': 'frontend/ui/compat.css', 'ios-tokens.css': 'backend/app/site/ios-tokens.css' },
}

function version() {
  let rev = ''
  try { rev = execSync('git rev-parse --short HEAD', { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim() } catch {}
  return pkg.version + (rev ? '+' + rev : '')
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [kind, dest] = process.argv.slice(2)
  const map = TARGETS[kind]
  if (!map || !dest || !existsSync(dest)) { console.error('usage: node build/sync.mjs cheese <path>'); process.exit(2) }
  const files = build(), v = version()
  for (const [src, rel] of Object.entries(map)) {
    const out = join(dest, rel)
    mkdirSync(dirname(out), { recursive: true })
    writeFileSync(out, files[src].replace('*/\n', `Version ${v}. */\n`))
    console.log(`${rel}  ← dist/${src}  (${v})`)
  }
}
