# Architecture: AI Customer Support & Lead Qualification (Features 8+9)

## 1. Business Overview
This feature serves a dual purpose. It acts as a Knowledgebase Assistant (Mode 1) answering FAQs, and seamlessly transitions into a Lead Qualification Assistant (Mode 2) when buying intent is detected, collecting user contact info to route to the sales team.

## 2. User Journey
1. **Query**: User asks a generic question (e.g., "What are mutual funds?").
2. **KB Mode**: AI answers educationally.
3. **Intent Detection**: User asks "How can I invest with you?".
4. **Transition**: AI acknowledges intent and smoothly begins collecting Name, Email, Phone, and Investment Amount over natural conversation turns.
5. **Storage**: AI detects complete profile, fires a webhook/DB insert, and notifies the user someone will contact them.

## 3. UI Flow
- Standard chat widget (floating bottom right, or full page).
- Typing indicators.

## 4. Conversation Flow
- **Multi-turn State Machine**: The state transitions from `SUPPORT` to `LEAD_GEN`.
- In `LEAD_GEN`, the AI sequentially extracts missing fields without sounding robotic. (e.g., "Great! I can have an advisor reach out. What's the best email to reach you at?").

## 5. Decision Tree
- IF user asks non-finance question -> Refuse politely.
- IF user provides partial name/email -> Extract via LLM function calling / JSON extraction.
- IF all fields collected -> Trigger `SaveLead` function.

## 6. Business Logic
- **Intent Classification**: Every user message is first passed through a fast, lightweight classification pass (e.g., Llama 3 8B) to determine if intent is `SUPPORT` or `BUYING`.
- If `BUYING`, the system prompt is swapped to the Lead Generation persona.

## 7. Mathematical Logic
N/A

## 8. Prompt Engineering
- **Mode 1 System Prompt**: "You are Knowith Capital's support bot. Answer FAQs briefly. If the user expresses interest in investing, warmly offer to connect them with an advisor."
- **Mode 2 System Prompt**: "You are qualifying a lead. The user wants to invest. You need to collect: Name, Email, Phone, Amount. Currently missing: [Email, Phone]. Ask naturally for ONE missing piece of info at a time."
- **Context Injection**: Live KB articles (RAG) for Mode 1. Missing fields array for Mode 2.

## 9. Groq API Flow
1. User msg -> Classify Intent (Groq 8B).
2. If Lead -> Run extraction (Groq 8B JSON mode) on previous msg.
3. Update Lead State in DB.
4. Pass state to Groq 70B with Mode 2 Prompt -> Stream response.

## 10. Response Parsing
- Extracted entities are parsed as JSON and validated via Zod (`z.string().email()`, etc.).

## 11. Validation
- Email format validation.
- Phone number length/format validation (Indian format).

## 12. Edge Cases
- User provides fake email -> Backend validation fails, AI asks again gently.
- User gets distracted and asks a KB question while in Lead mode -> AI answers, then gently steers back to collecting info.

## 13. Error Handling
- Fallback to Mode 1 if Mode 2 logic errors out.

## 14. Security
- PII Protection: Lead data (Phone/Email) must be encrypted at rest in PostgreSQL.

## 15. Compliance
- Standard data privacy notices ("By providing your email, you agree to our privacy policy").

## 16. Database Requirements
- Table `Lead`: `id`, `name`, `email`, `phone`, `amount`, `status` (NEW, CONTACTED).
- Abstraction: `ILeadRouter` interface. Implementation `PostgresLeadRouter`. Future: `HubSpotLeadRouter`.

## 17. Frontend Requirements
- Persistent chat session via `localStorage` so refreshing doesn't lose context.

## 18. Backend Requirements
- Robust intent routing mechanism.
- Encryption service for PII.

## 19. Future Enhancements
- RAG (Retrieval-Augmented Generation) using Vector DB (Pinecone/pgvector) for Mode 1 to answer queries based on company PDFs.

## 20. Complete Implementation Plan
1. Build `ILeadRouter` and Prisma schema.
2. Implement Intent Classification prompt.
3. Implement Lead State extraction prompt.
4. Build the dynamic orchestrator in Next.js API route.


## 21. Enterprise Refinements
- **Structured Output**: AI responses are enforced via Groq JSON mode (
esponse_format: { type: 'json_object' }). The UI consumes this JSON to render custom components rather than raw markdown.
- **Prompt Versioning**: The System and Developer prompts are versioned (e.g., 1.0.3). The version ID is logged with every database entry.
- **Feature Flags**: Rollout of this feature is controlled via LaunchDarkly (e.g., FEATURE_ADVISOR_ENABLED).
- **Token Tracking**: Input and output tokens are logged to PostgreSQL upon every generation. Cost is computed based on Groq's pricing.
- **Evaluation & Feedback**: Thumbs up/down buttons are present on every AI message. User feedback is logged to the DB for continuous prompt evaluation.
