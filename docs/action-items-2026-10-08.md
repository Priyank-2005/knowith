# Client meeting 8 Oct 2026 — action checklist

Source: the Gemini notes and the full transcript of the call (Abhinav Mehta, Priyank Bohra, Ayushi Sainani).
The auto-generated notes garbled a few details, so every item below was checked against the transcript.

- `[x]` done · `[ ]` open
- **Us** = Priyank and Ayushi · **Abhinav** = the client
- "Code done" means it is built and tested locally; it goes live with the next deploy (see [Deploy checklist](#deploy-checklist)).

Progress: 20 of 65 items done. Everything left depends on content or access from Abhinav, on the production go-live, or is small follow-up work (the deploy checklist items count as open until you deploy).

---

## Website

- [ ] **Add the company logo** to the website (client noticed it is missing). — Us (needs the final logo file, see A-14)
- [ ] **Re-check the colour theme and overall UI of every page** once the logo is in; the logo has a fixed colour theme. — Us
- [ ] **Update the email and phone number** on the website (the number also goes on the WhatsApp button). — Us, after Abhinav sends two numbers and the mailbox exists
- [ ] **Our Story page**: gallery of company/office/event photos plus article-style text. — Us (page can be built now, content needed from Abhinav)
- [ ] **Forms section** in the footer legal area (KYC, transfer, transmission, common transaction forms), with admin upload so the client can add and replace forms himself. — Us
- [x] **Rename "Education" to "Quiz"** and remove the unused elements. — Us (already done before the call)
- [x] **Homepage "Investors are asking" box scrolls** as more questions are added. — Us (code done)
- [x] **FAQ management in the admin panel** so Abhinav can edit questions and answers permanently (Admin → FAQs: add, edit, hide, delete, reorder). — Us (code done)
- [ ] **SEO keywords**: agree the keyword list and apply it (the client asked about needing 50 photos; the answer is no, SEO matters). — Us

## Quiz (Chapter 9, Global Asset Allocator)

- [x] **Increase font sizes and make text bolder** (removed the 0.75 page zoom and the 6–10px type). — Us (code done)
- [x] **Fix the tiny "what did you feel" selector** between the headlines and the baskets (larger buttons, bold label). — Us (code done)
- [x] **2×2 layout** for the four options, headlines in a side column, Lock button always visible. — Us (code done; fits without scrolling at 1080p, scrolls about 40–80px at 1440×800)
- [ ] **Update the quiz content** so it is more relevant. — Abhinav sends the content (A-8), Us apply it

## Indian market page — mutual funds

- [x] **Remove the Direct plan completely**; Regular plan (Growth) only. — Us (code done)
- [x] **Squeeze the table** so more columns fit. — Us (code done)
- [x] **Column sorting**, ascending then descending, on every column. — Us (code done)
- [x] **Show the entire category** with infinite scrolling (30 rows at a time) instead of the top 10; search box added. — Us (code done)
- [x] **Value Research-style tabs**: Snapshot, Returns, Portfolio, Risk, Details. — Us (code done)
  - [x] Returns: 1M, 3M, 6M, YTD, 1Y, 3Y, 5Y, 10Y, plus SIP returns (1Y/3Y/5Y)
  - [x] NAV 52-week high and low
  - [x] Fees and fund manager details (managers and tenure, expense ratio, exit load, minimum investment)
  - [x] Risk: riskometer, volatility, max drawdown, Sharpe ratio
  - [ ] Weekly and calendar-year (annual/quarterly) returns — not built yet
  - [ ] Store the third-party data (mfapi.in, TigZig) in our own database instead of re-fetching daily — not built; the daily cache is used for now
  - [ ] Portfolio holdings and sector weights — blocked, no free data source (see L-4)
- [x] **ETF section** (Equity, Gold, Silver, Debt, International ETFs) with the same table and tabs. — Us (code done)
- [x] **SIF, Gift City and PMS tabs** fed from Admin → Products (manual entry or Excel/CSV upload with a template). — Us (code done)
- [ ] **Fill the SIF, Gift City and PMS lists.** Do not highlight Feeder funds separately; the World Index tracker already exists. — Abhinav sends requirements (A-10), Us load the data
- [ ] **Add the calculations the client wants** on the fund pages. — Abhinav tells us briefly or gives formulas (A-9), Us build
- [x] **Keep the 6 AM daily update** for Indian market data (client confirmed 6 AM is right). — nothing to change
- [ ] **Warm the cache after the 6 AM refresh** so the first visitor does not wait 15–30 seconds (suggested by us, not asked by the client). — Us

## Insights

- [x] **PDF to article conversion**, with download and share for the uploaded PDF. — Us (already built)
- [ ] **Image storage**: sign up for a free-tier image service so article images and charts show. Article covers default to the first image in the article. — Us (`@vercel/blob` is already a dependency; check whether it covers this)
- [ ] **Publish the taxation write-up** (text and tables) under Insights. — Abhinav writes it (A-7), Us publish
- [ ] **Add a story-style image icon on articles**, like the "top stories" on Value Research. — Us, after image storage works

## Login and clients

- [x] **Client list upload from Excel** (name and email columns, no duplicates) and manual entry. — Us (already built)
- [ ] **Upload Abhinav's client list.** — Abhinav sends the sheet (A-3), Us upload
- [ ] **Give Abhinav admin access** (credentials) for FAQs, client uploads and Insights. — Us
- [ ] **Check the "existing client" login redirect**: the Funds Bazar link opens the Services page. — Abhinav rechecks the link (A-11), Us check our redirect

## Email, accounts and domain

- [ ] **Create the company mailbox** on GoDaddy and link it to Gmail and Outlook. About 5 minutes once we have access. — Us (needs A-1)
- [ ] **Confirm the exact mailbox address.** Gemini wrote "withcapital.com" and "invested capital.com"; the transcript says invest@ plus the full domain, most likely **invest@knowithcapital.com**. — Us confirm with Abhinav before creating it
- [ ] **Move GitHub, Vercel and the other accounts** from Priyank's personal account to the company email. — Us, after the mailbox exists
- [ ] **Decide whether to take the live domain down** until the site is ready. Abhinav said okay but also wants email and number updated first. — Us and Abhinav

## Production go-live

- [ ] **Move to a production database.** The Indian market page is slow because dev uses a basic one; slow pages are unacceptable to the client. — Us, once development is complete
- [ ] **Buy a dedicated server** for the AI and chatbot features. — Abhinav approves, Us purchase
- [ ] **Get a Gemini API subscription.** — Abhinav approves, Us purchase

## Waiting on Abhinav

- [ ] **A-1 GoDaddy access and OTPs**, between 5:00 and 6:00 PM (he is unavailable 6:30–9 PM).
- [ ] **A-2 Two phone numbers** for the website and WhatsApp.
- [ ] **A-3 Excel client list** with name and email.
- [ ] **A-4 Photos and key points** for the Our Story page (events, meeting investors, office).
- [ ] **A-5 Forms** to host in the footer (KYC, transfer, transmission, transaction forms).
- [ ] **A-6 Privacy policy and legal terms text.** The policy pages are empty today.
- [ ] **A-7 Taxation write-up** (text and tables) for Insights.
- [ ] **A-8 Quiz content updates.**
- [ ] **A-9 Fund calculations and formulas** he wants shown.
- [ ] **A-10 Product requirements for Gift City, SIF and PMS**, sent to the WhatsApp group (columns, products, a sample sheet).
- [ ] **A-11 Re-check the Funds Bazar link** he shared.
- [ ] **A-12 Search for mutual fund and investment APIs** (shared with us) to help curate the product lists.
- [ ] **A-13 Share the remaining pending content** he mentioned ("plenty of things I had to give you").
- [ ] **A-14 Final logo file and colour theme**, if we do not already have them.

Abhinav travels **11 Oct to 17/18 Oct** and will be less available, so anything we need from him should be requested before then.

---

## Blocked

| Blocked item | Waiting on |
|---|---|
| Company mailbox, account migration, email on the site | GoDaddy access (A-1) |
| Phone number on the site | Numbers (A-2) |
| Our Story page content | Photos and points (A-4) |
| Footer forms content | Forms (A-5) |
| Privacy and terms pages | Text (A-6) |
| Taxation insight | Write-up (A-7) |
| Quiz content update | Content (A-8) |
| Extra fund calculations | Formulas (A-9) |
| SIF, Gift City, PMS lists | Requirements and data (A-10) |
| Client login for the full client list | Excel list (A-3) |
| Funds Bazar redirect | Correct link (A-11) |
| Logo and theme refresh | Logo file (A-14) |
| Portfolio holdings and sector weights | A paid or alternative data source (L-4, A-12) |
| Production database, server, Gemini API | Go-live decision and budget |

**L-4:** the free sources used for the fund pages (AMFI, mfapi.in, TigZig) do not provide portfolio holdings or sector weights, so the Portfolio tab shows the benchmark and allowed asset mix only. Both of us should look for a source (shared task with Abhinav).

---

## Deploy checklist

- [ ] Deploy. The build runs `prisma db push`, which creates the new `Faq` and `ProductListing` tables. Until then FAQs fall back to the built-in set and the product tabs show "we are curating this list".
- [ ] The local `.env` points at the same Neon database as production, so a local `prisma db push` also changes production. These changes only add tables.
- [ ] Confirm `AUTH_SECRET` is set in Vercel and the app was redeployed (admin login returned "Sign-in failed" on 8 Oct because it was missing).
- [ ] Open `/market-concentration?market=india` once after deploying to warm the cache.
- [ ] Log in to `/admin` and open **FAQs** and **Products** to confirm both load.

## Open questions

1. Exact mailbox address (see above).
2. Take the live domain down now, or after the email and number are updated?
3. Which ETF categories does the client want? We built Equity, Gold, Silver, Debt and International.
4. How should SIF, Gift City and PMS be grouped? He said not to copy Fine Print's grouping.
5. Who owns each open task between Priyank and Ayushi? Last round Priyank did Markets and Ayushi did Insights.

## Known limitations

- ETF figures use AMFI NAVs, not exchange prices. Where an ETF's units were split or consolidated, older returns are left blank.
- AMFI files some gold and silver ETFs under "Equity ETF"; the code re-files them by name.
- mfapi.in and the TigZig API are free services with no uptime guarantee. If they are down, the extra columns show "—" and the Snapshot columns still work.
- Manager, expense ratio and exit load come from scheme filings and can lag.
