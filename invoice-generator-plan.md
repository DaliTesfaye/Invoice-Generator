# Freelancer Invoice Generator - Project Plan

This document outlines the step-by-step plan for building the **Freelancer Invoice Generator**, based on the core philosophy: *"Create → Preview → Generate → Done"*.

The MVP focuses on speed, simplicity, and generating professional PDFs without the bloat of full accounting software.

---

## Technical Stack
- **Frontend**: Next.js, TypeScript, Tailwind CSS, shadcn/ui, React Hook Form, Zod
- **Backend**: Node.js, Express, TypeScript, REST API
- **Database**: PostgreSQL with Prisma ORM
- **PDF Generation**: Puppeteer

---

## Implementation Phases

### Phase 0: Project Setup
- [ ] Create project repository
- [ ] Establish folder structure (monorepo or separate front/back)
- [ ] Initialize Next.js (Frontend) and Express + TypeScript (Backend)
- [ ] Configure Tailwind CSS & shadcn/ui
- [ ] Set up ESLint/formatting and Environment Variables
- [ ] Configure PostgreSQL & Prisma
- [ ] Create initial README

### Phase 1: Design Foundation
- [ ] Define brand name, typography (Inter/Geist), and color palette (monochrome base with subtle accents)
- [ ] Configure shadcn/ui components (Buttons, Inputs, Cards, etc.)
- [ ] Create the application shell and responsive navigation

### Phase 2: Authentication
- [ ] Create Database User model
- [ ] Implement Register, Login, Logout flows
- [ ] Set up secure password hashing (Argon2id/bcrypt) and HTTP-only cookies
- [ ] Implement Email Verification & Password Reset workflows
- [ ] Secure API middleware and frontend protected routes

### Phase 3: Business Profile
- [ ] Create Business Profile model in database
- [ ] Build Settings page and profile forms
- [ ] Implement logo upload
- [ ] Configure default settings (currency, invoice prefix, payment terms, default notes)

### Phase 4: Client Management
- [ ] Create Client model in database
- [ ] Build Client list, detail view, search, and CRUD operations
- [ ] Integrate Client selector directly into the invoice form
- [ ] Allow inline client creation during the invoice workflow

### Phase 5: Core Invoice Engine
- [ ] Create Invoice and Invoice Item models
- [ ] Implement automatic unique invoice number generation
- [ ] Build invoice creation/editing forms (General, Items, Notes)
- [ ] Implement secure server-side calculations (Quantity, Unit Price, Discount, Tax, Subtotal, Total)
- [ ] Set up invoice status tracking (Draft, Sent, Paid, Overdue)

### Phase 6: Invoice Preview Interface
- [ ] Build side-by-side (desktop) or stacked (mobile) layout for the invoice form
- [ ] Create live, responsive HTML templates for the invoice
- [ ] Render all data (Business, Client, Items, Totals) in the preview

### Phase 7: PDF Generation (Core Feature)
- [ ] Integrate Puppeteer in the backend
- [ ] Render the HTML template and convert to PDF
- [ ] Handle PDF generation, download, and potential errors
- [ ] Build 3 initial templates (Minimal, Modern, Professional)

### Phase 8: Dashboard
- [ ] Create a simple dashboard layout
- [ ] Implement summary metrics (Total invoiced, counts, pending/overdue amounts)
- [ ] List recent invoices with status badges
- [ ] Add prominent "Create Invoice" CTA and quick actions

### Phase 9: Polish and QA
- [ ] Implement Loading states, Skeletons, Empty states, and Toast notifications
- [ ] Thorough form validation and error handling
- [ ] Responsive UI testing (mobile-first for invoice creation)
- [ ] Accessibility, Security, and Performance reviews
- [ ] Visual QA for generated PDFs

### Phase 10: Deployment
- [ ] Provision Production PostgreSQL
- [ ] Deploy Backend (Node/Express) and Frontend (Next.js)
- [ ] Configure environment variables, CORS, and HTTPS
- [ ] Set up Email provider and File storage (for logos)
- [ ] Run production database migrations
- [ ] Implement logging, error monitoring, and a backup strategy

---

## Definition of Done (MVP)

The MVP is complete when the following workflows are smooth and fast:

**New User Journey:**
Register → Verify → Configure Business → Add Client → Create Invoice → Add Services → See Totals → Preview → Generate & Download PDF

**Returning User Journey:**
Login → Create Invoice → Select Client → Add Service → Generate PDF *(Target: 20-60 seconds)*
