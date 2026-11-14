// Builds the tokens and copies dist/ into public/hf so the pages load the real tokens.css (live samples and themes).
import { cpSync, mkdirSync } from 'node:fs';
import { execSync } from 'node:child_process';
execSync('node build/build.mjs', { cwd: new URL('../..', import.meta.url), stdio: 'inherit' });
mkdirSync(new URL('../public/hf', import.meta.url), { recursive: true });
cpSync(new URL('../../dist', import.meta.url), new URL('../public/hf', import.meta.url), { recursive: true });
