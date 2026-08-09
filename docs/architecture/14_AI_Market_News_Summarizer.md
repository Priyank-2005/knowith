# Architecture: AI Market News Summarizer

## 1. Business Overview
The AI Market News Summarizer aggregates daily financial news across Indian and Global markets, macroeconomic indicators, and mutual funds, providing concise summaries, impact analysis, and investor takeaways without acting as a news agency or advisory service.

## 2. User Journey
1. **Access**: User visits the Market News page.
2. **Consumption**: User views today's top aggregated summaries categorized by sector (Macro, RBI, Global, etc.).
3. **Deep Dive**: User can expand a summary to read the AI's analysis of "Impact" and "Investor Takeaways".

## 3. UI Flow
- **Tabs/Filters**: Macro, Indian Markets, Global, Mutual Funds.
- **Feed**: Card-based UI showing headlines and bulleted summaries.
- **Design**: Clean, highly readable typography (Inter/Roboto).

## 4. Conversation Flow
Non-conversational. This is an asynchronous batch-processing architecture.

## 5. Decision Tree
- IF news article mentions specific stock -> AI avoids saying "Buy/Sell" in the impact analysis, focusing purely on factual business impact.

## 6. Business Logic
- **Batch Processing**: A cron job runs twice a day (Morning/Evening) to fetch RSS feeds/News APIs.
- **AI Summarization**: The raw articles are passed to Groq to generate a structured JSON summary (Headline, Summary, Impact, Takeaways).
- **Caching**: The resulting JSON is stored in PostgreSQL and served statically via Next.js ISR (Incremental Static Regeneration) to ensure instant load times and zero runtime LLM costs for readers.

## 7. Mathematical Logic
N/A

## 8. Prompt Engineering
- **System Prompt**: "You are an objective financial analyst. Summarize the provided news article. Output strict JSON with keys: 'headline', 'summary', 'impact' (business impact, not stock price prediction), 'takeaways' (educational). Never provide investment advice."
- **Context Injection**: Raw article text.

## 9. Groq API Flow
*Runs in background cron, NOT on user request.*
1. Cron triggers Next.js API route.
2. Route fetches 10 articles from external API.
3. Loops through articles, calling Groq JSON mode for each.
4. Saves parsed JSON to PostgreSQL `NewsSummary` table.
5. Revalidates Next.js cache.

## 10. Response Parsing
- Server strictly parses the JSON output from Groq.

## 11. Validation
- Zod schema ensures the AI didn't hallucinate missing keys in the JSON response before saving to DB.

## 12. Edge Cases
- Article is too long for Groq context window -> Truncate to first 4000 tokens before processing.
- Article is completely unrelated to finance -> AI returns a specific flag in JSON, and the backend discards it.

## 13. Error Handling
- If Groq API is down during cron run, retry with exponential backoff.

## 14. Security
- RSS inputs must be sanitized to prevent HTML injection into the AI prompt.
- The Cron API route is protected by a secret Bearer token (`CRON_SECRET`).

## 15. Compliance
- Standard disclaimer: "News summaries are AI-generated for informational purposes and do not constitute advisory services."

## 16. Database Requirements
- Table `NewsArticle`: `id`, `category`, `headline`, `summary`, `impact`, `takeaways`, `publishedAt`, `sourceUrl`.

## 17. Frontend Requirements
- Next.js Server Components fetching from Postgres.
- `revalidate: 3600` (1 hour cache).

## 18. Backend Requirements
- Vercel Cron Jobs or external cron service.
- Integration interface `INewsProvider` for future-proofing (e.g., swapping NewsAPI for Bloomberg API later).

## 19. Future Enhancements
- Personalized news feeds based on user's portfolio holdings.

## 20. Complete Implementation Plan
1. Create `NewsArticle` schema.
2. Build Cron API route with Bearer auth.
3. Build the Groq summarization pipeline.
4. Create the Frontend UI with ISR caching.


## 21. Enterprise Refinements
- **Structured Output**: AI responses are enforced via Groq JSON mode (
esponse_format: { type: 'json_object' }). The UI consumes this JSON to render custom components rather than raw markdown.
- **Prompt Versioning**: The System and Developer prompts are versioned (e.g., 1.0.3). The version ID is logged with every database entry.
- **Feature Flags**: Rollout of this feature is controlled via LaunchDarkly (e.g., FEATURE_ADVISOR_ENABLED).
- **Token Tracking**: Input and output tokens are logged to PostgreSQL upon every generation. Cost is computed based on Groq's pricing.
- **Evaluation & Feedback**: Thumbs up/down buttons are present on every AI message. User feedback is logged to the DB for continuous prompt evaluation.
