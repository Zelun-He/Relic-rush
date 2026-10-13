# Relic Rush

A daily trivia treasure hunt set in original pixel-art jungle ruins. Inspired by the colorful tiled environments, saturated greens, and dialogue framing of Game Boy Advance RPGs, especially Pokémon Emerald. Artwork, map, explorer, and sound effects are original procedural assets; no game sprites, music, fonts, or logos are bundled.

## Run

Requires Node.js 20 or later. No dependencies or installation needed.

```sh
npm run dev
```

Open http://localhost:5173. `npm test` verifies answer validation, daily selection, and scoring. `npm run build` creates `dist/` for static hosting.

## Play

Answer five open-ended trivia prompts within 25 seconds each. Curated rarity tiers award 10–95 base gold. Room multipliers rise from 1× to 2×. After each room, bank your haul or continue. Invalid answers and timeouts cost 25% of current gold, rounded up. Collected relics survive traps; only gold is reduced. Completing room five banks automatically when you select Complete Expedition. The museum saves the latest 200 relics to browser local storage. Blocking storage falls back to the current session. Practice is repeatable. Daily rooms are deterministic for the local calendar date; replay prevention is not enforced in this prototype.

## Prototype limits

- Ten curated categories; daily expeditions choose five. Fixed rarity scores are design values, not measured player popularity.
- No backend, accounts, payment processing, live leaderboard, or multiplayer yet.
- Local saves are device/browser specific and can be erased by clearing browser data.
- Answer aliases are explicit. No AI judge or broad fuzzy matching.
- Desktop and mobile browser interface; native app packaging is future work.

## Next milestones

1. Expand and review the question bank; give each accepted answer a factual source.
2. Add server-authoritative answer validation, daily attempt tracking, and aggregate rarity statistics.
3. Add private friend rooms and simultaneous-answer duplicate penalties.
4. Add original collectible artifact sprites, audio settings, and an installable PWA.
5. Test optional cosmetic museum themes and category packs after validating retention.

## Structure

`src/engine.js`: pure trivia and scoring. `src/main.js`: expedition state, persistence, sound, original canvas tiles. `src/style.css`: responsive UI. `tests/`: Node's built-in test runner. CI runs tests and static build on pushes and pull requests.

This project is independent and is not affiliated with Nintendo, Game Freak, Pokémon, or Krillion. Pokémon appears as a trivia topic only.
