# AccessVerse — Product Requirements (PRD)

## Original Problem Statement
Build a completely new premium Phase 1 website for AccessVerse (accessverse.org), a Digital Accessibility company. Scope is strictly limited to a **Design System + Homepage**. Must feel like a premium SaaS company (Apple/Stripe/Linear/Vercel inspiration), LIGHT theme, Inter typography, large whitespace, soft shadows, subtle gradients, glass effects where appropriate. Must demonstrate WCAG 2.2 AA best practices.

## Architecture
- Frontend: React + TailwindCSS + Shadcn UI. Single-page Home with Design System view and Compliance Tracker (Dashboard) tabs.
- Backend: FastAPI, all routes prefixed `/api`. MongoDB (Motor) with Pydantic BaseDocument pattern.
- Integration: Emergent-managed Resend for email notifications (non-blocking via asyncio.create_task).

## User Personas
- Enterprise/Gov/University/Healthcare/Bank compliance buyers seeking WCAG 2.2, ADA, PDF/UA, Section 508 remediation & audits.
- Internal AccessVerse staff reviewing quote/consultation submissions via dashboard.

## Core Requirements (static)
- Homepage sections: Hero (with SaaS dashboard illustration), Trust badges, Services, Why Choose, Process timeline, Before & After slider, Testimonials, FAQ, CTA, Footer.
- Get Free Quote & Book Consultation forms stored in MongoDB.
- Backend review dashboard.
- Floating Accessibility Panel (contrast, text scaling, screen-reader simulator).
- WCAG 2.2 AA: keyboard nav, focus visible, semantic HTML, prefers-reduced-motion.

## Implemented (2026-07-02)
- Full Phase 1 homepage + design system view (Home.jsx, DesignSystemView.jsx).
- FloatingAccessibilityPanel, BeforeAfterSlider, QuoteFormModal, ConsultationModal, Dashboard.
- Backend endpoints: POST/GET/PATCH /api/quotes, POST/GET/PATCH /api/consultations, GET /api/.
- Resend email notifications (non-blocking).
- Fixed 502: PATCH routes now use Body(...) instead of Field(...); removed corrupted shutdown handler.
- Testing agent: 100% backend & 100% frontend pass.

## Backlog / Remaining
- P1: Add react-router so `/dashboard` and `/design-system` load directly via URL.
- P2: Add data-testid to Dashboard status <select>.
- P2 (Future/Phase 2): About, Services detail, Case Studies pages (only when requested).

## Next Tasks
- Await user review of Phase 1. Phase 2 pages deferred per user instruction.
