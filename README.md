# Relic Rush

A competitive, room-code trivia treasure hunt for 2–4 players, plus a solo daily expedition, set in original pixel-art jungle ruins. Inspired by the colorful tiled environments, saturated greens, and dialogue framing of Game Boy Advance RPGs, especially Pokémon Emerald. Artwork, map, explorer, and sound effects are original procedural assets; no game sprites, music, fonts, or logos are bundled.

## Run

Requires Node.js 20 or later. No dependencies or installation needed.

```sh
npm run dev
```

Open http://localhost:5173. `npm start` runs the same multiplayer server for hosting. `npm test` verifies trivia and real four-client HTTP matches. `npm run build` creates frontend files in `dist/`; that static output alone supports solo play, while friends mode requires the Node server and its API. No package installation is needed.

## Play with friends

1. Enter a name and choose **Create Room**. Share the six-character code.
2. Friends open the same server URL, enter names and the code, and choose **Join**. Maximum four players including the host. At least two are needed to start.
3. The host starts a five-round match. All players receive the same prompt and have 25 seconds to lock one answer.
4. Submissions remain hidden until everyone active has answered or the server deadline expires. Answers cannot be edited after submission.
5. Valid answers earn their curated rarity score. Players using the same canonical answer (including aliases) split that score equally, rounded down. Invalid or missing answers earn zero. There are no speed bonuses or room multipliers in competition.
6. A seven-second reveal shows everyone’s answers and points, then the next round starts automatically. The highest total wins; equal totals are joint winners. The host can start a rematch.

Example: a 90-point answer submitted by two players earns 45 each; a unique 65-point answer earns 65. Think of something correct that your opponents won’t choose.

Rooms synchronize by authenticated HTTP polling every 700 milliseconds. Each player receives a random secret session token kept in session storage, so refreshing the same tab reconnects. Answer validation, deadlines, capacity, and score totals are controlled by the server. Names are displayed as plain text. The host role transfers to an active player if the host leaves. After 60 seconds without requests, a player is marked inactive; refresh recovery works within that grace period. Joining after a match starts is blocked. Leave and create a new room to change the party.

## Dungeon descent

Each trivia round moves the expedition one floor deeper, using original procedural pixel art:

| Round | Chamber | Depth | Entrance | Ambient animation |
| --- | --- | --- | --- | --- |
| 1 | Mossbound Cellar | 12 m | Camera drops down stone stairs | Dust and flickering torches |
| 2 | Drowned Archives | 35 m | A suspended lift sinks into the chamber | Water ripples and rising bubbles |
| 3 | Crystal Hollow | 80 m | A diamond-shaped iris opens | Sparkling purple crystals |
| 4 | Ember Forge | 150 m | Explorer crosses the lava bridge | Flowing lava, drifting embers, furnace flames |
| 5 | The Emerald Vault | 300 m | Giant stone doors slide apart | Orbiting emerald motes and spectral light |

Entrances last 1.8 seconds and remain purely visual: the answer field stays usable. Friends mode anchors the entrance to the server's round start, so repeated polling never replays it and reconnecting midway shows the settled chamber. Rematches replay the five descents. Reduced-motion preference skips entrances and freezes ambient effects. Leaving a friend room returns to the jungle base camp.

## Server hosting

Run Node.js 20+ with `npm start` on a host that supports a long-running Node HTTP process. `PORT` defaults to 5173 and `HOST` defaults to `0.0.0.0`. Serve frontend and API from the same origin. For local testing, use separate browser tabs to represent different players. Other devices on your network can use your computer’s LAN address and port, subject to its firewall.

Room state is held in memory in one server process. Rooms expire after two hours without requests and disappear on restart. Run a single instance; multi-instance scaling needs shared room storage or sticky routing. This release does not deploy a public server automatically. The question bank and curated scores are also available in the solo client, so this is a casual friends game rather than a cheat-resistant ranked competition.

## Play solo

Answer five open-ended trivia prompts within 25 seconds each. Curated rarity tiers award 10–95 base gold. Room multipliers rise from 1× to 2×. After each room, bank your haul or continue. Invalid answers and timeouts cost 25% of current gold, rounded up. Collected relics survive traps; only gold is reduced. Completing room five banks automatically when you select Complete Expedition. The museum saves the latest 200 relics to browser local storage. Blocking storage falls back to the current session. Practice is repeatable. Daily rooms are deterministic for the local calendar date; replay prevention is not enforced in this prototype.

## Prototype limits

- Ten curated categories; daily expeditions choose five. Fixed rarity scores are design values, not measured player popularity.
- Multiplayer server and per-room leaderboard are included. No accounts, payment processing, or global leaderboard.
- Local saves are device/browser specific and can be erased by clearing browser data.
- Answer aliases are explicit. No AI judge or broad fuzzy matching.
- Desktop and mobile browser interface; native app packaging is future work.

## Next milestones

1. Expand and review the question bank; give each accepted answer a factual source.
2. Add persistent room storage, daily attempt tracking, and aggregate rarity statistics.
3. Expand competitive categories and introduce long-term seasonal rankings.
4. Add original collectible artifact sprites, audio settings, and an installable PWA.
5. Test optional cosmetic museum themes and category packs after validating retention.

## Structure

`server/index.js`: Node HTTP server and static allowlist. `server/rooms.js`: authoritative rooms, sessions, timers, reveals, and scoring. `src/dungeon.js`: five animated floors and descent transitions. `src/multiplayer.js`: room lobby, polling, submission UI, and scoreboard. `src/engine.js`: pure trivia and scoring. `src/main.js`: expedition state, persistence, sound, original canvas tiles. `src/style.css`: responsive UI. `tests/`: Node's built-in test runner. CI runs tests and static build on pushes and pull requests.

This project is independent and is not affiliated with Nintendo, Game Freak, Pokémon, or Krillion. Pokémon appears as a trivia topic only.
