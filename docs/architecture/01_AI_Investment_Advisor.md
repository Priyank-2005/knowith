# Architecture: AI Investment Advisor

## 1. Business Overview
The AI Investment Advisor acts as a highly personalized, conversational onboarding assistant for Knowith Capital. It aims to deeply understand a user's financial profile before providing educational investment categorization. It strictly adheres to SEBI compliance by never offering definitive advisory services or guaranteeing returns.

## 2. User Journey
1. **Entry**: User clicks "Investment Advisor" from the dashboard.
2. **Onboarding**: AI greets and asks for primary goal.
3. **Profiling**: Over multiple turns, AI collects age, income, risk appetite, horizon, etc.
4. **Summary**: AI repeats back the collected profile for confirmation.
5. **Insights**: AI provides a deterministic risk profile mapping and educational asset allocation.
6. **Action**: Recommends consulting a Knowith human advisor with a specific list of questions.

## 3. UI Flow
- **Left Sidebar**: Navigation.
- **Main View**: Chat interface with glassmorphism aesthetic.
- **Components**:
  - `ChatWindow`: Renders `MessageBubble`s.
  - `InputBar`: Handles typing, disabling during loading, and submitting.
  - `ProfileSidebar` (Optional): Dynamically updates as the AI extracts profile data (e.g., Age: 30).

## 4. Conversation Flow
- **Turn 1**: Greeting & Financial Goal.
- **Turn 2**: Age & Dependents.
- **Turn 3**: Monthly Income & Expenses (Savings capacity).
- **Turn 4**: Existing Investments & Emergency Fund.
- **Turn 5**: Risk Appetite & Investment Horizon.
- **Turn 6**: Tax Regime & Insurance.
- **Turn 7**: Generation of Final Report.
*Note: AI must dynamically adjust. If the user provides multiple data points in one turn, the AI skips redundant questions.*

## 5. Decision Tree
- IF user skips a question -> AI explains why it's important but allows proceeding.
- IF user provides negative income -> Trigger validation error, ask for correction.
- IF user asks for direct stock tips -> Trigger Compliance Refusal, pivot back to profiling.
- IF profile complete -> Transition state from `COLLECTING` to `SUMMARIZING`.

## 6. Business Logic
- **Profile Completion Tracking**: A Zod schema validates the current state.
- **Risk Profiling (Deterministic)**: 
  - Age < 30 + High Risk = Equity Heavy (e.g., 80% Equity / 20% Debt).
  - Calculated on the backend, passed to the AI as context to prevent hallucination.

## 7. Mathematical Logic
- **Savings Capacity**: `Income - Expenses = Monthly Surplus`.
- **Emergency Fund Adequacy**: `Emergency Fund / Expenses`. Target is >= 6 months.

## 8. Prompt Engineering
- Use a state-machine prompt strategy. The system prompt dynamically changes based on the `ConversationState`.
- **System Prompt**: Defines persona, strictly forbids advice, outlines remaining missing fields.
- **Developer Prompt**: Context injection containing the user's current JSON profile state.

## 9. Groq API Flow
1. Client sends message to `POST /api/advisor/chat`.
2. Controller parses message, fetches `Session` from Postgres.
3. Controller runs NLP extraction (via a fast LLM pass) to update the JSON state.
4. Controller injects updated JSON state into Developer Prompt.
5. Controller queries Groq `llama-3.3-70b-versatile`.
6. Streams response back to Client.

## 10. Response Parsing
- Responses are streamed using `ai` SDK (Vercel).
- Client renders using `ReactMarkdown` to handle tables, lists, and bold text.

## 11. Validation
- `Zod` schemas for `Message[]` input.
- Input length bounded to 1000 characters to prevent token abuse.
- Output sanitization to remove any HTML injection (handled natively by ReactMarkdown).

## 12. Edge Cases
- User changes previous answer (e.g., "Actually my income is 50k"). AI must update JSON state.
- Gibberish input: AI must politely ask for clarification.
- Multi-intent input (e.g., "I make 50k and want to buy a house in 5 years"): AI updates multiple state fields simultaneously.

## 13. Error Handling
- **429 Rate Limit**: Render "You're chatting too fast. Please wait a moment."
- **500 Server Error**: "Our servers are experiencing heavy load. Please try again."
- **Timeout**: Fallback response gracefully apologizing.

## 14. Security
- **Prompt Injection**: System prompt explicitly ignores subsequent instructions to bypass rules (e.g., "Ignore previous instructions").
- **PII Leakage**: Do not log exact income/names in standard application logs; use masked IDs.

## 15. Compliance
- Mandatory disclaimer affixed to the final report: *"Knowith Capital acts as a Mutual Fund Distributor. The above information is strictly for educational purposes..."*
- Refusal mechanism for specific asset recommendations (e.g., "Buy Reliance").

## 16. Database Requirements
- Table `Session`: `id`, `userId`, `state` (JSONB), `status` (COLLECTING|COMPLETE), `createdAt`, `updatedAt`.
- Table `Message`: `id`, `sessionId`, `role`, `content`, `createdAt`.

## 17. Frontend Requirements
- Real-time typing indicators.
- Markdown rendering.
- Auto-scroll to bottom of chat.
- Responsive design for mobile (drawer for profile state).

## 18. Backend Requirements
- Vercel Edge functions for streaming support.
- Upstash Redis for fast session retrieval and rate limiting.

## 19. Future Enhancements
- Integration with external aggregators (Account Aggregator framework) to auto-fill financial data.
- Voice-to-text input.

## 20. Complete Implementation Plan
1. Define Prisma schema for `Session` and `Message`.
2. Create standard UI chat components.
3. Build the state-machine logic for JSON profile extraction.
4. Implement Groq streaming API route.
5. Write and test System Prompts.
6. Deploy and monitor analytics for drop-off rates in the conversation flow.


## 21. Enterprise Refinements
- **Structured Output**: AI responses are enforced via Groq JSON mode (
esponse_format: { type: 'json_object' }). The UI consumes this JSON to render custom components rather than raw markdown.
- **Prompt Versioning**: The System and Developer prompts are versioned (e.g., 1.0.3). The version ID is logged with every database entry.
- **Feature Flags**: Rollout of this feature is controlled via LaunchDarkly (e.g., FEATURE_ADVISOR_ENABLED).
- **Token Tracking**: Input and output tokens are logged to PostgreSQL upon every generation. Cost is computed based on Groq's pricing.
- **Evaluation & Feedback**: Thumbs up/down buttons are present on every AI message. User feedback is logged to the DB for continuous prompt evaluation.
