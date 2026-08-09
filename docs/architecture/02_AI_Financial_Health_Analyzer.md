# Architecture: AI Financial Health Analyzer

## 1. Business Overview
The AI Financial Health Analyzer empowers users to assess their financial stability by analyzing their income, expenses, savings, and debts. The tool calculates deterministic financial metrics (e.g., debt-to-income ratio) on the backend and uses the Groq AI to explain the results, highlight risks, and suggest actionable, educational improvements.

## 2. User Journey
1. **Input**: User fills a structured form (Income, Expenses, Savings, Liabilities, Investments).
2. **Processing**: Backend computes deterministic ratios (Savings Rate, Debt Ratio, Emergency Fund Adequacy).
3. **Analysis**: AI generates a personalized narrative explaining the calculations.
4. **Output**: User views a dashboard containing the hard numbers alongside the AI's qualitative analysis (Strengths, Weaknesses, Priority Actions).

## 3. UI Flow
- **Left Panel**: Form inputs with real-time field validation.
- **Right Panel**: Results dashboard. Displays progress bars for ratios (e.g., 30% Savings Rate) and markdown-formatted AI analysis below.
- **Loading State**: Skeleton loaders for the text analysis while Groq API streams the response.

## 4. Conversation Flow
Unlike the Advisor, this is a single-turn structured interaction. 
- State 1: Form Empty
- State 2: Form Validating
- State 3: API Fetching
- State 4: Results Rendered (AI output streamed)

## 5. Decision Tree
- IF Debt Ratio > 50% -> AI prioritizes debt reduction strategies.
- IF Emergency Fund < 3 months -> AI prioritizes liquidity building.
- IF Savings Rate < 10% -> AI focuses on budget optimization.
- IF all metrics are healthy -> AI focuses on wealth acceleration and diversification.

## 6. Business Logic
- Ratios are NEVER calculated by the LLM. 
- Input data is sanitized (stripping commas, currency symbols).
- Math is executed in a highly tested TypeScript utility function.

## 7. Mathematical Logic (Deterministic)
- `Savings Rate` = `(Income - Expenses) / Income * 100`
- `Debt Ratio` = `Monthly EMI (derived or explicitly asked) / Income * 100` (Note: Need to add Monthly EMI to form).
- `Emergency Fund Months` = `Savings / Expenses`
- `Investment Ratio` = `Investments / Net Worth (Savings + Investments - Liabilities)`

## 8. Prompt Engineering
- **System Prompt**: "You are an AI Financial Health Analyzer. The backend has already computed the user's financial metrics. Your job is to explain these metrics in simple, educational terms. Highlight Strengths, Weaknesses, and recommend Priority Actions. Format in Markdown. Do NOT provide specific investment advice."
- **Developer Prompt (Context Injection)**: 
  ```json
  {
    "raw_data": { "income": 100000, "expenses": 60000 },
    "computed_metrics": { "savingsRate": "40%", "emergencyFundMonths": 1.5, "debtRatio": "10%" }
  }
  ```
- **User Prompt**: "Please analyze my financial health."
- **Prompt Variables**: None in the User prompt. All state is passed via Developer context.
- **Safety Prompt**: "Never guarantee returns. Never recommend specific financial instruments."
- **Fallback/Refusal Prompt**: "I can only analyze financial metrics. I cannot provide stock tips."
- **Few Shot Examples**: Provided in the System Prompt to enforce output structure (Strengths, Weaknesses, Actions).

## 9. Groq API Flow
1. Next.js API Route receives JSON payload of raw inputs.
2. Server validates with Zod.
3. Server executes deterministic math functions.
4. Server constructs the Context Injection JSON.
5. Server calls Groq API with `llama-3.3-70b-versatile` (Temperature: 0.3 for consistency).
6. Response streamed to client.

## 10. Response Parsing
- Stream parsed using Vercel AI SDK.
- Rendered via `ReactMarkdown` with `@tailwindcss/typography` (`prose` classes).

## 11. Validation
- **Frontend**: HTML5 validation (`min="0"`, `required`) + React Hook Form.
- **Backend**: `z.object({ income: z.number().min(0), ... })`.

## 12. Edge Cases
- Income = 0 (Divide by zero prevention).
- Expenses > Income (Flag critical cash flow issue).
- Negative values submitted (Rejected by Zod).

## 13. Error Handling
- **API Failure**: Gracefully degrade to showing ONLY deterministic metrics with a message: "AI analysis is temporarily unavailable, but your core metrics are calculated above."

## 14. Security
- Form inputs are strictly typed as numbers, preventing Markdown/HTML injection.
- Rate limiting per user IP to prevent API cost abuse.

## 15. Compliance
- AI output explicitly labeled: *"AI-Generated Educational Analysis"*.
- Strict boundary preventing the AI from telling the user *where* to put their emergency fund (e.g., recommending a specific Liquid Fund).

## 16. Database Requirements
- Table `FinancialHealthScan`: `id`, `userId`, `income`, `expenses`, `savings`, `liabilities`, `investments`, `createdAt`.
- Allows users to track their financial health score over time.

## 17. Frontend Requirements
- Form state management (React Hook Form).
- Charting library (Recharts or Chart.js) for visual metric representation.

## 18. Backend Requirements
- Dedicated service layer `FinancialMathService.ts` with comprehensive unit tests (Jest/Vitest).

## 19. Future Enhancements
- Plaid/Setu integration to auto-pull bank balances.
- Historical trend analysis ("Your savings rate improved by 5% since last month").

## 20. Complete Implementation Plan
1. Expand existing UI form to include `Monthly EMI`.
2. Write `FinancialMathService` with Unit Tests.
3. Update Next.js API route to perform math, then inject into Groq prompt.
4. Setup PostgreSQL schema for saving historical scans.
5. Deploy and test edge cases.


## 21. Enterprise Refinements
- **Structured Output**: AI responses are enforced via Groq JSON mode (
esponse_format: { type: 'json_object' }). The UI consumes this JSON to render custom components rather than raw markdown.
- **Prompt Versioning**: The System and Developer prompts are versioned (e.g., 1.0.3). The version ID is logged with every database entry.
- **Feature Flags**: Rollout of this feature is controlled via LaunchDarkly (e.g., FEATURE_ADVISOR_ENABLED).
- **Token Tracking**: Input and output tokens are logged to PostgreSQL upon every generation. Cost is computed based on Groq's pricing.
- **Evaluation & Feedback**: Thumbs up/down buttons are present on every AI message. User feedback is logged to the DB for continuous prompt evaluation.
