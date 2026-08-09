# Architecture: AI Tax Saving Advisor

## 1. Business Overview
The AI Tax Saving Advisor helps users navigate Indian tax laws (Old vs New Regime) by collecting their income and current deductions. It deterministically calculates available unused benefits under sections like 80C, 80D, and NPS, while the AI provides educational suggestions on tax-saving instruments.

## 2. User Journey
1. **Input**: User inputs Salary, Business Income, chosen Tax Regime, and current deductions (80C, 80D, etc.).
2. **Analysis**: System calculates remaining headroom in various tax sections.
3. **Insights**: AI explains how to optimize the remaining headroom (e.g., explaining ELSS vs PPF for 80C).
4. **Action**: Provides a summary and a strict disclaimer about consulting a CA.

## 3. UI Flow
- **Tabs**: Select between "Old Regime" and "New Regime".
- **Form**: Inputs for standard deduction categories.
- **Dashboard**: Visual indicators of utilized vs unutilized limits.

## 4. Conversation Flow
Single-turn submission followed by AI streamed report.

## 5. Decision Tree
- IF New Regime selected -> AI explains that most standard deductions (80C, 80D) are not applicable, focusing instead on structural changes or NPS 80CCD(2).
- IF 80C is maxed (>= 1.5L) -> AI focuses on 80D (Health) or NPS (80CCD(1B)).

## 6. Business Logic
- The maximum limits (e.g., 1.5 Lakh for 80C, 50k for 80CCD(1B)) are hardcoded in a configuration file (`taxConstants.ts`), not left to the AI to memorize, ensuring compliance with current year tax laws.

## 7. Mathematical Logic
- `Unused 80C` = `MAX(0, 150000 - Current 80C)`
- `Unused 80D` = `MAX(0, 25000 - Current 80D)` (simplified for non-senior citizens).

## 8. Prompt Engineering
- **System Prompt**: "You are an Indian Tax Educational Assistant. You must never provide legal or tax filing advice. Explain the unutilized tax deductions provided in the context and educate the user on instruments that qualify (e.g., ELSS, PPF, Term Insurance)."
- **Developer Prompt**: Context injects calculated unused limits.
- **Refusal Prompt**: If user asks "How do I evade taxes?", strictly refuse and state commitment to legal tax planning.

## 9. Groq API Flow
- Math computed on server.
- Unutilized limits sent as JSON context to Groq `llama-3.3-70b-versatile`.
- AI streams educational guidance.

## 10. Response Parsing
- Markdown rendered with bolded instrument names for readability.

## 11. Validation
- Inputs must not exceed realistic salary bounds (e.g., < 100 Crores) to prevent integer overflows in math.

## 12. Edge Cases
- User inputs deductions far exceeding their income.

## 13. Error Handling
- Return clear error if regime mismatch occurs.

## 14. Security
- No PAN or Aadhaar data is ever collected. Strict PII boundary.

## 15. Compliance
- *MANDATORY DISCLAIMER*: "This tool is for educational purposes only and does not constitute tax advice. Please consult a qualified Chartered Accountant (CA) before filing your returns."

## 16. Database Requirements
- Table `TaxProfile`: `id`, `userId`, `regime`, `income`, `createdAt`. (Store minimally, avoid storing specific deduction amounts if not strictly necessary for privacy).

## 17. Frontend Requirements
- Interactive progress bars showing utilization of the 1.5L 80C limit.

## 18. Backend Requirements
- `taxConstants.ts` must be easily updateable post annual union budget.

## 19. Future Enhancements
- Direct integration with ELSS fund discovery.

## 20. Complete Implementation Plan
1. Define Tax Constants.
2. Create Tax Math Service.
3. Build AI prompt layer.
4. Implement UI dashboard.


## 21. Enterprise Refinements
- **Structured Output**: AI responses are enforced via Groq JSON mode (
esponse_format: { type: 'json_object' }). The UI consumes this JSON to render custom components rather than raw markdown.
- **Prompt Versioning**: The System and Developer prompts are versioned (e.g., 1.0.3). The version ID is logged with every database entry.
- **Feature Flags**: Rollout of this feature is controlled via LaunchDarkly (e.g., FEATURE_ADVISOR_ENABLED).
- **Token Tracking**: Input and output tokens are logged to PostgreSQL upon every generation. Cost is computed based on Groq's pricing.
- **Evaluation & Feedback**: Thumbs up/down buttons are present on every AI message. User feedback is logged to the DB for continuous prompt evaluation.
