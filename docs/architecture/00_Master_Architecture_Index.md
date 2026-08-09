# Master Architecture Index: Knowith Capital AI

## 1. System Overview
Knowith Capital AI is an enterprise-grade, highly scalable web application designed for Mutual Fund Distribution. 
The system leverages **PostgreSQL (via Prisma ORM)** for data persistence, **Next.js (App Router)** for the Full-Stack framework, and **Groq API** as the primary inference engine for LLaMA-based AI models.
The architecture enforces strict separation of concerns, robust security boundaries, and stringent financial compliance rules (never providing definitive investment advice).

## 2. Core Architectural Principles
1. **Layered Architecture**: 
   - **Presentation Layer**: React Server Components (RSC) and Client Components with Tailwind CSS.
   - **Validation Layer**: Zod schemas for input validation and output sanitization.
   - **Business Logic Layer**: Deterministic financial math and business rules (e.g., Tax calculation, SIP math).
   - **AI Orchestration Layer**: Manages context windows, memory strategies, and prompt chains.
   - **Prompt Management Layer**: Centralized, versioned prompts in isolated modules.
   - **Data Access Layer**: Prisma ORM abstractions interacting with PostgreSQL.
   - **External Services Layer**: Shared Groq API client, future CRM abstractions.
2. **Shared AI Service**: Individual features do not call Groq directly. A unified `GroqService` handles rate-limiting, retries, timeout, system prompt injection, and fallback mechanisms.
3. **Deterministic First**: AI is strictly relegated to explanation and education. Any financial math (SIP calculations, tax logic) is done deterministically in TypeScript *before* being fed to the AI.
4. **CRM Abstraction**: Lead routing strictly implements an interface (`ILeadRouter`) which currently saves to PostgreSQL but is extensible for HubSpot/Salesforce via dependency injection.

## 3. Database Architecture (PostgreSQL + Prisma)
The schema enforces normalization and scalability. Key models include:
- `User`: Base user identity and authentication.
- `UserProfile`: Age, risk appetite, goals (Feature 1 state).
- `FinancialHealth`: Historical health scores and inputs (Feature 2).
- `ConversationSession`: Multi-turn state management for long-running context.
- `Message`: Individual turn logs for analytics and context recovery.
- `Lead`: Qualified leads (Feature 8/9).
- `PromptVersion`: For A/B testing and auditing prompt changes.

## 4. Feature Architecture Documents
The following documents detail the exhaustive, 20-section architectural design for each specific feature:

1. [AI Investment Advisor](./01_AI_Investment_Advisor.md)
2. [AI Financial Health Analyzer](./02_AI_Financial_Health_Analyzer.md)
3. [AI Portfolio Analyzer](./03_AI_Portfolio_Analyzer.md)
4. [AI SIP Goal Calculator](./04_AI_SIP_Goal_Calculator.md)
5. [AI Tax Saving Advisor](./05_AI_Tax_Saving_Advisor.md)
6. [AI Customer Support & Lead Qual](./08_09_AI_Customer_Support_Lead.md)
7. [AI Market News Summarizer](./14_AI_Market_News_Summarizer.md)

## 5. Global Security & Compliance
- **Prompt Injection Defense**: Multi-layered defense including rigid System Prompts, input sanitization via Zod, and output guardrails.
- **Compliance**: AI explicitly denies status as a SEBI Registered Investment Advisor. Disclaimers are forcibly appended to UI components, independent of the LLM's output.
- **Rate Limiting**: IP-based and User-based token bucket algorithms via Redis/Upstash to prevent API abuse.
- **Logging**: PII is rigorously masked before being written to structured logs (e.g., Winston/Pino).
