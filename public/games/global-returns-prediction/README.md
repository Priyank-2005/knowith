# Knowith Capital — Global Allocator Game

**Build:** Latest corrected, slower-flash edition  
**Primary file:** `Global_Allocator_Game_Source_Code.html`  
**Status:** Playable, shareable, and self-contained  
**Ownership:** Proprietary to Knowith Capital. Do not rebrand, resell, publish the source, or reuse its mechanics, data presentation, narrative structure, or design without written permission.

## 1. Files in this package

- `Global_Allocator_Game_Source_Code.html` — the complete production source and playable game.
- `Global_Allocator_Game_Source_Code.txt` — the same source in plain-text form for easier inspection and editing.
- `README_Global_Allocator_Game_Latest.md` — operating, technical, methodology, and sharing notes.

The HTML file contains the layout, styling, game logic, embedded return data, and embedded Knowith Capital branding in one file. No build process is required.

## 2. How to play

1. Download `Global_Allocator_Game_Source_Code.html` to a computer.
2. Open it in Chrome, Edge, Safari, or Firefox.
3. Enter a game code or retain the automatically generated one.
4. Select **Start Game**.
5. Complete exactly six rounds.
6. In each round, study the return history and newspaper-style market narrative, choose one basket, and lock the virtual ₹10 lakh bet.
7. After the sixth round, review the scorecard, yearly data flash, and full country-return heatmap.

No installation is required. Internet access is needed only when a player opens an original media-source link.

## 3. Sharing the playable game

The `.html` file itself is the playable game. Send it as an attachment through email, WhatsApp, AirDrop, cloud storage, or another file-transfer service. The recipient should first download the file and then open it in a browser.

A ChatGPT sandbox link is session-specific and should not be forwarded as the public game link. For a permanent browser URL, upload the HTML file to a static web host while retaining Knowith Capital ownership and branding.

## 4. Game architecture

The game has exactly six investment decisions and four choices in every round:

1. **India** — MSCI India country return.
2. **US** — MSCI USA country return.
3. **DM ex USA** — equal-weighted annual return of the UK, France, Germany, Japan, Singapore, and Hong Kong.
4. **EM ex India** — equal-weighted annual return of China, Taiwan, and Korea.

Each round presents a hidden historical episode using a 2-, 3-, 4-, or 5-year evidence window. A reproducible game code selects one episode from each of six market-behaviour pools and shuffles the sequence.

The possible regimes include:

- momentum continuation;
- broad market shock;
- laggard rebound;
- leader fade;
- leadership rotation; and
- fear-to-recovery surprise.

## 5. Decision and reveal screens

Before each choice, the player sees:

- annual USD returns over the hidden evidence period;
- compounded cumulative return;
- annualised CAGR;
- recent-performance rank;
- newspaper-style contemporaneous media narratives;
- dominant market emotion and narrative-pressure gauge; and
- an optional investor-feeling selection.

After the bet is locked, the game reveals:

- the hidden target year and evidence period;
- the next-year return and rank of all four baskets;
- the value of the player’s ₹10 lakh selection;
- an equal four-way diversified comparison;
- the best possible basket in hindsight;
- the original headline wording, outlet, date/archive context, and source link; and
- a regime-specific educational lesson.

## 6. Latest corrections and enhancements

### Round layout

- All four allocation options are kept visible together on normal laptop and desktop viewports.
- The decision and reveal layers are separated so they do not overlap.
- Smaller screens fall back to a scroll-safe responsive layout rather than clipping choices.

### Year-by-year data flash

- The flash covers 2000 through 2025.
- Each year remains visible for approximately **1.1 seconds** in the standard animation.
- The country recording the highest return in that year is highlighted in gold with a star.
- The caption explicitly names the annual leader and its return.
- The final year remains visible for approximately **1.9 seconds** before the overlay closes.
- Reduced-motion browser settings use a slightly slower display.

## 7. Final debrief and dataset

The game concludes with:

- winners selected out of six;
- total value of the six separate ₹10 lakh decisions;
- equal four-way allocation comparison;
- perfect-foresight comparison;
- performance-chasing and laggard-selection behaviour;
- momentum/reversal statistics for 2-, 3-, 4-, and 5-year lookbacks;
- an animated data flash;
- a 2000–2025 heatmap containing **26 years × 11 countries = 286 country-year observations**;
- click-to-highlight country statistics;
- game-results CSV export;
- full-dataset CSV export; and
- print/save scorecard controls.

## 8. Keyboard controls

- `1` to `4` — select an investment basket.
- `Enter` — lock the selected basket or move to the next round after a reveal.
- `Esc` — close the methodology panel or exit the data flash.

## 9. Data and calculation methodology

Source data: MSCI country-index annual total returns in USD gross terms for 2000–2025, as contained in the audited workbook `MSCI_Country_Returns_2000_2025_Audited.xlsx`.

For multi-country baskets, each calendar-year basket return is the equal-weighted arithmetic average of its constituent country returns. Multi-year cumulative returns are compounded from the annual basket returns. CAGR annualises the compounded cumulative result over the stated lookback period.

The four baskets are analytical proxies, not investable indices. The game excludes fees, taxes, transaction costs, and INR/USD currency translation.

Published media headlines are used only to reconstruct the narrative and emotional environment surrounding each historical decision. They are not treated as causal evidence, investment signals, or proof that an outcome was predictable.

## 10. Source-code map

The source is a single HTML document:

- `<style>` — complete desktop, laptop, mobile, newspaper, heatmap, and flash styling.
- `COUNTRY_DATA` — annual country-return dataset.
- `GROUPS` — definitions of the four playable baskets.
- `SCENARIO_POOLS` — curated historical episodes, media cues, outcome labels, and lessons.
- `buildRounds()` — reproducible scenario selection and shuffling from the game code.
- `renderRound()` — decision-screen rendering.
- `revealRound()` — hidden-year reveal and result calculation.
- `renderResults()` — final scorecard and behavioural comparison.
- `renderCountryDataset()` — complete heatmap generation.
- `triggerDataFlash()` — annual flash timing and highest-return-country highlighting.
- CSV functions — game-results and full-dataset downloads.

To alter the flash duration, edit the interval in `triggerDataFlash()`. The latest standard interval is approximately 1,095 milliseconds per year, with the final close delay set to approximately 1,900 milliseconds.

## 11. Integrity information

- Source size: **139,060 bytes**
- SHA-256: `649088c2e92587e16dd9eea40a0653c3fd513c618074c969b34964d2ae00b37e`
- The HTML and plain-text source copies in this package contain the same production source.

## 12. Educational disclaimer

This game is an educational illustration and not investment advice or a recommendation. Historical returns do not predict future returns. Mutual Fund investments are subject to market risks; read all scheme-related documents carefully.

**Knowith Capital — Abhinav Mehta, AMFI registered Mutual Fund Distributor (ARN 46498).**
