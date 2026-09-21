# Freelancer Invoice Generator --- Project Plan

## 1. Project Overview

### Product idea

A fast, simple, secure invoice generator designed primarily for
freelancers, independent developers, designers, creators, and small
service providers.

The core problem:

> Freelancers often need to create a professional invoice after
> completing a job, but full accounting software is unnecessarily
> complicated for this simple task.

The product should solve one problem extremely well:

> **Create a professional invoice in under a minute.**

The application should prioritize: - Speed - Simplicity -
Professional-looking invoices - Security - Minimal steps - Mobile
responsiveness - Reusable client/business information - Reliable PDF
generation

This is initially a focused MVP, not a full accounting platform.

------------------------------------------------------------------------

# 2. Product Philosophy

## Core principle

### "Create → Preview → Generate → Done."

The user should not need to navigate through many pages or a complicated
workflow.

A typical invoice workflow should be:

1.  Log in
2.  Click "Create Invoice"
3.  Select or create client
4.  Add services/items
5.  Confirm totals
6.  Preview
7.  Generate/download PDF

Returning users should be able to create an invoice in approximately
20--60 seconds because their business information, clients, defaults,
and preferences are already saved.

## Do NOT overbuild the MVP

Do not initially build: - Full accounting - Expense management -
Payroll - Inventory - CRM - Bank integrations - Complex payment
processing - Team management - Enterprise permissions - AI accounting
assistant - Complex analytics

The product is an **invoice generator first**.

------------------------------------------------------------------------

# 3. Target Users

Primary users: - Freelancers - Web developers - Designers - Video
editors - Small agencies - Consultants - Digital creators - Small
service businesses

Initial target: - Individuals who need professional invoices quickly -
Users who do not want complicated accounting software

Potential geographic focus: - International freelancers - Tunisia /
North Africa as an initial personal use case - Support multiple
currencies and languages later

------------------------------------------------------------------------

# 4. MVP Features

## Authentication

Required: - Register - Login - Logout - Password hashing - Email
verification - Forgot password - Reset password - Protected routes

Do not initially add: - Google OAuth - Apple OAuth - 2FA - SSO - Team
accounts

These can be added later if needed.

------------------------------------------------------------------------

# 5. Business Profile

Each user can configure their business/freelancer information.

Fields: - Business/freelancer name - Logo - Email - Phone - Address -
Country - Tax/VAT number (optional) - Default currency - Invoice
prefix - Default payment terms - Payment information (optional) -
Default notes (optional)

Example:

``` text
Dali's Tech
Web Developer
dali@example.com
+216 XX XXX XXX
Tunis, Tunisia
Currency: EUR
Invoice prefix: INV
Payment terms: 14 days
```

The information should automatically appear when creating a new invoice.

------------------------------------------------------------------------

# 6. Clients

Users can save clients for reuse.

Client fields: - Client/company name - Email - Phone - Address -
Country - Tax/VAT number (optional) - Notes (optional)

Features: - Create client - Edit client - Delete client - Search
clients - Select existing client while creating invoice - Create a new
client without leaving the invoice workflow

Important UX requirement:

The user should not be forced to create a client on a separate page
before creating an invoice.

A "Create client" action should be available directly inside the invoice
form.

------------------------------------------------------------------------

# 7. Invoices

Invoice fields:

### General

-   Invoice number
-   Issue date
-   Due date
-   Currency
-   Status

### Client

-   Client reference

### Items

Each item contains: - Description - Quantity - Unit price - Total

### Financial values

-   Subtotal
-   Discount
-   Tax
-   Total

### Additional information

-   Notes
-   Payment terms
-   Payment information

Invoice statuses:

``` text
DRAFT
SENT
PAID
OVERDUE
CANCELLED
```

The MVP can initially focus on: - DRAFT - SENT - PAID - OVERDUE

------------------------------------------------------------------------

# 8. Invoice Numbering

Default format:

``` text
INV-2026-001
INV-2026-002
INV-2026-003
```

Users should eventually be able to customize: - Prefix - Starting number

Example:

``` text
INV-2026-001
DAL-2026-001
FACT-2026-001
```

Invoice numbers must be unique per user.

Avoid relying on database IDs as the visible invoice number.

------------------------------------------------------------------------

# 9. Invoice Creation UX

The main invoice creation interface should be a single logical page.

Suggested structure:

``` text
Create Invoice

Business
[ Automatically loaded business information ]

Client
[ Search existing client ]
[ + Create client ]

Invoice details
Invoice number
Issue date
Due date
Currency

Items
------------------------------------------------
Description       Qty       Price       Total
Website           1         €500        €500
------------------------------------------------
[ + Add item ]

Summary
Subtotal                         €500
Discount                           €0
Tax                                €0
TOTAL                            €500

Notes
[ Optional notes ]

[ Preview Invoice ]
[ Generate PDF ]
```

Desktop: - Form on the left - Live invoice preview on the right

Mobile: - Form sections stacked - Preview accessible through a dedicated
action

------------------------------------------------------------------------

# 10. Speed Requirements

The application should feel extremely fast.

Goals: - Fast initial page load - Fast navigation - Minimal unnecessary
API requests - Optimistic/local UI updates where appropriate - No
unnecessary multi-step wizard - Automatic calculations - Existing client
information should populate instantly - Business defaults should be
preloaded - PDF generation should provide clear loading feedback

The user should always understand what is happening.

Avoid: - Unnecessary animations - Heavy visual effects - Excessive API
calls - Complex dashboard widgets - Large dependencies when a simple
solution works

------------------------------------------------------------------------

# 11. Dashboard

Keep the dashboard simple.

Example:

``` text
Good afternoon 👋

[ + Create Invoice ]

This month

€2,450
Total invoiced

5
Invoices

2
Pending

1
Overdue

Recent invoices
------------------------------------------------
INV-2026-014   ABC Agency     €500    Paid
INV-2026-013   XYZ Studio     €300    Pending
INV-2026-012   John Doe       €150    Draft
```

Potential actions: - Create invoice - Open invoice - Download PDF - Mark
as paid - Duplicate invoice

Do not build complex analytics in the MVP.

------------------------------------------------------------------------

# 12. Client Management

Dedicated Clients page:

``` text
Clients

[ Search clients... ]

ABC Agency
12 invoices
€4,500 invoiced

XYZ Studio
3 invoices
€1,200 invoiced
```

Client detail page can eventually show: - Contact information - Invoice
history - Total invoiced - Outstanding amount

Keep the first version simple.

------------------------------------------------------------------------

# 13. PDF Generation

PDF generation is a core feature.

Recommended approach:

``` text
Invoice data
     ↓
Invoice HTML template
     ↓
Puppeteer
     ↓
PDF
```

Use HTML/CSS for invoice templates instead of manually drawing every PDF
element.

Advantages: - Easier styling - Reusable templates - Better control over
layout - Easier branding - Same visual language as the web application

PDF must work independently of the application UI.

The generated document should look professional when opened, printed, or
emailed.

------------------------------------------------------------------------

# 14. Invoice Templates

Start with 3 templates.

## Template 1 --- Minimal

-   Clean
-   Mostly monochrome
-   Strong typography
-   Very little decoration

## Template 2 --- Modern

-   Subtle brand color
-   Modern spacing
-   Strong visual hierarchy

## Template 3 --- Professional

-   Traditional business invoice structure
-   Formal appearance
-   Strong information hierarchy

Users should eventually be able to select:

``` text
Template
[ Minimal ]
[ Modern ]
[ Professional ]
```

Do not create 10--20 templates in the MVP.

------------------------------------------------------------------------

# 15. Design System

## Technology

Use: - Tailwind CSS - shadcn/ui - TypeScript

## Typography

Recommended: - Inter - or Geist

The UI should feel: - Professional - Clean - Modern - Fast - Trustworthy

Avoid: - Excessive gradients - Excessive glassmorphism - Huge decorative
elements - AI-generated-looking UI - Unnecessary animations - Overly
colorful accounting-dashboard aesthetics

## Base colors

Suggested foundation:

``` text
Background: #F8FAFC
Surface:    #FFFFFF
Text:       #0F172A
Muted:      #64748B
Border:     #E2E8F0
```

Use a single primary brand color.

Status colors: - Paid → green - Pending → amber - Overdue → red - Draft
→ neutral/gray

------------------------------------------------------------------------

# 16. UI Components

Use shadcn/ui as the foundation.

Expected reusable components:

``` text
Button
Input
Textarea
Select
Combobox
Dialog
DropdownMenu
Popover
Calendar
Badge
Card
Table
Tabs
Toast
Tooltip
Skeleton
Alert
```

Domain components:

``` text
InvoiceForm
InvoiceItems
InvoiceSummary
InvoicePreview
InvoiceTemplate
ClientSelector
ClientForm
InvoiceCard
InvoiceStatusBadge
DashboardStats
```

Do not duplicate UI components unnecessarily.

------------------------------------------------------------------------

# 17. Recommended Tech Stack

## Frontend

``` text
Next.js
TypeScript
Tailwind CSS
shadcn/ui
React Hook Form
Zod
```

Next.js is responsible for: - Application UI - Routing - Authentication
UI - Dashboard - Invoice creation interface - Client management -
Settings - Preview

## Backend

``` text
Node.js
Express
TypeScript
REST API
```

Express is responsible for: - Authentication - User/business profile
APIs - Client APIs - Invoice APIs - PDF generation - Email
functionality - Business logic

## Database

``` text
PostgreSQL
Prisma ORM
```

### Why PostgreSQL?

The data is relational:

``` text
User
 ├── Business Profile
 ├── Clients
 └── Invoices
       └── Invoice Items
```

Relationships are central to the application: - One user → many
clients - One user → many invoices - One client → many invoices - One
invoice → many invoice items

PostgreSQL provides strong relational integrity and works naturally with
this structure.

MongoDB would also work, but its flexibility is not particularly
valuable for this application's core data model.

## Authentication

Use: - Argon2id or bcrypt for password hashing - Secure HTTP-only
cookies - Short-lived authentication/session mechanism - Email
verification - Password reset tokens - Secure token expiration

Avoid storing sensitive long-lived authentication tokens in
localStorage.

## PDF

``` text
Puppeteer
```

## Email

Potential architecture:

``` text
Nodemailer
+
Transactional email provider
```

Email functionality can initially be limited to: - Email verification -
Password reset

Invoice email sending can be added later.

------------------------------------------------------------------------

# 18. Database Schema

Initial conceptual schema:

``` text
User
------
id
email
passwordHash
emailVerified
createdAt
updatedAt


BusinessProfile
---------------
id
userId
name
email
phone
address
country
taxNumber
logoUrl
defaultCurrency
invoicePrefix
defaultPaymentTerms
defaultNotes
createdAt
updatedAt


Client
------
id
userId
name
email
phone
address
country
taxNumber
notes
createdAt
updatedAt


Invoice
-------
id
userId
clientId

invoiceNumber
status
issueDate
dueDate
currency

subtotal
discount
tax
total

notes
paymentTerms
paymentInformation

createdAt
updatedAt


InvoiceItem
-----------
id
invoiceId

description
quantity
unitPrice
total
```

Database constraints should ensure: - User email uniqueness - Invoice
number uniqueness per user - Referential integrity - Required fields are
enforced - Numeric financial fields use appropriate decimal types

For money, avoid JavaScript floating-point calculations where precision
matters. Use decimal/numeric database types and a reliable calculation
strategy.

------------------------------------------------------------------------

# 19. API Structure

Use a clean REST API.

Example:

``` text
/api/auth/register
/api/auth/login
/api/auth/logout
/api/auth/verify-email
/api/auth/forgot-password
/api/auth/reset-password

/api/me

/api/business-profile
/api/business-profile/logo

/api/clients
/api/clients/:id

/api/invoices
/api/invoices/:id
/api/invoices/:id/pdf
/api/invoices/:id/status
/api/invoices/:id/duplicate
```

Potential future endpoints:

``` text
/api/invoices/:id/send
/api/invoices/:id/payment
/api/templates
/api/recurring-invoices
```

------------------------------------------------------------------------

# 20. Backend Architecture

Use a modular but not over-engineered structure.

Suggested:

``` text
server/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── business-profile/
│   │   ├── clients/
│   │   ├── invoices/
│   │   ├── pdf/
│   │   └── email/
│   │
│   ├── middleware/
│   ├── config/
│   ├── utils/
│   ├── app.ts
│   └── server.ts
│
├── prisma/
│   └── schema.prisma
│
└── package.json
```

Do not use microservices for the MVP.

One backend + one database is enough.

------------------------------------------------------------------------

# 21. Frontend Architecture

Suggested:

``` text
web/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── register/
│   │   ├── verify-email/
│   │   └── forgot-password/
│   │
│   ├── dashboard/
│   ├── invoices/
│   │   ├── new/
│   │   └── [id]/
│   │
│   ├── clients/
│   ├── settings/
│   └── ...
│
├── components/
│   ├── ui/
│   ├── invoice/
│   ├── client/
│   └── dashboard/
│
├── lib/
├── hooks/
├── schemas/
└── types/
```

Keep the code type-safe and easy to maintain.

------------------------------------------------------------------------

# 22. Security Requirements

This application stores personal, client, and financial information.

Security requirements: - Hash passwords - Secure cookies - Input
validation with Zod - Validate every API request - Rate-limit
authentication endpoints - Protect against unauthorized resource
access - Never trust client-provided user IDs - Always scope database
queries to the authenticated user - Sanitize/validate uploaded files -
Restrict logo upload file types and sizes - Secure password reset
tokens - Expire verification/reset tokens - Use HTTPS in production -
Keep secrets in environment variables - Never expose database
credentials to the frontend - Avoid leaking sensitive information in
error messages - Log security-relevant errors without logging
passwords/tokens

Critical authorization rule:

``` text
Authenticated user
       ↓
Requested resource
       ↓
Verify resource belongs to this user
       ↓
Allow operation
```

For example, retrieving an invoice must not be based only on:

``` text
invoice.id
```

It should also verify ownership:

``` text
invoice.id
AND invoice.userId = authenticatedUser.id
```

------------------------------------------------------------------------

# 23. Validation

Use Zod for shared/consistent validation.

Validate: - Email - Password - Client information - Invoice dates -
Invoice items - Quantity - Unit price - Tax - Discount - Currency -
Invoice number - Uploaded logo

Financial calculations must be performed server-side as well.

Never trust totals sent by the browser.

The backend should calculate:

``` text
item total
subtotal
discount
tax
grand total
```

itself.

------------------------------------------------------------------------

# 24. Error Handling

The API should use consistent errors.

Example:

``` json
{
  "success": false,
  "message": "Invoice not found"
}
```

Frontend should display useful errors without exposing internal
implementation details.

Handle: - Network failures - Validation errors - Unauthorized requests -
Forbidden access - Not found - Server errors - PDF generation failures

------------------------------------------------------------------------

# 25. Performance

Performance is a core product requirement.

Priorities: 1. Fast invoice creation 2. Fast dashboard 3. Fast client
search 4. Fast PDF generation 5. Minimal network requests 6. Efficient
database queries

Avoid premature optimization, but don't introduce unnecessary
complexity.

Use: - Database indexes where appropriate - Pagination for
invoice/client lists - Debounced search if necessary - Lazy loading for
heavy functionality - Efficient API responses - Proper loading/skeleton
states

------------------------------------------------------------------------

# 26. Mobile Responsiveness

The application must work well on: - Desktop - Laptop - Tablet - Mobile

The invoice creation experience is particularly important on mobile.

Do not simply shrink the desktop UI.

Use responsive layouts intentionally.

------------------------------------------------------------------------

# 27. MVP Pages

Public:

``` text
/
```

Authentication:

``` text
/login
/register
/verify-email
/forgot-password
/reset-password
```

Application:

``` text
/dashboard
/invoices
/invoices/new
/invoices/[id]
/clients
/clients/[id]
/settings
```

Potential future:

``` text
/templates
/recurring-invoices
```

------------------------------------------------------------------------

# 28. Development Phases

## Phase 0 --- Project Setup

-   [ ] Create project repository
-   [ ] Decide monorepo or separate frontend/backend structure
-   [ ] Initialize Next.js
-   [ ] Initialize Express + TypeScript
-   [ ] Configure Tailwind
-   [ ] Configure shadcn/ui
-   [ ] Configure ESLint/formatting
-   [ ] Configure environment variables
-   [ ] Configure PostgreSQL
-   [ ] Configure Prisma
-   [ ] Create initial README
-   [ ] Establish folder structure

## Phase 1 --- Design Foundation

-   [ ] Define brand name
-   [ ] Define logo direction
-   [ ] Define typography
-   [ ] Define colors
-   [ ] Define spacing
-   [ ] Define border radius
-   [ ] Define shadows
-   [ ] Configure shadcn components
-   [ ] Create application shell
-   [ ] Create responsive navigation

## Phase 2 --- Authentication

-   [ ] Database User model
-   [ ] Register
-   [ ] Login
-   [ ] Logout
-   [ ] Password hashing
-   [ ] Secure session/cookie handling
-   [ ] Email verification
-   [ ] Forgot password
-   [ ] Reset password
-   [ ] Protected API middleware
-   [ ] Protected frontend routes

## Phase 3 --- Business Profile

-   [ ] Business profile model
-   [ ] Settings page
-   [ ] Business information form
-   [ ] Logo upload
-   [ ] Default currency
-   [ ] Invoice prefix
-   [ ] Default payment terms
-   [ ] Default notes

## Phase 4 --- Clients

-   [ ] Client model
-   [ ] Client list
-   [ ] Create client
-   [ ] Edit client
-   [ ] Delete client
-   [ ] Search clients
-   [ ] Client detail
-   [ ] Client selector in invoice form
-   [ ] Create client directly from invoice form

## Phase 5 --- Invoice Engine

-   [ ] Invoice model
-   [ ] Invoice item model
-   [ ] Invoice number generation
-   [ ] Create invoice
-   [ ] Edit invoice
-   [ ] Delete draft
-   [ ] Add invoice items
-   [ ] Remove invoice items
-   [ ] Quantity
-   [ ] Unit price
-   [ ] Discount
-   [ ] Tax
-   [ ] Automatic calculations
-   [ ] Server-side calculation
-   [ ] Draft status
-   [ ] Invoice detail page

## Phase 6 --- Invoice Preview

-   [ ] Invoice HTML template
-   [ ] Live preview
-   [ ] Responsive preview
-   [ ] Business information
-   [ ] Client information
-   [ ] Invoice information
-   [ ] Items
-   [ ] Totals
-   [ ] Notes
-   [ ] Payment information

## Phase 7 --- PDF

-   [ ] Integrate Puppeteer
-   [ ] Render invoice HTML
-   [ ] Generate PDF
-   [ ] Download PDF
-   [ ] Handle PDF generation errors
-   [ ] Add Minimal template
-   [ ] Add Modern template
-   [ ] Add Professional template

## Phase 8 --- Dashboard

-   [ ] Dashboard layout
-   [ ] Create invoice CTA
-   [ ] Total invoiced
-   [ ] Invoice count
-   [ ] Pending amount
-   [ ] Overdue amount
-   [ ] Recent invoices
-   [ ] Invoice status badges
-   [ ] Quick actions

## Phase 9 --- Polish

-   [ ] Loading states
-   [ ] Skeletons
-   [ ] Empty states
-   [ ] Toast notifications
-   [ ] Error states
-   [ ] Form validation
-   [ ] Responsive testing
-   [ ] Accessibility review
-   [ ] Security review
-   [ ] Performance review
-   [ ] PDF visual QA

## Phase 10 --- Deployment

-   [ ] Production PostgreSQL
-   [ ] Backend deployment
-   [ ] Frontend deployment
-   [ ] Environment variables
-   [ ] CORS configuration
-   [ ] HTTPS
-   [ ] Email provider
-   [ ] File storage
-   [ ] Production database migrations
-   [ ] Logging
-   [ ] Error monitoring
-   [ ] Backup strategy

------------------------------------------------------------------------

# 29. Post-MVP Roadmap

After the core product is stable:

## Version 1.1

-   [ ] Duplicate invoice
-   [ ] Mark invoice as paid
-   [ ] Better search
-   [ ] Filters
-   [ ] More currencies
-   [ ] More invoice customization
-   [ ] Custom colors
-   [ ] Better PDF templates

## Version 1.2

-   [ ] Send invoice by email
-   [ ] Invoice email templates
-   [ ] Payment status tracking
-   [ ] Client invoice history
-   [ ] Outstanding balance

## Version 1.3

-   [ ] Recurring invoices
-   [ ] Automatic invoice creation
-   [ ] Payment links
-   [ ] More languages
-   [ ] French
-   [ ] English
-   [ ] Arabic / RTL

## Future

-   [ ] Team accounts
-   [ ] Subscription billing
-   [ ] Advanced analytics
-   [ ] Payment integrations
-   [ ] Expense tracking
-   [ ] Accounting integrations

Only build these if user demand justifies them.

------------------------------------------------------------------------

# 30. Internationalization

The initial UI can be English.

Architecture should avoid making future localization difficult.

Potential languages: - English - French - Arabic

Potential currencies: - EUR - USD - GBP - TND

Arabic invoice support should include proper RTL handling and PDF
rendering.

This should be treated as a dedicated feature rather than rushed into
the MVP.

------------------------------------------------------------------------

# 31. SaaS Considerations

The application can eventually become a SaaS.

Possible model:

### Free

-   Limited invoices
-   Limited clients
-   Basic templates
-   PDF export

### Pro

-   Unlimited invoices
-   Unlimited clients
-   Premium templates
-   Custom branding
-   Email invoices
-   Recurring invoices
-   Advanced features

Do not implement subscription billing until the core product is
validated.

------------------------------------------------------------------------

# 32. Product Metrics

Potential metrics after launch: - Number of registered users - Number of
invoices created - Number of PDFs generated - Number of returning
users - Time from opening invoice form to PDF generation - Number of
clients created - Free → paid conversion later

The most important early product signal is:

> Are users repeatedly coming back to create invoices?

------------------------------------------------------------------------

# 33. Important Engineering Principles

1.  Keep the MVP small.
2.  Prefer simple architecture.
3.  Use TypeScript everywhere.
4.  Validate input on the server.
5.  Never trust client-side totals.
6.  Protect every resource with ownership checks.
7.  Keep business logic out of UI components.
8.  Reuse UI components.
9.  Keep API contracts predictable.
10. Avoid unnecessary dependencies.
11. Avoid microservices.
12. Optimize the invoice creation flow before adding features.
13. Make PDF output a first-class feature.
14. Design mobile-first where appropriate.
15. Write maintainable code rather than clever code.

------------------------------------------------------------------------

# 34. Antigravity IDE Development Instructions

The AI coding agent should understand the following project context
before modifying code:

This is a real product-oriented project, not a throwaway demo.

Priorities:

``` text
1. Correctness
2. Security
3. Speed
4. UX simplicity
5. Maintainability
6. Visual quality
7. Feature expansion
```

Before implementing a major feature: - Understand the existing
architecture - Reuse existing patterns - Avoid unnecessary refactoring -
Do not introduce new libraries without a reason - Keep frontend/backend
responsibilities clear - Keep TypeScript types accurate

For every feature: 1. Explain the planned change briefly. 2. Identify
affected files/modules. 3. Implement the smallest clean solution. 4.
Validate the implementation. 5. Check for regressions. 6. Update
documentation when necessary.

Do not randomly rewrite existing architecture.

Do not add features that are not part of the current task.

Keep the application simple and focused.

------------------------------------------------------------------------

# 35. Definition of Done for MVP

The MVP is considered complete when a new user can:

``` text
Register
   ↓
Verify account
   ↓
Configure business information
   ↓
Create/select a client
   ↓
Create an invoice
   ↓
Add services
   ↓
See automatically calculated totals
   ↓
Preview invoice
   ↓
Generate professional PDF
   ↓
Download PDF
```

And a returning user can do:

``` text
Login
   ↓
Create Invoice
   ↓
Select existing client
   ↓
Add service
   ↓
Generate PDF
```

with minimal friction.

------------------------------------------------------------------------

# 36. Final Product Vision

The long-term vision is not:

> "Build another accounting application."

It is:

> **The fastest way for a freelancer to create a professional invoice.**

Every future feature should be evaluated against that principle.

If a feature makes invoicing faster, clearer, or more professional, it
may belong in the product.

If it adds complexity without improving the core workflow, it should
probably wait.
