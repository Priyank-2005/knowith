# Architecture: AI SIP Goal Calculator

## 1. Business Overview
The AI SIP Goal Calculator helps users plan for future financial milestones (e.g., Retirement, Child's Education) by calculating the required Systematic Investment Plan (SIP) amount based on deterministic mathematical compounding. The AI is restricted strictly to explaining the strategy, planning methodology, and the risks associated with the assumptions.

## 2. User Journey
1. **Goal Definition**: User inputs Goal Amount, Time Horizon (Years), Expected Return (%), and Current Initial Investment.
2. **Calculation**: Backend calculates the exact required monthly SIP using deterministic finance formulas.
3. **AI Explanation**: AI interprets the results, explaining the impact of compounding and the realism of the expected return.

## 3. UI Flow
- **Form Component**: Numeric inputs for goal parameters.
- **Results Component**: Big numbers showing "Required Monthly SIP" and "Total Investment vs Wealth Gained" charts.
- **AI Insights Component**: Markdown block analyzing the strategy.

## 4. Conversation Flow
Single-turn submission with instantaneous math rendering, followed by streamed AI insights.

## 5. Decision Tree
- IF Expected Return > 15% -> AI flags this as highly aggressive and explains equity market volatility.
- IF Horizon < 3 years and Return > 8% -> AI flags mismatch between short-term horizon and high-risk expectations.
- IF Required SIP > 50% of typical income -> AI suggests extending the horizon or reducing the goal amount.

## 6. Business Logic
- **Absolute Segregation**: The AI NEVER performs the Future Value (FV) or Present Value (PV) calculations. LLMs are notoriously bad at math.
- All numbers are computed in a TypeScript service and injected into the AI context as immutable facts.

## 7. Mathematical Logic
- `Future Value of Current Investment` = `Current * (1 + (R/100)/12)^(Y*12)`
- `Remaining Goal` = `Goal Amount - Future Value of Current Investment`
- `Required SIP` = `(Remaining Goal * ((R/100)/12)) / (((1 + (R/100)/12)^(Y*12)) - 1) / (1 + (R/100)/12)` (using standard PMT formula logic).

## 8. Prompt Engineering
- **System Prompt**: "You are an educational financial planner. The math has already been calculated. Your job is to explain the feasibility of this goal, the power of compounding in this scenario, and the risks of the user's expected return assumption. Never offer alternative math."
- **Developer Prompt**: Context injects `{ goal, years, returnRate, requiredSip }`.
- **Safety Prompt**: "Remind the user that mutual fund investments are subject to market risks."

## 9. Groq API Flow
1. POST form data.
2. Server calculates math -> returns math instantly to UI.
3. UI immediately fetches `POST /api/sip/insights` passing the calculated math.
4. Server streams Groq insights to UI.

## 10. Response Parsing
- Streamed Markdown rendered via `ReactMarkdown`.

## 11. Validation
- `Years > 0`, `Goal > 0`, `ReturnRate between 1 and 30`.

## 12. Edge Cases
- Return Rate = 0 (Requires separate edge case formula without division by zero).
- Goal already met by current investment (Required SIP = 0). AI congratulates the user.

## 13. Error Handling
- Math errors return a 400 Bad Request before hitting the Groq API.

## 14. Security
- API limits requests per minute to prevent compute exhaustion on complex math or LLM generation.

## 15. Compliance
- Standard "Mutual Fund investments are subject to market risks, read all scheme related documents carefully" appended below results.

## 16. Database Requirements
- Table `GoalCalculation`: `id`, `userId`, `goalAmount`, `years`, `expectedReturn`, `createdAt`.

## 17. Frontend Requirements
- `recharts` for visualizing the compounding curve (Principal vs Interest over time).

## 18. Backend Requirements
- Robust implementation of standard financial formulas matching Excel's `PMT` and `FV` functions.

## 19. Future Enhancements
- Step-up SIP calculations (increasing SIP by X% annually).

## 20. Complete Implementation Plan
1. Build `FinanceMath.ts` utility.
2. Create API endpoint for calculations.
3. Create API endpoint for AI insights.
4. Build UI with dynamic charting.


## 21. Enterprise Refinements
- **Structured Output**: AI responses are enforced via Groq JSON mode (
esponse_format: { type: 'json_object' }). The UI consumes this JSON to render custom components rather than raw markdown.
- **Prompt Versioning**: The System and Developer prompts are versioned (e.g., 1.0.3). The version ID is logged with every database entry.
- **Feature Flags**: Rollout of this feature is controlled via LaunchDarkly (e.g., FEATURE_ADVISOR_ENABLED).
- **Token Tracking**: Input and output tokens are logged to PostgreSQL upon every generation. Cost is computed based on Groq's pricing.
- **Evaluation & Feedback**: Thumbs up/down buttons are present on every AI message. User feedback is logged to the DB for continuous prompt evaluation.
