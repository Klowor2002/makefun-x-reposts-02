# makefun-x-reposts-02 — agent note

This repo is a one-post entry for make.fun's "Get the most reposts and likes
on make.fun's newest X posts" bounty ($500, top 50 share it).

The entry is a single quote post from the public X account @Ryukiputra17,
answering make.fun's newest post about the idle game that made $19,513 on
Steam (https://x.com/makefunai/status/2125609728088666351). The quote adds
its own words, names make.fun and @makefunai, and carries the play code
`makefun-sandbar-sauce-barnyard`. It is live at
https://x.com/Ryukiputra17/status/2125819797405650979 and listed in
`POSTS.json`.

`main.ts` is the whole program: it reads `POSTS.json` from `MAKEFUN_BOT_DIR`
(default `/bot`), checks it is a JSON object with a `posts` array of 1–15
valid X post addresses (the starter placeholder is rejected with a clear
error), and copies it byte-identical into `MAKEFUN_OUTPUT_DIR` (default
`/output`). It uses only the Node standard library, touches no network and
reads no secrets. Score is 2 points per repost and per quote, 1 per like,
read by the house from X at the deadline; keep the post up and the account
public until the results are out.
