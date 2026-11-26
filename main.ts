// makefun-x-reposts-02 entry (Node 22, standard library only, no network, no secrets).
//
// The entry is the X posts themselves: one quote post answering make.fun's
// newest X post about the idle game that made $19,513 on Steam. This program
// only validates POSTS.json and copies it byte-identical to the output dir,
// where the house reads it. Nothing written here is scored.
//
// Local run, exactly as the grader runs it:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// One X post address, as X's Share button gives it: https://x.com/<handle>/status/<id>
const POST_URL = /^https:\/\/x\.com\/[^/]+\/status\/\d+$/;
const PLACEHOLDER = 'https://x.com/<handle>/status/<id>';

function fail(message: string): never {
  console.error(`makefun-x-reposts-02: ${message}`);
  process.exit(1);
}

const sourcePath = join(BOT_DIR, 'POSTS.json');

let raw: Buffer;
try {
  raw = readFileSync(sourcePath);
} catch (err) {
  fail(`could not read ${sourcePath}: ${(err as Error).message}`);
}

let parsed: unknown;
try {
  parsed = JSON.parse(raw!.toString('utf8'));
} catch (err) {
  fail(`POSTS.json is not valid JSON: ${(err as Error).message}`);
}

if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
  fail('POSTS.json must be a JSON object with a "posts" array');
}

const posts = (parsed as { posts?: unknown }).posts;
if (!Array.isArray(posts)) {
  fail('POSTS.json must hold a "posts" array');
}
if (posts.length < 1 || posts.length > 15) {
  fail(`POSTS.json must list 1 to 15 posts, found ${posts.length}`);
}

if (raw!.length > 16384) {
  fail(`POSTS.json is ${raw!.length} bytes, over the 16384-byte limit`);
}

const seen = new Set<string>();
for (const post of posts) {
  if (typeof post !== 'string') {
    fail(`every post must be a URL string, found ${JSON.stringify(post)}`);
  }
  if (seen.has(post)) {
    fail(`POSTS.json names the same post twice: ${post}`);
  }
  seen.add(post);
  if (post === PLACEHOLDER || post.includes('<handle>') || post.includes('<id>')) {
    fail(`POSTS.json still holds the starter placeholder ${PLACEHOLDER}; replace it with a real post address`);
  }
  if (!POST_URL.test(post)) {
    fail(`not a valid X post address: ${post}`);
  }
}

try {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(join(OUTPUT_DIR, 'POSTS.json'), raw!);
} catch (err) {
  fail(`could not write POSTS.json to ${OUTPUT_DIR}: ${(err as Error).message}`);
}
