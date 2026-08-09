# Architecture: AI Portfolio Analyzer

## 1. Business Overview
The AI Portfolio Analyzer allows users to paste or upload their current holdings (Mutual Funds, Stocks, ETFs, etc.) and receive a comprehensive analysis of their diversification, sector exposure, and risk level. It strictly avoids predicting future prices or fabricating returns, acting purely as a static risk and allocation analyzer.

## 2. User Journey
1. **Input**: User pastes a list of their holdings in free-text format (e.g., "100 shares of Reliance, 50k in Parag Parikh Flexi Cap, 20g Gold").
2. **Parsing**: AI extracts structured data from the unstructured text.
3. **Analysis**: AI evaluates concentration risks, asset class mix, and liquidity.
4. **Output**: A structured report identifying missing asset classes and rebalancing concepts.

## 3. UI Flow
- **Input Area**: Large `textarea` for pasting holdings.
- **Processing State**: Skeleton loading states while AI parses and analyzes.
- **Results View**: Charts (e.g., Pie chart for Asset Allocation) and Markdown-rendered AI analysis.

## 4. Conversation Flow
Single-turn submission. 
- State 1: Input
- State 2: Processing (Extraction + Analysis)
- State 3: Results Display

## 5. Decision Tree
- IF holding is unrecognized -> Flag as "Unknown Asset" and omit from core risk math.
- IF > 50% in a single stock -> Flag "High Concentration Risk".
- IF 0% in Debt -> Suggest "Evaluate fixed-income allocation for stability".

## 6. Business Logic
- **Two-Pass AI Strategy**: 
  1. Pass 1 (Extraction): Use Groq JSON mode to extract unstructured text into a structured JSON array of holdings.
  2. Pass 2 (Analysis): Pass the structured JSON to the analysis prompt to generate the qualitative report.

## 7. Mathematical Logic
- **Allocation %**: `(Asset Value / Total Portfolio Value) * 100` (computed deterministically after Pass 1 extraction).

## 8. Prompt Engineering
- **Pass 1 System Prompt**: "You are an entity extractor. Extract the user's financial holdings into a strictly formatted JSON array. Ignore conversational filler."
- **Pass 2 System Prompt**: "You are a Portfolio Risk Analyzer. Analyze the provided structured portfolio. Identify diversification gaps. NEVER predict prices. NEVER fabricate historical returns."
- **Context Injection**: Pass 2 receives the structured JSON from Pass 1.
- **Safety Prompt**: "If the user asks 'Will this go up?', explicitly refuse to predict."

## 9. Groq API Flow
1. POST raw text.
2. API Route calls Groq with `response_format: { type: "json_object" }`.
3. Server validates JSON output with Zod.
4. Server computes deterministic % allocations.
5. Server calls Groq again for qualitative analysis.
6. Streams analysis to client.

## 10. Response Parsing
- Pass 1 is parsed natively as JSON.
- Pass 2 is streamed as Markdown.

## 11. Validation
- Pass 1 JSON output validated using Zod against `z.array(z.object({ assetName: z.string(), value: z.number(), assetClass: z.string() }))`.

## 12. Edge Cases
- User inputs non-financial text ("I like pizza"). Pass 1 returns empty array, trigger validation error.
- Value missing (e.g., "I own some HDFC stock"). AI assigns value "UNKNOWN" and prompts user to specify quantities.

## 13. Error Handling
- Handle JSON parse failures in Pass 1 with an automatic retry (up to 2 times).

## 14. Security
- Strict bounds on input text length (max 5000 chars) to prevent token exhaustion.

## 15. Compliance
- Include "Analysis is based on user-provided data and does not constitute a recommendation to buy or sell securities."

## 16. Database Requirements
- Table `PortfolioScan`: `id`, `userId`, `rawInput`, `structuredJson`, `createdAt`.

## 17. Frontend Requirements
- Visualizations using `recharts` for the structured JSON output.

## 18. Backend Requirements
- Robust retry logic for the JSON extraction phase.

## 19. Future Enhancements
- CAS (Consolidated Account Statement) PDF parsing.

## 20. Complete Implementation Plan
1. Setup JSON extraction pipeline.
2. Create deterministic allocation math module.
3. Setup qualitative analysis streaming route.


## 21. Enterprise Refinements
- **Structured Output**: AI responses are enforced via Groq JSON mode (
esponse_format: { type: 'json_object' }). The UI consumes this JSON to render custom components rather than raw markdown.
- **Prompt Versioning**: The System and Developer prompts are versioned (e.g., 1.0.3). The version ID is logged with every database entry.
- **Feature Flags**: Rollout of this feature is controlled via LaunchDarkly (e.g., FEATURE_ADVISOR_ENABLED).
- **Token Tracking**: Input and output tokens are logged to PostgreSQL upon every generation. Cost is computed based on Groq's pricing.
- **Evaluation & Feedback**: Thumbs up/down buttons are present on every AI message. User feedback is logged to the DB for continuous prompt evaluation.
