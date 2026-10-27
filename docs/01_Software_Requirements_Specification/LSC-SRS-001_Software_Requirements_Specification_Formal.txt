________________________________________________________________________________

                    SOFTWARE REQUIREMENTS SPECIFICATION

         Lideta Sub-City Official Website and Administration System

________________________________________________________________________________

Document Number:      LSC-SRS-001
Version:              1.0.0
Status:               Final
Classification:       Confidential — Internal Use Only
Prepared For:         IT Department / Information Network Security Administration
Prepared By:          Development Team — Lideta Sub-City Administration
Date of Issue:        August 2026

________________________________________________________________________________

REVISION HISTORY

  Version  Date           Author               Description
  -------  -------------  -------------------  --------------------------------
  0.1      June 2026      Development Team     Initial draft
  0.9      August 2026    Development Team     Internal review draft
  1.0.0    August 2026    Development Team     Final release

________________________________________________________________________________

DISTRIBUTION LIST

  This document is intended for the following parties:

  - Lideta Sub-City Administration — IT Department
  - Lideta Sub-City Administration — Information Network Security Office
  - Authorized third-party security auditors conducting penetration testing

  Unauthorized distribution of this document is strictly prohibited.

________________________________________________________________________________


TABLE OF CONTENTS

  1.  Introduction ....................................................  §1
      1.1  Purpose .....................................................  §1.1
      1.2  Scope ........................................................  §1.2
      1.3  Definitions, Acronyms, and Abbreviations ....................  §1.3
      1.4  References ...................................................  §1.4
      1.5  Overview .....................................................  §1.5

  2.  Overall Description ..............................................  §2
      2.1  Product Perspective ..........................................  §2.1
      2.2  Product Functions Summary ....................................  §2.2
      2.3  User Classes and Characteristics .............................  §2.3
      2.4  Operating Environment ........................................  §2.4
      2.5  Design and Implementation Constraints ........................  §2.5
      2.6  Assumptions and Dependencies .................................  §2.6

  3.  System Architecture ..............................................  §3
      3.1  Architectural Pattern ........................................  §3.1
      3.2  Front-End Architecture .......................................  §3.2
      3.3  Back-End Architecture ........................................  §3.3
      3.4  Data Flow Overview ...........................................  §3.4

  4.  Roles and Access Control .........................................  §4
      4.1  Role Overview ................................................  §4.1
      4.2  Role Definitions .............................................  §4.2
      4.3  Permission Matrix ............................................  §4.3
      4.4  Role Enforcement .............................................  §4.4
      4.5  Token Management .............................................  §4.5

  5.  Functional Requirements ..........................................  §5
      5.1  Public Portal ................................................  §5.1
      5.2  Citizen Account System .......................................  §5.2
      5.3  Administration Panel .........................................  §5.3
      5.4  Super-Administration .........................................  §5.4

  6.  Non-Functional Requirements ......................................  §6
      6.1  Performance ..................................................  §6.1
      6.2  Availability .................................................  §6.2
      6.3  Scalability ..................................................  §6.3
      6.4  Usability ....................................................  §6.4
      6.5  Maintainability ..............................................  §6.5
      6.6  Reliability ..................................................  §6.6
      6.7  Portability ..................................................  §6.7
      6.8  Internationalisation .........................................  §6.8

  7.  Database Schema ..................................................  §7
      7.1  Overview .....................................................  §7.1
      7.2  Entity-Relationship Diagram ..................................  §7.2
      7.3  Key Relationships ............................................  §7.3
      7.4  Class Diagram ................................................  §7.4

  8.  API Specification ................................................  §8
      8.1  Base URL and Conventions .....................................  §8.1
      8.2  Authentication Endpoints .....................................  §8.2
      8.3  User Endpoints ...............................................  §8.3
      8.4  Admin Endpoints ..............................................  §8.4
      8.5  Superadmin Endpoints .........................................  §8.5
      8.6  News Endpoints ...............................................  §8.6
      8.7  Events Endpoints .............................................  §8.7
      8.8  Vacancies Endpoints ..........................................  §8.8
      8.9  Complaints Endpoints .........................................  §8.9
      8.10 Contacts Endpoints ...........................................  §8.10
      8.11 Static File Endpoints ........................................  §8.11

  9.  Real-Time Communication ..........................................  §9
      9.1  Current Implementation ......................................  §9.1
      9.2  Future Considerations ........................................  §9.2

  10. Security Requirements ............................................  §10
      10.1 Authentication Security ......................................  §10.1
      10.2 Password Policy ..............................................  §10.2
      10.3 Transport Security ...........................................  §10.3
      10.4 Input Validation .............................................  §10.4
      10.5 CORS Policy ..................................................  §10.5
      10.6 File Upload Security .........................................  §10.6
      10.7 Session and Token Security ...................................  §10.7
      10.8 Activity Logging .............................................  §10.8
      10.9 Data Flow Security Diagram ...................................  §10.9

  11. Deployment Architecture ..........................................  §11
      11.1 Production Environment .......................................  §11.1
      11.2 Plesk Configuration ..........................................  §11.2
      11.3 URL Routing in Production ....................................  §11.3
      11.4 Static File Serving ..........................................  §11.4
      11.5 TLS / HTTPS ..................................................  §11.5
      11.6 Environment Variables ........................................  §11.6
      11.7 Development Environment ......................................  §11.7

  12. Appendices .......................................................  §12
      Appendix A  Technology Stack Summary ..............................  §A
      Appendix B  Complete Route Tree ...................................  §B
      Appendix C  File Upload Paths .....................................  §C
      Appendix D  Environment Variable Reference ........................  §D
      Appendix E  Admin Role Default Landing Paths ......................  §E
      Appendix F  Satisfaction Survey Question Reference ................  §F
      Appendix G  Known Limitations and Future Recommendations ..........  §G

________________________________________________________________________________


================================================================================
SECTION 1 — INTRODUCTION
================================================================================

1.1  Purpose
─────────────────────────────────────────────────────────────────────────────

  This document constitutes the Software Requirements Specification (SRS) for
  the Lideta Sub-City Official Website and Administration System, hereinafter
  referred to as "the System." It is prepared in conformance with the IEEE
  Std 830-1998 Recommended Practice for Software Requirements Specifications.

  This specification serves two primary audiences:

  (a) IT Department Developers — providing a definitive technical reference
      for the architecture, data model, API contracts, and behavioral
      requirements of the System, supporting ongoing maintenance and future
      development.

  (b) Information Network Security Administration — providing a comprehensive
      baseline document for security analysis, vulnerability assessment, threat
      modelling, and authorized penetration testing of all System components,
      including the public portal, administrative interfaces, REST API layer,
      database, file upload system, and authentication infrastructure.

  This document is authoritative. Any System behavior that contradicts a
  requirement stated herein shall be treated as a defect.

1.2  Scope
─────────────────────────────────────────────────────────────────────────────

  The System is a full-stack web application constituting the official digital
  platform of Lideta Sub-City Administration, one of the ten sub-cities of
  Addis Ababa, Ethiopia.

  The System encompasses the following components:

  (a) Public Citizen Portal — A multilingual (English, Amharic, Oromo)
      web interface accessible to any member of the public. Provides access
      to official news, events, department information, job vacancies, and
      the ability to submit complaints and contact inquiries.

  (b) Citizen Account System — A registration and authentication subsystem
      enabling citizens to create accounts, verify their email addresses via
      OTP, log in, and access a personal dashboard for tracking submitted
      complaints and job applications.

  (c) Multi-Role Administration Panel — A secured back-office web interface
      accessible to authorized government staff. Provides role-segmented
      tools for managing news, events, vacancies, complaints, and contact
      inquiries.

  (d) Super-Administration Panel — A separate secured interface for the
      system administrator, providing full administrative account management,
      system-wide reporting, and operational oversight.

  (e) REST API — A JSON-based HTTP API serving all data operations for both
      the public portal and the administration panel.

  The following are explicitly outside the scope of this specification:

  - Native mobile applications (iOS / Android).
  - Third-party integrations beyond the cloud OTP email service Authentication.
  - Physical infrastructure provisioning.
  - End-user training materials.

1.3  Definitions, Acronyms, and Abbreviations
─────────────────────────────────────────────────────────────────────────────

  Term            Definition
  ─────────────── ────────────────────────────────────────────────────────
  SRS             Software Requirements Specification
  API             Application Programming Interface
  REST            Representational State Transfer
  JWT             JSON Web Token — RFC 7519
  OTP             One-Time Password — 6-digit numeric code
  CRUD            Create, Read, Update, Delete
  SPA             Single-Page Application
  RBAC            Role-Based Access Control
  ESM             ECMAScript Modules (JavaScript module system)
  CORS            Cross-Origin Resource Sharing
  TLS             Transport Layer Security
  DFD             Data Flow Diagram
  ER              Entity-Relationship
  CV              Curriculum Vitae
  2FA             Two-Factor Authentication
  XSS             Cross-Site Scripting
  SQLi            SQL Injection
  CSWSH           Cross-Site WebSocket Hijacking
  OWASP           Open Web Application Security Project
  MIME            Multipurpose Internet Mail Extensions
  PII             Personally Identifiable Information
  LCP             Largest Contentful Paint (Core Web Vitals metric)

1.4  References
─────────────────────────────────────────────────────────────────────────────

  [1]  IEEE Std 830-1998 — IEEE Recommended Practice for Software
       Requirements Specifications. IEEE, 1998.

  [2]  RFC 7519 — JSON Web Token (JWT). IETF, 2015.
       https://tools.ietf.org/html/rfc7519

  [3]  OWASP Top 10 Web Application Security Risks, 2021 Edition.
       https://owasp.org/Top10

  [4]  Express.js v5 Documentation.
       https://expressjs.com

  [5]  React v19 Documentation.
       https://react.dev

  [6]  React Router v7 Documentation.
       https://reactrouter.com

  [7]  Cloud OTP Email Service Provider Documentation
       https://the cloud OTP email service.com/docs/guides/auth

  [8]  Phusion Passenger Node.js Integration Guide.
       https://www.phusionpassenger.com/docs/tutorials/deploy_to_production/

  [9]  Tailwind CSS v4 Documentation.
       https://tailwindcss.com/docs

1.5  Overview
─────────────────────────────────────────────────────────────────────────────

  The remainder of this document is organized as follows:

  Section 2 presents the overall system context, user classes, operating
  environment, and constraints. Section 3 describes the technical system
  architecture at the tier, component, and data-flow levels. Section 4
  defines all roles in the RBAC model and specifies their permissions.
  Section 5 contains all functional requirements, numbered FR-001 through
  FR-082, organized by feature domain. Section 6 contains all non-functional
  requirements, numbered NFR-001 through NFR-023. Section 7 presents the
  database schema using entity-relationship and class diagrams. Section 8
  specifies every API endpoint with request and response contracts. Section 9
  addresses real-time communication. Section 10 defines security requirements,
  numbered SR-001 through SR-029, and includes a data flow security diagram.
  Section 11 describes the production and development deployment architectures.
  Section 12 contains supporting appendices including technology stack,
  complete route tree, file upload paths, environment variables, and known
  limitations.

================================================================================

================================================================================
SECTION 2 — OVERALL DESCRIPTION
================================================================================

2.1  Product Perspective
─────────────────────────────────────────────────────────────────────────────

  The System is a greenfield web application developed for Lideta Sub-City
  Administration, Addis Ababa, Ethiopia. It replaces a static informational
  web presence with a dynamic, database-driven platform enabling two-way
  interaction between the sub-city government and its constituents.

  The System operates as a monolithic full-stack application in which a
  single Node.js/Express server process serves both the REST API and the
  compiled React Single-Page Application. It integrates with the email service's
  Authentication cloud service exclusively for OTP email delivery; all
  persistent application data resides in a MySQL database hosted within the
  Plesk server environment.

  The System is not a component of a larger software system. It operates
  independently and does not share data with or depend upon any other
  government information system.

2.2  Product Functions Summary
─────────────────────────────────────────────────────────────────────────────

  At the highest level, the System performs the following functions:

  (a) Content Publication — Publishing and managing official news articles,
      events, and department information in three languages: English (en),
      Amharic (am), and Oromo (or).

  (b) Citizen Services — Receiving public complaints with optional media
      attachments, contact inquiries, and service satisfaction surveys.

  (c) Career Portal — Publishing job vacancies and processing online
      applications including curriculum vitae file uploads.

  (d) Citizen Accounts — User registration with email OTP verification,
      authentication, and a personal dashboard for complaint and
      application tracking.

  (e) Administration — A role-segmented back-office for authorized staff
      to create, read, update, and delete all published content and to
      manage citizen interactions.

  (f) Super-Administration — System-wide admin account management,
      operational oversight, and aggregated reporting.

2.3  User Classes and Characteristics
─────────────────────────────────────────────────────────────────────────────

  User Class           Description                              Proficiency
  ─────────────────── ─────────────────────────────────────── ──────────────
  Anonymous Visitor    Any person accessing the public site     Non-technical
                       without a citizen account.

  Registered Citizen   A verified citizen with an account;      Non-technical
                       can track complaints and applications.

  Complaint Admin      Staff managing citizen complaints.       Low-to-medium

  Event Admin          Staff managing event publications.       Low-to-medium

  News Admin           Staff managing news articles.            Low-to-medium

  Vacancy Admin        Staff managing job postings and          Low-to-medium
                       processing applicants.

  General Admin        Staff with dashboard access and          Medium
                       all content management capabilities.

  Super Admin          System administrator with full           High
                       access including account management.

2.4  Operating Environment
─────────────────────────────────────────────────────────────────────────────

  OE-1: Client Environment
        Any standards-compliant modern web browser (Chrome 100+, Firefox 100+,
        Safari 15+, Edge 100+) on desktop or mobile device. No client-side
        installation is required.

  OE-2: Server Environment
        Node.js v18 or higher, running on Plesk Obsidian shared web hosting
        provided by EthioTelecom, on a Linux operating system, managed by the
        Phusion Passenger application server module.

  OE-3: Database Environment
        MySQL database server provided by Plesk's built-in database service,
        accessible to the Node.js process via the configured connection string.

  OE-4: External Service
        the cloud OTP email service Authentication cloud service, accessible over HTTPS, used
        exclusively for OTP email delivery. The System has no other dependency
        on the cloud OTP email service services.

  OE-5: File Storage
        Local filesystem on the Plesk server at the path
        `client/public/uploads/`. Subdirectories are created automatically
        by the upload middleware. Files are served statically.

2.5  Design and Implementation Constraints
─────────────────────────────────────────────────────────────────────────────

  C-1:  The System shall support three display languages (English, Amharic,
        Oromo) on all public-facing content. Language selection must take
        effect immediately without a full page reload.

  C-2:  All API communication in the production environment shall occur over
        HTTPS. HTTP requests shall be automatically redirected to HTTPS.

  C-3:  File upload size shall be limited to a maximum of 50 megabytes per
        uploaded file.

  C-4:  The application shall be deployed as a single server process.
        Horizontal scaling across multiple processes or instances is not
        supported in the current architecture.

  C-5:  The front-end is a Single-Page Application served from the same
        Express server that handles API requests. The React build output
        at `client/dist` must exist before the server starts.

  C-6:  JWT tokens used for both admin and citizen authentication are stored
        in the browser's `localStorage`. This is a known architectural
        constraint with security implications detailed in Section 10.7.

  C-7:  The `postgres` npm package using tagged template literals is used
        as the database query driver. This enforces parameterized queries
        by design, preventing SQL injection at the driver level.

2.6  Assumptions and Dependencies
─────────────────────────────────────────────────────────────────────────────

  A-1:  the cloud OTP email service Authentication is available and reachable from the server.
        If the cloud OTP email service is unavailable, OTP-dependent flows (email verification,
        password reset) will fail. No fallback OTP delivery mechanism is
        implemented for production.

  A-2:  The Plesk server has the Node.js application type enabled and the
        Phusion Passenger module configured for the domain.

  A-3:  The MySQL database is provisioned and its connection string is
        available in the `DATABASE_URL` environment variable before server
        startup.

  A-4:  The `client/dist` directory contains a valid React production build
        produced by running `npm run build:client` prior to deployment.

  A-5:  OTP email delivery SLA is governed by the email service's infrastructure
        and is outside the control of this application.

  A-6:  The `JWT_SECRET` environment variable is a cryptographically random
        string of at least 256 bits and is kept secret.

================================================================================

================================================================================
SECTION 3 — SYSTEM ARCHITECTURE
================================================================================

3.1  Architectural Pattern
─────────────────────────────────────────────────────────────────────────────

  The System implements a monolithic three-tier architecture consisting of a
  presentation tier (React SPA), an application tier (Express.js server), and
  a data tier (MySQL database), with an external dependency on the the cloud OTP email service
  Authentication service for OTP delivery.

  PRESENTATION TIER
  ┌─────────────────────────────────────────────────────────────────┐
  │  React 19 SPA  ·  React Router v7  ·  Tailwind CSS v4          │
  │  Framer Motion v13  ·  Recharts v3  ·  vite-plugin-svgr        │
  │  Built by Vite 7 → served as static files from client/dist     │
  └──────────────────────────┬──────────────────────────────────────┘
                             │  HTTP/HTTPS (REST, JSON)
  APPLICATION TIER
  ┌──────────────────────────▼──────────────────────────────────────┐
  │  Express.js v5  ·  Node.js v18+  ·  ESM                        │
  │  Middleware: CORS · JSON parser · Request logger               │
  │  Auth: jsonwebtoken · bcryptjs                                  │
  │  File Handling: Multer v2                                       │
  │  OTP: Cloud Email Service Client                                     │
  └──────────────────────────┬──────────────────────────────────────┘
                             │  TCP (mysql2 / postgres driver)
  DATA TIER
  ┌──────────────────────────▼──────────────────────────────────────┐
  │  MySQL — Plesk built-in database                                │
  │  14 tables: users, admins, news, events, vacancies,            │
  │  complaints, contacts, applicants, translations, logs, etc.    │
  └─────────────────────────────────────────────────────────────────┘
                             │  HTTPS (OTP delivery only)
  EXTERNAL SERVICE
  ┌──────────────────────────▼──────────────────────────────────────┐
  │  the cloud OTP email service Authentication — OTP email send and verify only      │
  └─────────────────────────────────────────────────────────────────┘

3.2  Front-End Architecture
─────────────────────────────────────────────────────────────────────────────

  3.2.1  Framework and Build

    The client is a React 19 Single-Page Application compiled by Vite 7.
    The compiled output (HTML, JS bundles, CSS, static assets) is placed
    in `client/dist/` and served by Express as static files in production.
    In development, the Vite development server runs on port 5173 and
    proxies API calls to the Express server on port 3000.

  3.2.2  Routing

    Client-side routing is handled by React Router v7 with nested layouts.
    Three layout shells exist:

    (a) <Home /> — Public site shell (Navbar, Footer, Outlet).
    (b) <Admin /> — Admin panel shell (Sidebar, AdminTop, Outlet).
        Provides adminContext. Verifies JWT on mount.
    (c) <SuperAdminLayout /> — Superadmin shell (bare Outlet).
        Verifies JWT on mount.

  3.2.3  State Management

    No external state management library is used. State is managed via:

    (a) LanguageContext — Global language selection (en/am/or).
        Persisted in localStorage. Provided at application root.
    (b) UserContext — Citizen authentication state and JWT.
        Token stored in localStorage under key "userToken".
    (c) adminContext — Admin authentication state and JWT.
        Token stored in localStorage under key "token".
        Context value provided directly by Admin.jsx layout, not a
        standalone provider component.

  3.2.4  Internationalisation

    All static UI strings for public pages are keyed in
    `client/src/data/translated_contents.json` with { en, am, or }
    sub-objects. Dynamic database content (news, events, vacancies)
    stores Amharic and Oromo translations in `amh` and `orm` JSON
    columns in the corresponding translation tables.

  3.2.5  Directory Structure

    client/src/
    ├── App.jsx                — Root router
    ├── index.css              — Tailwind v4, keyframes, @font-face
    ├── assets/icons/          — 73 SVG icon files (React components)
    ├── assets/fonts/          — Goldman, Jost, Roboto font files
    ├── components/shared/     — Navbar, Footer, AdminTop, Sidebar
    ├── components/ui/         — Reusable UI components
    ├── components/forms/      — Satisfaction survey components
    ├── components/utils/      — Context providers, RoleGuard, hooks
    ├── data/                  — Static JSON, department logos
    ├── pages/Admin/           — 8 admin panel pages
    ├── pages/SuperAdmin/      — 3 superadmin pages
    ├── pages/                 — 14 public and citizen pages
    └── utils/                 — api.js, validation.js, passwordHelper.js

3.3  Back-End Architecture
─────────────────────────────────────────────────────────────────────────────

  3.3.1  Server Entry Point

    `app.js` (project root) — Single-line ESM import of server/server.js.
    This file is required by Phusion Passenger as the configured startup file.

    `server/server.js` — Express application instantiation, middleware
    registration, route mounting, static file serving, SPA fallback, and
    `app.listen()`.

  3.3.2  Request Processing Pipeline

    All HTTP requests pass through the following pipeline in order:

      express.json()       Parse JSON request body.
           ↓
      corsMiddleware       Validate Origin header; apply CORS headers.
           ↓
      logger               Log method, URL, response status, duration.
           ↓
      Route matching       Dispatch to appropriate route handler.
           ↓
      authenticateToken    (Protected routes only) Verify admin JWT;
      authenticateUser     attach req.admin / req.user.
           ↓
      Route Handler        Execute business logic; query database.
           ↓
      JSON Response        Return result or error object.

  3.3.3  Server Directory Structure

    server/
    ├── server.js          — Entry; middleware + route registration
    ├── con/db.js          — DB connection (postgres driver + mock)
    ├── middleware/
    │   ├── auth.js        — authenticateToken, authenticateUser
    │   ├── cors.js        — CORS whitelist configuration
    │   ├── logger.js      — Request/response logger
    │   └── upload.js      — Multer disk storage
    ├── routes/
    │   ├── auth.js        — All authentication endpoints
    │   ├── user.js        — Citizen profile and dashboard
    │   ├── admin.js       — Admin profile, settings, uploads
    │   ├── superadmin.js  — Admin account management
    │   ├── news.js        — News CRUD
    │   ├── events.js      — Events CRUD
    │   ├── vacancies.js   — Vacancies CRUD + applications
    │   ├── complaints.js  — Complaints CRUD
    │   └── contacts.js    — Contacts + satisfaction surveys
    └── utils/
        ├── mailer.js       — Cloud OTP email send/verify
        ├── logActivity.js — Activity log writer
        └── rateLimit.js   — In-memory sliding window rate limiter

3.4  Data Flow Overview
─────────────────────────────────────────────────────────────────────────────

  The following diagram represents the primary data flows between the
  browser, Express server, database, file system, and external services.

  [Browser]
      │
      ├─ Static assets (HTML, JS, CSS, images)
      │        └──────────────────────────────── [Express Static / client/dist]
      │
      ├─ API requests (JSON, HTTPS)
      │        └──────────────────────────────── [Express Routes]
      │                                                  │
      │                                     [Middleware: JWT verification]
      │                                                  │
      │                                          [Route Handler]
      │                                                  │
      │                                        [MySQL DB Query]
      │                                                  │
      │                                          [JSON Response]
      │
      ├─ File uploads (multipart/form-data)
      │        └──────────────────────────────── [Multer → /uploads/ filesystem]
      │
      └─ OTP authentication flows
               └──────────────────────────────── [Express → Cloud OTP Email Service]
                                                         │
                                                  [Email Service → User Email Inbox]

================================================================================

================================================================================
SECTION 4 — ROLES AND ACCESS CONTROL
================================================================================

4.1  Role Overview
─────────────────────────────────────────────────────────────────────────────

  The System implements Role-Based Access Control (RBAC). Administrative
  roles are stored in the `admins.role` column of the database. Citizen
  users are a distinct entity class stored in the `users` table and are
  not part of the administrative RBAC hierarchy.

4.2  Role Definitions
─────────────────────────────────────────────────────────────────────────────

  Role Key           Display Name      Scope
  ────────────────── ─────────────── ─────────────────────────────────────
  superadmin         Super Admin       Full system access; account
                                       management of all admin accounts.

  admin              General Admin     Access to the main dashboard and all
                                       content management modules.

  complaint_admin    Complaint Admin   Restricted to the complaints
                                       management module.

  event_admin        Event Admin       Restricted to the events management
                                       module.

  news_admin         News Admin        Restricted to the news management
                                       module.

  vacancy_admin      Vacancy Admin     Restricted to the vacancies and
                                       applicants management module.

  (citizen)          Registered User   Not an admin role. Citizen users
                                       have access only to their personal
                                       dashboard at /account.

4.3  Permission Matrix
─────────────────────────────────────────────────────────────────────────────

  The following matrix defines which roles may perform each operation.
  "✓" denotes permitted; "—" denotes not permitted.

                                Super  General  Complaint  Event  News  Vacancy  Citizen  Anon
  Feature                       Admin  Admin    Admin      Admin  Admin Admin
  ─────────────────────────────  ─────  ───────  ─────────  ─────  ────  ───────  ───────  ────
  View public website              ✓      ✓        ✓         ✓      ✓     ✓        ✓        ✓
  Submit complaint                 ✓      ✓        ✓         ✓      ✓     ✓        ✓        ✓
  Submit contact form              ✓      ✓        ✓         ✓      ✓     ✓        ✓        ✓
  Apply for vacancy (unauth)       ✓      ✓        ✓         ✓      ✓     ✓        ✓        —
  Apply for vacancy (auth)         ✓      ✓        ✓         ✓      ✓     ✓        ✓        —
  View citizen dashboard           —      —        —         —      —     —        ✓        —
  Access admin dashboard           ✓      ✓        —         —      —     —        —        —
  Manage complaints                ✓      ✓        ✓         —      —     —        —        —
  Manage events                    ✓      ✓        —         ✓      —     —        —        —
  Manage news                      ✓      ✓        —         —      ✓     —        —        —
  Manage vacancies & applicants    ✓      ✓        —         —      —     ✓        —        —
  View/edit own admin profile      ✓      ✓        ✓         ✓      ✓     ✓        —        —
  Create peer admin account        ✓      ✓        —         —      —     —        —        —
  View all admin accounts          ✓      —        —         —      —     —        —        —
  Create/edit/delete any admin     ✓      —        —         —      —     —        —        —
  View system overview stats       ✓      —        —         —      —     —        —        —
  View all vacancy applications    ✓      —        —         —      —     —        —        —

4.4  Role Enforcement
─────────────────────────────────────────────────────────────────────────────

  4.4.1  Server-Side Enforcement (Authoritative)

    (a) The `authenticateToken` middleware verifies the admin JWT on all
        protected administrative routes and attaches the admin record to
        `req.admin`. This constitutes the authoritative authentication
        boundary.

    (b) The `isSuperadmin()` check within `server/routes/superadmin.js`
        returns HTTP 403 Forbidden if `req.admin.role !== 'superadmin'`.
        This constitutes the authoritative superadmin authorization boundary.

    (c) General admin route protection: any authenticated admin token is
        accepted on `/api/admin/*` routes. Sub-role restriction is enforced
        at the client-side route guard level, not at the API level (with
        the exception of superadmin-only routes).

  4.4.2  Client-Side Enforcement (UI Control, Not a Security Boundary)

    (a) The `RoleGuard` component reads `adminContext.admin.role` and
        redirects users to their permitted landing page if they navigate
        to a route outside their role's permissions.

    (b) The `superadmin` role bypasses all `RoleGuard` checks.

    (c) The admin sidebar renders navigation links conditionally based
        on the authenticated admin's role.

    NOTE FOR SECURITY AUDITORS: Client-side role enforcement is a user
    experience control only. It does not constitute a security boundary.
    All sensitive operations must be tested directly against the API
    without browser-mediated role controls.

4.5  Token Management
─────────────────────────────────────────────────────────────────────────────

  Token Type   Storage Location                Expiry    localStorage Key
  ──────────── ─────────────────────────────── ───────── ────────────────
  Admin JWT    browser localStorage             7 days    "token"
  Citizen JWT  browser localStorage             30 days   "userToken"

  Both token types are signed with the same `JWT_SECRET` environment
  variable using the HS256 algorithm. They are verified by separate
  middleware functions (`authenticateToken` for admins,
  `authenticateUser` for citizens) that query the respective database
  tables to validate the decoded subject ID.

================================================================================

================================================================================
SECTION 5 — FUNCTIONAL REQUIREMENTS
================================================================================

  Requirements in this section are identified by the prefix "FR-" followed
  by a three-digit number. Each requirement is stated using the imperative
  "shall" to denote a mandatory obligation.

5.1  Public Portal
─────────────────────────────────────────────────────────────────────────────

  5.1.1  Language Switching

  FR-001  The System shall support three display languages: English (en),
          Amharic (am), and Oromo (or) on all public-facing pages.

  FR-002  The System shall provide a language selector in the navigation
          bar enabling users to switch languages at any time.

  FR-003  The selected language shall be persisted in the browser's
          localStorage and automatically restored on subsequent visits.

  FR-004  All dynamic content retrieved from the database (news, events,
          vacancies, departments) shall be displayed in the user's selected
          language when a translation exists, falling back to English if
          a translation for the requested language is not available.

  5.1.2  Home Page

  FR-005  The home page shall display: a hero section, a preview of the
          three most recent news articles, an additional services section
          (events, news, job opportunities), and a complaints call-to-action.

  FR-006  The home page shall be fully responsive across viewport widths
          from 320px (mobile) to 2560px (large desktop).

  5.1.3  Departments

  FR-007  The System shall display all sub-city departments grouped by
          category with a horizontal tab bar for filtering.

  FR-008  Each department listing card shall display the department logo
          (or an initial-letter avatar if no logo is available), the
          department name, a short description, and the department category.

  FR-009  The department detail page shall display: full department name,
          head of department name, head photo (or placeholder), mission
          statement, vision statement, services list, core values, and
          contact information (location, email, phone, office hours,
          website link).

  FR-010  Department data is loaded from a static local JSON file
          (`departments.json`) and does not require a database call.

  5.1.4  News

  FR-011  The news listing page shall implement an editorial hierarchy:
          a full-width hero article, a two-article feature row, and a
          scrollable list of remaining articles below.

  FR-012  The news listing page shall display a banner strip showing the
          current date and the total number of published articles.

  FR-013  News articles shall be filterable by category via a horizontal
          scrollable tab bar (Technology, Infrastructure, Health, Education,
          Events, Security, Environment).

  FR-014  A search input shall filter articles in real time across title
          and description fields in all three supported languages.

  FR-015  The news detail page shall display: category pill, publication
          date, estimated reading time, headline, hero image with blur-up
          progressive loading, article body with amber left-border lede
          treatment on the first paragraph, social share buttons, and a
          "More from this category" section showing related articles.

  FR-016  The news detail page shall include a sticky right sidebar
          displaying the eight most recent news articles.

  FR-017  An amber reading progress bar shall be displayed fixed at the
          top of the viewport and shall advance as the user scrolls through
          the article.

  5.1.5  Events

  FR-018  The events listing page shall group events by calendar month and
          display each event using a card containing a calendar widget with
          a color-coded month header strip (color determined by event status)
          and a large day-of-month number.

  FR-019  Events shall be filterable by status via a horizontal tab bar:
          All, Upcoming, Pending, Complete, Canceled.

  FR-020  A search input shall filter events in real time by title and
          location.

  FR-021  The event detail page shall display: status pill, full date,
          location, event title, a hero image with the calendar widget
          overlaid at the bottom-left, event description with lede treatment,
          and a right sidebar with related upcoming events.

  5.1.6  Vacancies (Career Portal)

  FR-022  The vacancy listing page shall default to a category directory
          view presenting all job categories as individually clickable rows
          displaying the category name and the count of open positions in
          that category.

  FR-023  Clicking a category row in the directory view shall transition
          the page to a job list view scoped to that category.

  FR-024  The job list view shall include a persistent filter sidebar
          supporting filtering by: free-text search, category, and
          employment type (Full Time, Part Time, Contract, Internship,
          Remote).

  FR-025  On desktop viewports (≥1024px), the filter sidebar shall be
          displayed as a sticky left column. On mobile viewports, the
          sidebar shall be accessible via a filter button and shall render
          as an off-canvas slide-in drawer.

  FR-026  Each vacancy card shall display: job title, category, employment
          type, location, and posting date. The salary field shall NOT be
          displayed on any public-facing vacancy card or listing.

  FR-027  The vacancy detail page shall display: full job title, category,
          employment type, location, posting date, full job description,
          key responsibilities (bulleted list), required qualifications
          (bulleted list), and required skills (pill tags).

  FR-028  Unauthenticated users accessing the vacancy detail page shall
          see an authentication overlay on the application form sidebar and
          shall be redirected to `/account/auth?next=/vacancy/:id` upon
          attempting to apply.

  FR-029  Authenticated citizens shall apply for a vacancy by submitting
          their full name, email address, phone number, and a CV file in
          PDF format with a maximum size of 30 megabytes.

  FR-030  The System shall return a unique application reference number
          in the format APP-XXXXX (zero-padded five digits) upon successful
          application submission.

  5.1.7  Complaints

  FR-031  Any visitor, whether authenticated or anonymous, shall be able
          to submit a complaint via the public complaint form.

  FR-032  The complaint form shall collect: full name, address, sub-city,
          woreda, complaint type (selected from a predefined list), a text
          description, and optional media attachments.

  FR-033  The complaint form shall support in-browser recording of audio
          and video as complaint attachments, using the browser's
          MediaRecorder API.

  FR-034  The System shall return a complaint reference number in the
          format CPL-XXXXX upon successful submission.

  FR-035  Authenticated citizens shall be able to view their submitted
          complaints and current status from their personal dashboard.

  5.1.8  Contacts

  FR-036  Any visitor shall be able to submit a contact inquiry providing
          their first name, last name, email address, and message text.

  FR-037  All contact submissions shall be stored in the database and
          made available for review in the administration panel.

  5.1.9  Service Satisfaction Survey

  FR-038  A floating trigger widget shall appear on the public site after
          a configured time delay and prompt users to complete a service
          satisfaction survey.

  FR-039  The survey shall collect demographic information and responses
          to eleven (11) Likert-scale satisfaction questions. Demographic
          fields: gender, age range, marital status, education level,
          employment status, district, number of visits, services requested.

  FR-040  Survey responses shall be stored in the database and aggregated
          for administrative reporting via the satisfaction statistics
          dashboard.

5.2  Citizen Account System
─────────────────────────────────────────────────────────────────────────────

  5.2.1  Registration and Authentication

  FR-041  Citizens shall register an account by providing: first name,
          last name, email address, an optional Ethiopian-format phone
          number, and a password satisfying the strength requirements
          defined in SR-008.

  FR-042  Ethiopian phone number inputs shall be validated against the
          pattern: 09XXXXXXXX, 07XXXXXXXX, +2519XXXXXXXX, or +2517XXXXXXXX.

  FR-043  Upon successful registration, the System shall send a 6-digit
          OTP to the registered email address via the cloud OTP email service for email
          address verification.

  FR-044  Citizens shall authenticate using their registered email address
          and password.

  FR-045  The System shall provide a password reset flow consisting of:
          (1) citizen submits their email address; (2) system sends a
          6-digit OTP; (3) citizen enters the OTP; (4) citizen sets a new
          password meeting the strength requirements in SR-008.

  5.2.2  Citizen Dashboard

  FR-046  The citizen dashboard at `/account` shall display all complaints
          submitted by the citizen, showing reference number, type, current
          status, and submission date for each.

  FR-047  The citizen dashboard shall display all job applications submitted
          by the citizen, showing the vacancy title and application status.

  FR-048  Citizens shall be able to update their profile information:
          first name, last name, and phone number.

5.3  Administration Panel
─────────────────────────────────────────────────────────────────────────────

  5.3.1  Admin Authentication

  FR-049  Administrators shall authenticate at `/auth/login` using a
          username and password.

  FR-050  The admin login system shall include a two-factor authentication
          (2FA) flow via OTP email. The infrastructure is implemented and
          ready; the flag is configurable per-account.

  FR-051  Administrators shall be able to reset their password via the
          forgot-password OTP flow.

  5.3.2  News Management

  FR-052  Authorized administrators shall be able to create, read, update,
          and delete news articles.

  FR-053  Each news article shall support the following fields: title,
          short description, full description, category (one of: Technology,
          Infrastructure, Health, Education, Events, Security, Environment),
          cover image, and Amharic and Oromo translations of all text fields.

  5.3.3  Events Management

  FR-054  Authorized administrators shall be able to create, read, update,
          and delete events.

  FR-055  Each event shall support: title, description, location, start
          date, end date, status, photo, and Amharic/Oromo translations.

  FR-056  Administrators shall be able to update an event's status to one
          of: upcoming, pending, complete, canceled.

  5.3.4  Vacancies Management

  FR-057  Authorized administrators shall be able to create, read, update,
          and delete job vacancies.

  FR-058  Each vacancy shall support: title, short description, full
          description, location, salary, employment type, category, skills
          (array), responsibilities (array), qualifications (array), start
          date, end date, and Amharic/Oromo translations.

  FR-059  Authorized administrators shall be able to view all applicants
          for any vacancy, including the applicant's name, contact details,
          and a link to their uploaded CV file.

  FR-060  Authorized administrators shall be able to update an applicant's
          status to one of: submitted, reviewing, accepted, rejected.

  5.3.5  Complaints Management

  FR-061  Authorized administrators shall be able to view all submitted
          complaints with filtering by status and complaint type.

  FR-062  Authorized administrators shall be able to update a complaint's
          status, add internal notes, and assign a concerned staff member.

  FR-063  The admin complaints view shall display complaint counts by
          status and a statistical summary chart.

  5.3.6  Contact and Satisfaction Management

  FR-064  Authorized administrators shall be able to view pending contact
          messages and mark them as resolved.

  FR-065  Authorized administrators shall be able to view satisfaction
          survey statistics showing 30-day average scores per question
          and daily response volume trends.

  5.3.7  Admin Profile and Settings

  FR-066  All administrators shall be able to update their personal
          information: first name, last name, gender, residency, phone
          number, and email address.

  FR-067  All administrators shall be able to change their password after
          successfully verifying their current password.

  FR-068  All administrators shall be able to upload and remove a profile
          photograph.

  FR-069  All administrators shall be able to configure interface preferences:
          theme, font size, and interface language.

5.4  Super-Administration
─────────────────────────────────────────────────────────────────────────────

  FR-070  The superadmin shall be able to view all administrator accounts
          grouped by role.

  FR-071  The superadmin shall be able to create new administrator accounts
          with any of the following roles: Complaint Admin, Event Admin,
          News Admin, Vacancy Admin, Super Admin. The "General Admin" role
          is not available for creation via the superadmin panel.

  FR-072  The superadmin shall be able to edit any administrator account's
          personal information and role assignment.

  FR-073  The superadmin shall be able to delete any administrator account
          with the exception of their own currently authenticated account.

  FR-074  The superadmin shall have access to a system overview displaying:
          total complaint count, resolved complaint count, pending job
          applications count, and active events count.

  FR-075  The superadmin shall be able to view all job applicants across
          all vacancy postings, with aggregated application counts by
          vacancy category.

  FR-076  All administrator account management actions performed by the
          superadmin (create, update, delete) shall be recorded in the
          activity log with the action type, target entity, and timestamp.

================================================================================

================================================================================
SECTION 6 — NON-FUNCTIONAL REQUIREMENTS
================================================================================

  Requirements in this section are identified by the prefix "NFR-".

6.1  Performance
─────────────────────────────────────────────────────────────────────────────

  NFR-001  The public home page shall achieve a Largest Contentful Paint
           (LCP) of under 2.5 seconds on a standard broadband connection
           under normal single-user load conditions.

  NFR-002  All REST API endpoints shall return a response within 500
           milliseconds under normal single-user load on the production
           server.

  NFR-003  The compiled React SPA JavaScript bundle shall not exceed 500
           kilobytes gzipped for the main entry chunk. Code splitting via
           Vite's build optimizations shall be employed.

  NFR-004  Database queries on high-frequency read endpoints (GET /api/news,
           GET /api/events, GET /api/vacancies) shall use indexed lookups.
           Full sequential table scans on these endpoints are not acceptable.

6.2  Availability
─────────────────────────────────────────────────────────────────────────────

  NFR-005  The System shall remain available during routine Plesk platform
           maintenance by leveraging Phusion Passenger's automatic process
           management and restart capabilities.

  NFR-006  The System shall handle database connectivity failures gracefully
           by returning an HTTP 500 response with a JSON error body.
           The server process shall not crash on database errors.

6.3  Scalability
─────────────────────────────────────────────────────────────────────────────

  NFR-007  The API layer is stateless (all state is either in the database
           or in the client-side JWT). This design supports future
           migration to multi-instance deployment without architectural
           changes to the server code. The current deployment is single-
           instance, appropriate for sub-city government traffic volumes.

6.4  Usability
─────────────────────────────────────────────────────────────────────────────

  NFR-008  All public-facing pages shall be fully responsive and usable
           on viewport widths from 320px to 2560px without horizontal
           scrolling.

  NFR-009  Language switching shall take effect immediately without a full
           page reload or loss of navigation state.

  NFR-010  Form validation errors shall be displayed inline, immediately
           below the relevant form field, on blur (when the field loses
           focus). Errors shall not rely solely on color to convey meaning;
           descriptive text must accompany any color indicator.

  NFR-011  All interactive elements shall have accessible focus states
           visible to keyboard users.

6.5  Maintainability
─────────────────────────────────────────────────────────────────────────────

  NFR-012  All server-side route logic shall be organized in separate
           files by domain (news, events, vacancies, complaints, contacts,
           auth, user, admin, superadmin) under `server/routes/`.

  NFR-013  All client-side form validation logic shall be centralized
           in `client/src/utils/validation.js` and reused across all forms.

  NFR-014  Password strength validation logic shall be centralized in
           `client/src/utils/passwordHelper.js` and applied identically
           to all password-setting flows.

  NFR-015  Environment-specific configuration shall be managed exclusively
           via environment variables. No credentials, secrets, or
           environment-specific values shall be hard-coded in source files.

6.6  Reliability
─────────────────────────────────────────────────────────────────────────────

  NFR-016  The database connection layer shall provide an in-memory mock
           database fallback when `DATABASE_URL` is not set, ensuring the
           server process always starts successfully in development
           environments.

  NFR-017  File upload operations shall be atomic with respect to database
           records: the file shall be renamed to its final filename only
           after the corresponding database row has been committed.

  NFR-018  The OTP email subsystem shall implement an automatic retry
           mechanism, waiting 3.5 seconds and retrying once when the cloud OTP email service
           returns a rate-limit error.

6.7  Portability
─────────────────────────────────────────────────────────────────────────────

  NFR-019  The server application shall run on any Node.js v18+ environment
           with access to a MySQL database, without modification to source
           code.

  NFR-020  The front-end build output (`client/dist`) shall be deployable
           as a standalone SPA to any static file host or CDN when the
           API base URL is configured via the `VITE_API_URL` build-time
           environment variable.

6.8  Internationalisation
─────────────────────────────────────────────────────────────────────────────

  NFR-021  All static user interface strings for public-facing pages shall
           be defined in `client/src/data/translated_contents.json` with
           `en`, `am`, and `or` language keys.

  NFR-022  Dynamic content stored in the database shall store Amharic and
           Oromo translations in dedicated JSON-type columns (`amh`, `orm`)
           in the corresponding translation tables.

  NFR-023  When a translation does not exist in the database for the
           requested language, the System shall display the English
           version of the content without error.

================================================================================

================================================================================
SECTION 7 — DATABASE SCHEMA
================================================================================

7.1  Overview
─────────────────────────────────────────────────────────────────────────────

  The System uses a MySQL database hosted on Plesk's built-in database server.
  The schema comprises fourteen (14) tables organized across four logical
  domains:

  Domain                Tables
  ───────────────────── ──────────────────────────────────────────────────────
  Authentication        admins, admin_settings, users
  Content Management    news, news_translation, events, events_translation,
                        vacancies, vacancy_translation
  Citizen Interaction   applicants, complaints, contacts, service_satisfaction
  Auditing              activity_logs

7.2  Entity-Relationship Diagram
─────────────────────────────────────────────────────────────────────────────

  Notation: ──< denotes one-to-many; ──── denotes one-to-one;
            (FK) denotes foreign key; (PK) denotes primary key;
            (NULL) denotes nullable foreign key.

  AUTHENTICATION DOMAIN
  ──────────────────────────────────────────────────────────────────────

  ADMINS (admin_id PK)
    │
    ├──── ADMIN_SETTINGS (admin_id PK, FK → admins)      [1:1]
    │
    └───< ACTIVITY_LOGS (log_id PK, admin_id FK → admins) [1:N]

  USERS (id PK)
    │
    ├───< COMPLAINTS (complaint_id PK, user_id FK → users, NULL) [1:N optional]
    │
    └───< APPLICANTS (id PK, user_id FK → users, NULL)           [1:N optional]

  CONTENT MANAGEMENT DOMAIN
  ──────────────────────────────────────────────────────────────────────

  NEWS (id PK)
    └──── NEWS_TRANSLATION (id PK, news_id FK → news)    [1:1 optional]

  EVENTS (events_id PK)
    └──── EVENTS_TRANSLATION (id PK, event_id FK → events.events_id) [1:1 opt.]

  VACANCIES (id PK)
    ├──── VACANCY_TRANSLATION (id PK, vacancy_id FK → vacancies) [1:1 optional]
    └───< APPLICANTS (id PK, vacancy_id FK → vacancies)          [1:N]

  CITIZEN INTERACTION DOMAIN
  ──────────────────────────────────────────────────────────────────────

  CONTACTS      — standalone table, no foreign keys
  SERVICE_SATISFACTION — standalone table, no foreign keys

7.3  Key Relationships
─────────────────────────────────────────────────────────────────────────────

  Relationship                         Type        Notes
  ──────────────────────────────────── ─────────── ──────────────────────────
  admins → admin_settings              1:1         admin_id is PK and FK.
                                                   Row created on first
                                                   settings access.

  admins → activity_logs               1:N         Logs written on create,
                                                   update, delete actions.

  users → complaints                   1:N opt.    user_id is nullable.
                                                   Anonymous submissions
                                                   permitted.

  users → applicants                   1:N opt.    user_id is nullable.
                                                   Guest applications
                                                   permitted.

  news → news_translation              1:1 opt.    Translation row may be
                                                   absent; fall back to EN.

  events → events_translation          1:1 opt.    Note: PK column in events
                                                   is `events_id`; FK column
                                                   in events_translation is
                                                   `event_id`.

  vacancies → vacancy_translation      1:1 opt.    Translation row may be
                                                   absent; fall back to EN.

  vacancies → applicants               1:N         Cascade delete: deleting
                                                   a vacancy deletes all
                                                   associated applicants.

7.4  Class Diagram (Table Attribute Detail)
─────────────────────────────────────────────────────────────────────────────

  ┌─────────────────────────────────────┐
  │ admins                              │
  ├─────────────────────────────────────┤
  │ + admin_id       : VARCHAR  [PK]    │
  │ + first_name     : VARCHAR          │
  │ + last_name      : VARCHAR          │
  │ + username       : VARCHAR  [UNIQUE]│
  │ + email          : VARCHAR  [UNIQUE]│
  │ + password_hash  : VARCHAR          │
  │ + role           : ENUM(superadmin, │
  │                   admin,            │
  │                   complaint_admin,  │
  │                   event_admin,      │
  │                   news_admin,       │
  │                   vacancy_admin)    │
  │ + gender         : VARCHAR          │
  │ + residency      : VARCHAR          │
  │ + phone_number   : VARCHAR          │
  │ + photo          : VARCHAR          │
  │ + created_at     : TIMESTAMP        │
  └─────────────────────────────────────┘

  ┌─────────────────────────────────────┐
  │ admin_settings                      │
  ├─────────────────────────────────────┤
  │ + admin_id       : VARCHAR  [PK,FK] │
  │ + theme          : VARCHAR          │
  │ + font_size      : VARCHAR          │
  │ + language       : VARCHAR          │
  └─────────────────────────────────────┘

  ┌─────────────────────────────────────┐
  │ activity_logs                       │
  ├─────────────────────────────────────┤
  │ + log_id         : INT     [PK,AUTO]│
  │ + admin_id       : VARCHAR  [FK]    │
  │ + username       : VARCHAR          │
  │ + action         : VARCHAR          │
  │   (CREATED|UPDATED|DELETED)         │
  │ + entity_type    : VARCHAR          │
  │   (NEWS|EVENT|VACANCY|ADMIN|etc.)   │
  │ + entity_title   : VARCHAR          │
  │ + details        : JSON             │
  │ + created_at     : TIMESTAMP        │
  └─────────────────────────────────────┘

  ┌─────────────────────────────────────┐
  │ users                               │
  ├─────────────────────────────────────┤
  │ + id             : INT     [PK,AUTO]│
  │ + first_name     : VARCHAR          │
  │ + last_name      : VARCHAR          │
  │ + email          : VARCHAR  [UNIQUE]│
  │ + phone          : VARCHAR          │
  │ + password_hash  : VARCHAR          │
  │ + email_verified : BOOLEAN          │
  │ + created_at     : TIMESTAMP        │
  └─────────────────────────────────────┘

  ┌─────────────────────────────────────┐    ┌────────────────────────────────┐
  │ news                                │    │ news_translation               │
  ├─────────────────────────────────────┤    ├────────────────────────────────┤
  │ + id             : INT     [PK,AUTO]│────│ + id      : INT    [PK,AUTO]   │
  │ + title          : VARCHAR          │    │ + news_id : INT    [FK]        │
  │ + short_description : TEXT          │    │ + amh     : JSON               │
  │ + description    : TEXT             │    │   (title, short_description,   │
  │ + category       : VARCHAR          │    │    description, category)      │
  │ + photo          : JSON             │    │ + orm     : JSON               │
  │   ({path, name})                    │    │   (same structure)             │
  │ + created_at     : TIMESTAMP        │    └────────────────────────────────┘
  └─────────────────────────────────────┘

  ┌─────────────────────────────────────┐    ┌────────────────────────────────┐
  │ events                              │    │ events_translation             │
  ├─────────────────────────────────────┤    ├────────────────────────────────┤
  │ + events_id      : INT     [PK,AUTO]│────│ + id       : INT   [PK,AUTO]   │
  │ + title          : VARCHAR          │    │ + event_id : INT   [FK]        │
  │ + description    : TEXT             │    │   → events.events_id           │
  │ + location       : VARCHAR          │    │ + amh      : JSON              │
  │ + start_date     : DATE             │    │   (title, description,         │
  │ + end_date       : DATE             │    │    location)                   │
  │ + status         : VARCHAR          │    │ + orm      : JSON              │
  │   (upcoming|pending|complete|       │    │   (same structure)             │
  │    canceled)                        │    └────────────────────────────────┘
  │ + photos         : JSON             │
  │   ([{path, name}])                  │
  │ + created_at     : TIMESTAMP        │
  └─────────────────────────────────────┘

  ┌─────────────────────────────────────┐    ┌────────────────────────────────┐
  │ vacancies                           │    │ vacancy_translation            │
  ├─────────────────────────────────────┤    ├────────────────────────────────┤
  │ + id             : INT     [PK,AUTO]│────│ + id         : INT  [PK,AUTO]  │
  │ + title          : VARCHAR          │    │ + vacancy_id : INT  [FK]       │
  │ + short_description : TEXT          │    │ + amh        : JSON            │
  │ + description    : TEXT             │    │   (title, short_description,   │
  │ + location       : VARCHAR          │    │    description, category,      │
  │ + salary         : VARCHAR          │    │    skills[], responsibilities[]│
  │ + type           : VARCHAR          │    │    qualifications[])           │
  │ + category       : VARCHAR          │    │ + orm        : JSON            │
  │ + skills         : JSON  (array)    │    │   (same structure)             │
  │ + responsibilities : JSON (array)   │    └────────────────────────────────┘
  │ + qualifications : JSON  (array)    │
  │ + start_date     : DATE             │
  │ + end_date       : DATE             │
  │ + created_at     : TIMESTAMP        │
  └─────────────────────────────────────┘

  ┌─────────────────────────────────────┐
  │ applicants                          │
  ├─────────────────────────────────────┤
  │ + id             : INT     [PK,AUTO]│
  │ + vacancy_id     : INT      [FK]    │
  │ + user_id        : INT     [FK,NULL]│
  │ + first_name     : VARCHAR          │
  │ + last_name      : VARCHAR          │
  │ + email          : VARCHAR          │
  │ + phone          : VARCHAR          │
  │ + cv_path        : VARCHAR          │
  │ + status         : VARCHAR          │
  │   (submitted|reviewing|             │
  │    accepted|rejected)               │
  │ + created_at     : TIMESTAMP        │
  └─────────────────────────────────────┘

  ┌─────────────────────────────────────┐
  │ complaints                          │
  ├─────────────────────────────────────┤
  │ + complaint_id   : INT     [PK,AUTO]│
  │ + user_id        : INT     [FK,NULL]│
  │ + full_name      : VARCHAR          │
  │ + address        : VARCHAR          │
  │ + complaint_subcity : VARCHAR       │
  │ + complaint_woreda  : VARCHAR       │
  │ + type           : VARCHAR          │
  │ + status         : VARCHAR          │
  │   (assigning|in progress|           │
  │    resolved|canceled)               │
  │ + description    : TEXT             │
  │ + photos         : JSON             │
  │ + videos         : JSON             │
  │ + audios         : JSON             │
  │ + concerned_staff_member : VARCHAR  │
  │ + ref            : VARCHAR          │
  │   (format: CPL-XXXXX)              │
  │ + created_at     : TIMESTAMP        │
  └─────────────────────────────────────┘

  ┌─────────────────────────────────────┐
  │ contacts                            │
  ├─────────────────────────────────────┤
  │ + id             : INT     [PK,AUTO]│
  │ + first_name     : VARCHAR          │
  │ + last_name      : VARCHAR          │
  │ + email          : VARCHAR          │
  │ + description    : TEXT             │
  │ + photos         : JSON             │
  │ + status         : VARCHAR          │
  │   (pending|resolved)                │
  │ + created_at     : TIMESTAMP        │
  └─────────────────────────────────────┘

  ┌─────────────────────────────────────┐
  │ service_satisfaction                │
  ├─────────────────────────────────────┤
  │ + id                 : INT [PK,AUTO]│
  │ + gender             : VARCHAR      │
  │ + age                : VARCHAR      │
  │ + marital_status     : VARCHAR      │
  │ + education_level    : VARCHAR      │
  │ + employment_status  : VARCHAR      │
  │ + district           : VARCHAR      │
  │ + visits             : VARCHAR      │
  │ + service_requested  : JSON         │
  │ + q1 … q11           : VARCHAR      │
  │   (very_high|high|medium|           │
  │    low|very_low)                    │
  │ + additional_comments : TEXT        │
  │ + created_at         : TIMESTAMP    │
  └─────────────────────────────────────┘

================================================================================

================================================================================
SECTION 8 — API SPECIFICATION
================================================================================

8.1  Base URL and Conventions
─────────────────────────────────────────────────────────────────────────────

  Environment     Base URL
  ──────────────  ──────────────────────────────────────────────────────────
  Production      https://lidetasubcity.gov.et
  Development     http://localhost:3000
                  (Vite dev server at :5173 proxies /api, /auth, /uploads)

  All API endpoints are prefixed with `/api/` with the exception of
  authentication endpoints which additionally accept the `/auth/` prefix
  (both prefixes are served by the same router).

  Request bodies: `application/json` unless stated otherwise.
  Response bodies: `application/json` in all cases.
  Timestamps: ISO 8601 format strings.
  Successful responses: HTTP 2xx with JSON body.
  Error responses: HTTP 4xx/5xx with body `{ "error": "description" }`.

  Authentication header:
    Authorization: Bearer <jwt_token>

8.2  Authentication Endpoints  (/auth/  or  /api/auth/)
─────────────────────────────────────────────────────────────────────────────

  POST  /auth/admin/login
  ──────────────────────
  Authenticates an administrator by username and password.

  Request Body:
    { "username": "string", "password": "string" }

  Response 200:
    { "requires2FA": false, "token": "jwt_string",
      "admin": { "admin_id": "...", "username": "...", "role": "...",
                 "email": "...", "first_name": "...", "last_name": "..." },
      "role": "string" }

  Response 401:  { "error": "Invalid username or password" }

  ──────────────────────────────────────────────────────────────────────────
  POST  /auth/admin/email-lookup
  ──────────────────────────────
  Returns the email address associated with a given admin username.
  Used as a pre-step in 2FA OTP flows.

  Request Body:   { "username": "string" }
  Response 200:   { "email": "string" }
  Response 404:   { "error": "Admin not found" }

  ──────────────────────────────────────────────────────────────────────────
  POST  /auth/admin/me
  ────────────────────
  Returns the profile of the currently authenticated admin.
  Requires:  Authorization: Bearer <admin_jwt>

  Response 200:   Admin object (all fields except password_hash)
  Response 401:   { "error": "No token provided" | "Invalid token" |
                             "Token expired" }

  ──────────────────────────────────────────────────────────────────────────
  POST  /api/auth/user/login
  ──────────────────────────
  Authenticates a citizen user by email and password.

  Request Body:   { "email": "string", "password": "string" }
  Response 200:   { "requires2FA": false, "token": "jwt_string",
                    "user": { "id": ..., "first_name": "...", ... } }
  Response 401:   { "error": "Invalid credentials" }

  ──────────────────────────────────────────────────────────────────────────
  POST  /api/auth/user/register
  ─────────────────────────────
  Registers a new citizen account and initiates email verification.

  Request Body:
    { "first_name": "string", "last_name": "string", "email": "string",
      "phone": "string (optional)", "password": "string" }

  Response 201:
    { "user": { ... }, "token": "jwt_string", "requiresVerification": true }

  Response 400:   { "error": "Email already registered" | validation error }

  ──────────────────────────────────────────────────────────────────────────
  POST  /api/auth/verify-otp
  ──────────────────────────
  Verifies a 6-digit OTP for admin 2FA login or citizen email verification.

  Request Body:
    { "email": "string", "otp": "string", "entityType": "admin|user" }

  Response 200:
    { "token": "jwt_string", "admin": { ... } }  — for entityType "admin"
    { "token": "jwt_string", "user": { ... } }   — for entityType "user"

  Response 400:   { "error": "Invalid or expired OTP" }

  ──────────────────────────────────────────────────────────────────────────
  POST  /api/auth/resend-otp
  ──────────────────────────
  Resends the OTP email. Rate-limited: 5 attempts per 10-minute window
  per email address.

  Request Body:
    { "email": "string", "entityType": "admin|user",
      "purpose": "2fa_login|verify_email|reset_password" }

  Response 200:   { "message": "OTP sent" }
  Response 429:   { "error": "Too many requests. Try again later." }

  ──────────────────────────────────────────────────────────────────────────
  POST  /api/auth/send-verification
  ──────────────────────────────────
  Sends email verification OTP to the currently authenticated citizen.
  Requires:  Authorization: Bearer <user_jwt>

  Response 200:   { "message": "Verification email sent" }

  ──────────────────────────────────────────────────────────────────────────
  POST  /api/auth/verify-email
  ─────────────────────────────
  Verifies the citizen's email address using the OTP.
  Requires:  Authorization: Bearer <user_jwt>

  Request Body:   { "otp": "string" }
  Response 200:   { "message": "Email verified successfully" }
  Response 400:   { "error": "Invalid OTP" }

  ──────────────────────────────────────────────────────────────────────────
  POST  /api/auth/forgot-password
  ────────────────────────────────
  Initiates password reset by sending an OTP to the given email address.
  Always returns HTTP 200 to prevent user enumeration.

  Request Body:   { "email": "string", "entityType": "admin|user" }
  Response 200:   { "message": "If this email exists, a reset code was sent" }

  ──────────────────────────────────────────────────────────────────────────
  POST  /api/auth/reset-password
  ───────────────────────────────
  Resets the account password after successful OTP verification.

  Request Body:
    { "email": "string", "otp": "string",
      "newPassword": "string", "entityType": "admin|user" }

  Response 200:   { "message": "Password reset successfully" }
  Response 400:   { "error": "Invalid or expired OTP" }

8.3  User Endpoints  (/api/user/)
─────────────────────────────────────────────────────────────────────────────

  All endpoints require:  Authorization: Bearer <citizen_jwt>

  GET   /api/user/me
  ──────────────────
  Returns the authenticated citizen's profile.
  Response 200:  { "id": ..., "first_name": "...", "last_name": "...",
                   "email": "...", "phone": "..." }

  GET   /api/user/dashboard
  ──────────────────────────
  Returns the citizen's complaints and job applications.
  Response 200:
    { "complaints": [ { complaint fields + status } ],
      "applications": [ { applicant fields + vacancy title } ] }

  PATCH  /api/user/profile
  ─────────────────────────
  Updates the citizen's profile information and optionally changes password.
  Request Body:
    { "first_name": "string", "last_name": "string", "phone": "string",
      "currentPassword": "string (if changing password)",
      "newPassword": "string (if changing password)" }
  Response 200:  Updated user object.

8.4  Admin Endpoints  (/api/admin/)
─────────────────────────────────────────────────────────────────────────────

  All endpoints require:  Authorization: Bearer <admin_jwt>

  Method  Path                           Description
  ──────  ─────────────────────────────  ──────────────────────────────────────
  POST    /update/profile-picture        multipart/form-data; field:
                                         "profile_picture". Returns admin obj.

  DELETE  /delete/profile-picture        Removes profile picture (sets NULL).

  GET     /activities                    Returns last 20 activity log entries.

  POST    /update/profile                Updates personal info.
                                         Body: { first_name, last_name, gender,
                                         residency, phone_number, email }

  POST    /update/admin-info             Updates username. Only superadmin may
                                         change role field.

  POST    /update/password               Changes password.
                                         Body: { currentPassword, newPassword }
                                         Requires current password verification.

  GET     /settings                      Returns admin UI settings. Creates
                                         default row if none exists.

  POST    /update/settings               Upserts UI settings.
                                         Body: { theme, font_size, language }

  POST    /upload                        Generic file upload (multipart).
                                         Returns: { name, path, size, mimetype }

  POST    /create-peer                   Creates an admin with the same role
                                         as the caller.

8.5  Superadmin Endpoints  (/api/superadmin/)
─────────────────────────────────────────────────────────────────────────────

  All endpoints require:  Authorization: Bearer <superadmin_jwt>
  Non-superadmin tokens receive:  HTTP 403 Forbidden

  Method  Path                      Description
  ──────  ────────────────────────  ──────────────────────────────────────────
  GET     /admins                   All admin accounts (no password_hash).

  POST    /create-admin             Create admin with chosen role.
                                    Body: all admin fields + role.
                                    Sends verification email to new admin.

  POST    /update-admin/:id         Update admin fields; role must be valid.

  DELETE  /delete-admin/:id         Delete admin. Cannot delete own account.

  GET     /overview                 { totalComplaints, resolvedComplaints,
                                      pendingApplications, activeEvents }

  GET     /vacancy-applications     All applicants with vacancy info and
                                    aggregated category statistics.

8.6  News Endpoints  (/api/news/)
─────────────────────────────────────────────────────────────────────────────

  GET   /api/news                   (No auth required)
  ──────────────────────────────────────────────────────────────────────────
  Returns all published news articles with translations and formatted dates.

  Response 200 — Array of news objects:
  [
    { "id": 1, "title": "...", "short_description": "...",
      "description": "...", "category": "...",
      "photo": { "path": "/uploads/photos/...", "name": "..." },
      "formatted_date": "Jan 01, 2026",
      "created_at": "2026-01-01T00:00:00.000Z",
      "amh": { "title": "...", "short_description": "...",
               "description": "...", "category": "..." },
      "orm": { "title": "...", "short_description": "...",
               "description": "...", "category": "..." } }
  ]

  GET   /api/news/admin             (Requires admin JWT)
  ──────────────────────────────────────────────────────────────────────────
  Same response as public GET.

  POST  /api/news/admin             (Requires admin JWT)
  ──────────────────────────────────────────────────────────────────────────
  Creates a news article. Optionally creates translation row.

  Request Body:
  { "title": "string", "description": "string", "category": "string",
    "shortDescription": "string",
    "photo": { "path": "string", "name": "string" },
    "amh": { "title": "...", "short_description": "...",
             "description": "...", "category": "..." },
    "orm": { "title": "...", "short_description": "...",
             "description": "...", "category": "..." } }

  Response 201:  Created news object.

  PUT   /api/news/admin             (Requires admin JWT)
  ──────────────────────────────────────────────────────────────────────────
  Updates existing news article. Same body as POST with addition of `id`.
  Diffs changed fields and writes to activity log.
  Response 200:  Updated news object.

  DELETE  /api/news/admin/:id       (Requires admin JWT)
  ──────────────────────────────────────────────────────────────────────────
  Deletes news article and associated translation row.
  Response 200:  { "message": "News deleted successfully" }

8.7  Events Endpoints  (/api/events/)
─────────────────────────────────────────────────────────────────────────────

  Method  Path             Auth        Description
  ──────  ───────────────  ──────────  ────────────────────────────────────────
  GET     /               None        All events, translations, formatted date.
  GET     /admin          Admin JWT   Same as public GET.
  POST    /admin          Admin JWT   Create event (body wrapped in formData).
  PUT     /admin          Admin JWT   Update event (body wrapped in formData).
  DELETE  /admin/:id      Admin JWT   Delete event and translation.

  Event object:
  { "events_id": 1, "title": "...", "description": "...",
    "location": "...", "start_date": "YYYY-MM-DD", "end_date": "YYYY-MM-DD",
    "status": "upcoming|pending|complete|canceled",
    "photos": [ { "path": "...", "name": "..." } ],
    "start_date_short": "Mon. Jan, 01 2026",
    "amh": { "title": "...", "description": "...", "location": "..." },
    "orm": { "title": "...", "description": "...", "location": "..." } }

8.8  Vacancies Endpoints  (/api/vacancies/)
─────────────────────────────────────────────────────────────────────────────

  Method  Path                          Auth          Description
  ──────  ────────────────────────────  ────────────  ──────────────────────────
  GET     /                             None          All vacancies + translation
  POST    /upload-cv                    None          Upload PDF. Returns {path}
  POST    /applicants                   None          Submit application.
                                                      Returns {ref: APP-XXXXX}
  GET     /admin                        Admin JWT     All vacancies (admin view)
  POST    /admin                        Admin JWT     Create vacancy
  PUT     /admin                        Admin JWT     Update vacancy
  DELETE  /admin/:id                    Admin JWT     Delete vacancy + applicants
  GET     /applicants/admin             Admin JWT     All applicants
  GET     /applicants/admin/:id         Admin JWT     Single applicant
  PUT     /applicants/admin/:id         Admin JWT     Update applicant status/CV

8.9  Complaints Endpoints  (/api/complaints/)
─────────────────────────────────────────────────────────────────────────────

  Method  Path              Auth        Description
  ──────  ────────────────  ──────────  ────────────────────────────────────────
  POST    /                 None        Submit complaint. Returns {ref:CPL-XXXXX}
  GET     /types            None        List of complaint type strings.
  GET     /admin            Admin JWT   All complaints + counts + stats.
  POST    /admin            Admin JWT   Admin creates complaint record.
  POST    /admin/update     Admin JWT   Update complaint (status, notes, etc.)
  DELETE  /admin/:id        Admin JWT   Delete complaint by complaint_id.

8.10  Contacts Endpoints  (/api/contacts/)
─────────────────────────────────────────────────────────────────────────────

  Method  Path                          Auth        Description
  ──────  ────────────────────────────  ──────────  ──────────────────────────
  POST    /                             None        Submit contact message.
  POST    /satisfaction                 None        Submit satisfaction survey.
  GET     /admin                        Admin JWT   Pending contact messages.
  PUT     /admin/:id/resolve            Admin JWT   Mark contact resolved.
  GET     /satisfaction/stats           Admin JWT   30-day stats: averages +
                                                    daily response counts.

8.11  Static File Endpoints
─────────────────────────────────────────────────────────────────────────────

  Path Pattern                      Description                   Auth Required
  ────────────────────────────────  ────────────────────────────  ─────────────
  GET /uploads/photos/*             Content images                No
  GET /uploads/videos/*             Complaint video attachments   No
  GET /uploads/audios/*             Complaint audio recordings    No
  GET /uploads/cvs/*                Applicant CV files (PII)      No
  GET /uploads/admin_profiles/*     Admin profile photographs     No
  GET /health                       Server health check           No

  SECURITY NOTE: All files under /uploads/ are publicly accessible by
  direct URL with no authentication requirement. This is documented as a
  known limitation in Appendix G (item: CV file access).

================================================================================

================================================================================
SECTION 9 — REAL-TIME COMMUNICATION
================================================================================

9.1  Current Implementation
─────────────────────────────────────────────────────────────────────────────

  The System does not implement any real-time communication mechanism in
  the current version (v1.0.0). All communication between client and server
  is strictly request-response over HTTP/HTTPS using the REST API defined
  in Section 8.

  The following technologies are confirmed absent from the codebase:

  - WebSocket connections (no ws, socket.io, or native WebSocket server)
  - Server-Sent Events (SSE)
  - HTTP long-polling
  - Push notification services (Firebase Cloud Messaging, Pusher, etc.)

  GUIDANCE FOR PENETRATION TESTERS:

  There are no WebSocket upgrade handshake paths in this system. No
  `Upgrade: websocket` header handling is implemented. Penetration testing
  should not expect or test for WebSocket endpoints. All `/api/*` and
  `/auth/*` paths are standard HTTP/HTTPS endpoints operating under the
  conventional request-response model.

9.2  Future Considerations
─────────────────────────────────────────────────────────────────────────────

  The following real-time features are under consideration for future
  releases. They are documented here to inform future security reviews.

  (a) Complaint status push notifications — Notify a citizen in real time
      when the status of their submitted complaint changes, without
      requiring a manual page refresh.

  (b) Admin live notification feed — Alert admin staff of new complaint
      submissions or new contact messages in real time.

  Proposed technology: Socket.io (WebSocket with HTTP long-poll fallback),
  integrated into the existing Express server.

  Security considerations that SHALL apply if real-time features are added:

  (i)   WebSocket handshake connections shall require JWT-based
        authentication at connection time.

  (ii)  Per-connection rate limiting shall be enforced to prevent
        denial-of-service via connection flooding.

  (iii) All message payloads received via WebSocket shall be validated
        and sanitized identically to REST API inputs.

  (iv)  Cross-Site WebSocket Hijacking (CSWSH) protections shall be
        implemented by validating the `Origin` header on WebSocket
        upgrade requests against the CORS whitelist.

================================================================================

================================================================================
SECTION 10 — SECURITY REQUIREMENTS
================================================================================

  Requirements in this section are identified by the prefix "SR-".

10.1  Authentication Security
─────────────────────────────────────────────────────────────────────────────

  SR-001  All administrator and citizen passwords shall be hashed using
          bcryptjs with a minimum work factor (salt rounds) of 10 before
          storage. Plaintext passwords shall never be stored or logged.

  SR-002  JWT tokens shall be signed using the HMAC-SHA256 (HS256) algorithm
          with a secret value of at least 256 bits of cryptographic
          randomness, stored in the `JWT_SECRET` environment variable. This
          secret shall never be committed to version control.

  SR-003  Administrator JWTs shall expire after seven (7) days. Citizen
          JWTs shall expire after thirty (30) days.

  SR-004  Token verification middleware (authenticateToken, authenticateUser)
          shall explicitly reject tokens that are expired, malformed, issued
          with an unrecognized subject identifier, or signed with a different
          secret. All rejected token cases shall return HTTP 401.

  SR-005  The password reset endpoint (`POST /api/auth/forgot-password`) shall
          return HTTP 200 with a generic message regardless of whether the
          provided email address exists in the system. This prevents user
          enumeration via the password reset flow.

  SR-006  OTP codes used for email verification and password reset are
          6-digit numeric values generated and verified by the OTP email service
          Authentication. OTP codes are single-use; once verified they
          cannot be reused.

  SR-007  OTP resend operations shall be rate-limited server-side to a
          maximum of five (5) attempts per ten (10) minute sliding window
          per email address. Excess requests shall receive HTTP 429.

10.2  Password Policy
─────────────────────────────────────────────────────────────────────────────

  SR-008  All passwords set in the System (citizen registration, admin
          account creation, password change, password reset) shall satisfy
          all of the following requirements:

          (a) Minimum length: 8 characters.
          (b) At least one uppercase letter (A–Z).
          (c) At least one lowercase letter (a–z).
          (d) At least one digit (0–9).
          (e) At least one special character (non-alphanumeric).

  SR-009  Password strength validation shall be enforced on the server
          side before the hash is computed and stored. Client-side strength
          visualization (strength bar) is a user experience enhancement
          only and does not constitute a security control.

10.3  Transport Security
─────────────────────────────────────────────────────────────────────────────

  SR-010  All communication between client browsers and the server in the
          production environment shall occur exclusively over HTTPS/TLS.
          Plain HTTP requests shall be redirected to HTTPS by the Plesk
          web server layer.

  SR-011  The TLS certificate for the production domain shall be a valid
          certificate issued by a trusted Certificate Authority (Let's
          Encrypt via Plesk). Self-signed certificates are not permitted
          in production.

  SR-012  The database connection uses SSL/TLS. The current configuration
          uses `rejectUnauthorized: false`. For a fully hardened production
          deployment, full certificate validation should be enabled.

  SR-013  the cloud OTP email service API calls use HTTPS by default. The the cloud OTP email service client
          is configured with `autoRefreshToken: false` and
          `persistSession: false` to minimize session state exposure.

10.4  Input Validation and Injection Prevention
─────────────────────────────────────────────────────────────────────────────

  SR-014  All database queries shall use the parameterized query mechanism
          provided by the `postgres` tagged template literal driver. No
          string concatenation or interpolation shall be used to construct
          SQL queries. This prevents SQL injection at the driver level.

  SR-015  All file uploads shall be validated for MIME type. Accepted types
          are: image/*, video/*, audio/*, application/pdf, application/msword,
          application/vnd.openxmlformats-officedocument.wordprocessingml.document.
          Files with any other MIME type shall be rejected.

  SR-016  CV file uploads at `POST /api/vacancies/upload-cv` shall be
          additionally restricted to `application/pdf` only.

  SR-017  Upload file size shall be limited to 50 megabytes per file.
          Files exceeding this limit shall be rejected by Multer before
          the request handler executes.

  SR-018  Uploaded filenames shall be sanitized by replacing all
          non-alphanumeric characters with underscores and appending a
          timestamp and 9-digit random suffix. This prevents path traversal
          attacks and filename collision.

  SR-019  Ethiopian phone number inputs shall be validated against the
          regular expression `/^(\+251(9|7)\d{8}|0(9|7)\d{8})$/` on both
          the client side (UX) and the server side (security enforcement).

10.5  CORS Policy
─────────────────────────────────────────────────────────────────────────────

  SR-020  The CORS policy shall permit requests only from the following
          origins:

          (a) http://localhost:5173  (development only)
          (b) http://localhost:3000  (development only)
          (c) https://lideta-official.vercel.app
          (d) https://lidetasubcity.gov.et
          (e) https://www.lidetasubcity.gov.et
          (f) Any origin matching *.run.app (Google Cloud Run)
          (g) Any origin matching *.googleusercontent.com
          (h) The value of the CLIENT_ORIGIN environment variable

  SR-021  Requests from origins not matching any of the above criteria
          shall receive a CORS error response and the request shall not
          be processed.

  SR-022  The CORS configuration shall include `credentials: true`,
          permitting the `Authorization` header and cookies from whitelisted
          origins.

10.6  File Upload Security
─────────────────────────────────────────────────────────────────────────────

  SR-023  All uploaded files are stored under `client/public/uploads/` and
          are served as publicly accessible static files via `GET /uploads/*`.
          No authentication is required to access any uploaded file by its
          direct URL.

  SR-024  CV files containing applicant PII are stored at
          `/uploads/cvs/<applicant_id>.<ext>` and are accessible publicly
          by direct URL. This is identified as a known limitation (see
          Appendix G). Restricting CV access to authenticated admin users
          is recommended for a future security hardening iteration.

  SR-025  Uploaded filenames include a timestamp and random suffix to reduce
          the predictability of URLs, but this is not a substitute for
          access control.

  SR-026  No server-side executable file types (.js, .php, .sh, .py, .exe,
          .bat) are permitted by the Multer file filter. Uploads of these
          types shall be rejected.

10.7  Session and Token Security
─────────────────────────────────────────────────────────────────────────────

  SR-027  Both admin JWTs (key: "token") and citizen JWTs (key: "userToken")
          are stored in the browser's `localStorage`. This storage mechanism
          is accessible to any JavaScript executing on the same origin, making
          the tokens susceptible to theft via Cross-Site Scripting (XSS)
          attacks.

          NOTE FOR SECURITY AUDITORS: Any XSS vulnerability in the client
          application would allow token exfiltration. Migrating to HttpOnly,
          SameSite=Strict cookies is the recommended remediation for a future
          hardening iteration.

  SR-028  No token revocation mechanism (blocklist or token invalidation
          table) is implemented. Token invalidation relies solely on
          expiry (7 days for admins, 30 days for citizens).

          NOTE FOR SECURITY AUDITORS: Compromised tokens remain valid until
          expiry. In the event of a credential compromise, the JWT_SECRET
          must be rotated to invalidate all outstanding tokens.

10.8  Activity Logging
─────────────────────────────────────────────────────────────────────────────

  SR-029  All create, update, and delete operations performed by
          authenticated admin accounts shall be recorded in the
          `activity_logs` table. Each log entry shall include: admin_id,
          username, action type (CREATED|UPDATED|DELETED), entity type,
          entity title, a JSON diff of changed fields, and a timestamp.

  SR-030  The activity log has no delete endpoint exposed via the API.
          Log entries can only be appended, not modified or removed through
          normal application flows.

10.9  Data Flow Security Diagram (DFD Level 1)
─────────────────────────────────────────────────────────────────────────────

  External                  Processes                     Data Stores
  Entities
  ─────────────             ──────────────                ─────────────────────

  [Citizen      ]──(1)───▶ [1.0 Register             ]──(2)──▶ [users table    ]
  [Browser      ]          [    + Login + OTP verify  ]──(3)──▶ [the cloud OTP email service Auth  ]

  [Citizen      ]──(4)───▶ [2.0 Complaint Submission  ]──(5)──▶ [complaints     ]
  [Browser      ]          [    + Media Attach         ]──(6)──▶ [/uploads/      ]
                                                                  [media files   ]

  [Citizen      ]──(7)───▶ [3.0 CV Upload             ]──(8)──▶ [/uploads/cvs/  ]
  [Browser      ]          [    + Job Application      ]──(9)──▶ [applicants     ]

  [Admin        ]──(10)──▶ [4.0 Admin Auth            ]──(11)─▶ [admins table   ]
  [Browser      ]          [    + JWT Issuance         ]

  [Admin        ]──(12)──▶ [5.0 Content CRUD          ]──(13)─▶ [news / events  ]
  [Browser      ]          [    (News/Events/Vacancies)]──(14)─▶ [/uploads/      ]
                                                        ──(15)─▶ [*_translation  ]

  [Admin        ]──(16)──▶ [6.0 Complaint Mgmt.       ]──(17)─▶ [complaints     ]
  [Browser      ]

  [SuperAdmin   ]──(18)──▶ [7.0 Admin Account Mgmt.   ]──(19)─▶ [admins table   ]
  [Browser      ]                                       ──(20)─▶ [activity_logs  ]

  Data Flows of Security Interest:

  Flow (1)   HTTPS POST with credentials — must be TLS-protected.
  Flow (3)   OTP via the cloud OTP email service — external service dependency.
  Flow (6)   Media stored as public static files — no access control.
  Flow (8)   CV files (PII) stored as public static files.
  Flow (10)  Admin credentials transmitted — must be TLS-protected.
  Flow (12)  Admin content mutations — all logged via flow (20).
  Flow (20)  Activity log integrity — critical for audit trail.

================================================================================

================================================================================
SECTION 11 — DEPLOYMENT ARCHITECTURE
================================================================================

11.1  Production Environment
─────────────────────────────────────────────────────────────────────────────

  The System is deployed on EthioTelecom shared web hosting running Plesk
  Obsidian, using the Phusion Passenger Node.js application server module.
  TLS termination is handled by the Plesk Apache/Nginx layer.

  ┌──────────────────────────────────────────────────────────────────────┐
  │                     EthioTelecom Data Centre                         │
  │  ┌────────────────────────────────────────────────────────────────┐  │
  │  │                  Plesk Obsidian Panel                          │  │
  │  │                                                                │  │
  │  │  ┌──────────────────────────────────────────────────────────┐ │  │
  │  │  │  Apache / Nginx (Plesk managed)                          │ │  │
  │  │  │  HTTPS termination (Let's Encrypt TLS)                   │ │  │
  │  │  │  Domain: lidetasubcity.gov.et                            │ │  │
  │  │  │  Document Root: /client/dist                             │ │  │
  │  │  │  Application Root: / (project root)                      │ │  │
  │  │  │  Startup File: app.js                                    │ │  │
  │  │  └─────────────────────┬────────────────────────────────────┘ │  │
  │  │                        │ Phusion Passenger                     │  │
  │  │  ┌─────────────────────▼────────────────────────────────────┐ │  │
  │  │  │  Node.js v18+ Process  (Express.js v5, ESM)              │ │  │
  │  │  │  Responsibilities:                                        │ │  │
  │  │  │  - Serve React SPA (client/dist static files)            │ │  │
  │  │  │  - Handle REST API (/api/*, /auth/*)                     │ │  │
  │  │  │  - Serve uploaded files (/uploads/*)                     │ │  │
  │  │  └─────────────────────┬────────────────────────────────────┘ │  │
  │  │                        │  TCP / local socket                   │  │
  │  │  ┌─────────────────────▼────────────────────────────────────┐ │  │
  │  │  │  MySQL Database (Plesk built-in)                         │ │  │
  │  │  │  All application data (14 tables)                        │ │  │
  │  │  └──────────────────────────────────────────────────────────┘ │  │
  │  │                                                                │  │
  │  │  Filesystem: client/public/uploads/ (persistent storage)      │  │
  │  └────────────────────────────────────────────────────────────────┘  │
  └──────────────────────────────┬───────────────────────────────────────┘
                                 │  HTTPS (OTP only)
                       ┌─────────▼──────────────┐
                       │  Cloud OTP Service         │
                       │  (OTP Email Delivery)     │
                       └─────────────────────────┘

11.2  Plesk Configuration
─────────────────────────────────────────────────────────────────────────────

  Setting                  Value
  ──────────────────────── ─────────────────────────────────────────────────
  Application Type         Node.js (Phusion Passenger)
  Application Root         /  (project root directory)
  Document Root            /client/dist
  Startup File             app.js
  Node.js Version          18.x or later
  Application Mode         Production
  Environment Variables    Configured via Plesk Node.js application panel:
                           DATABASE_URL, JWT_SECRET, SERVER_PORT,
                           OTP_SERVICE_URL=https://<otp-service-endpoint>
                           CLIENT_ORIGIN, NODE_ENV=production

  The file `app.js` at the project root contains a single ESM import
  statement that starts the Express server:

    import './server/server.js';

  This indirection is required because Phusion Passenger requires the
  startup file to be at a configurable path.

11.3  URL Routing in Production
─────────────────────────────────────────────────────────────────────────────

  Plesk's web server proxies all incoming requests to the Node.js Passenger
  process. Express then applies internal routing:

  Request Pattern          Handler
  ──────────────────────── ───────────────────────────────────────────────
  /api/*                   Express API route handlers
  /auth/*                  Express authentication route handlers
  /uploads/*               Express static file middleware → filesystem
  /health                  Express health check handler
  All other paths          SPA fallback → client/dist/index.html

11.4  Static File Serving
─────────────────────────────────────────────────────────────────────────────

  The React SPA is built by executing the following command from the project
  root prior to deployment:

    npm run build:client

  This runs `vite build` within the `client/` directory. The output is
  placed in `client/dist/`. Express serves this directory via
  `express.static(distPath)` registered before API routes.

  User-uploaded files are stored persistently at `client/public/uploads/`
  and served via a dedicated static middleware:
  `app.use('/uploads', express.static(uploadBasePath))`

11.5  TLS / HTTPS
─────────────────────────────────────────────────────────────────────────────

  TLS termination is performed by Plesk's Apache/Nginx web server layer
  using Let's Encrypt certificates managed automatically by Plesk. The
  Node.js application process does not handle TLS directly.

  All HTTP traffic is redirected to HTTPS at the web server layer.
  The Node.js process receives only already-decrypted requests forwarded
  by Passenger.

11.6  Environment Variables
─────────────────────────────────────────────────────────────────────────────

  Variable            Required    Description
  ──────────────────  ──────────  ────────────────────────────────────────────
  DATABASE_URL        Yes         Full MySQL connection string.
  JWT_SECRET          Yes         HS256 signing secret (min. 256-bit random).
  SERVER_PORT         Yes         Port number assigned by Plesk/Passenger.
  OTP_SERVICE_URL=https://<otp-service-endpoint>
  OTP_SERVICE_KEY=<otp-service-api-key>
  CLIENT_ORIGIN       Recommended Additional CORS-allowed origin URL.
  NODE_ENV            Recommended Set to "production" in live environment.

  Client-side build variable (set at build time, not runtime):
  VITE_API_URL        Optional    API base URL. Defaults to '' (same origin).

11.7  Development Environment
─────────────────────────────────────────────────────────────────────────────

  In local development, the system uses a two-process setup:

  Process               Command                   Port
  ────────────────────  ────────────────────────  ──────
  Express API server    npm run dev (root)         3000
  React Vite dev server npm run dev (client/)      5173

  The Vite development server is configured to proxy the following
  path prefixes to `http://localhost:3000`:

    /api, /auth, /uploads

  This allows the React SPA served at port 5173 to call API endpoints
  without triggering CORS errors during development. In production there
  is no Vite dev server; Express serves the compiled SPA directly.

  Development fallback: If `DATABASE_URL` is not set, the server starts
  with an in-memory mock database seeded from the static JSON files in
  `client/src/data/`. In mock mode, all admin accounts use the password
  `admin123`.

================================================================================

================================================================================
SECTION 12 — APPENDICES
================================================================================

APPENDIX A — TECHNOLOGY STACK SUMMARY
──────────────────────────────────────────────────────────────────────────────

  Layer                    Technology                       Version
  ───────────────────────  ───────────────────────────────  ─────────────
  Front-End Framework      React                            19.2.0
  Front-End Build Tool     Vite                             7.2.4
  Front-End Routing        React Router                     7.9.6
  CSS Framework            Tailwind CSS                     4.1.17
  Animation Library        Framer Motion                    13.1.0
  Chart Library            Recharts                         3.5.1
  Icon System              SVG via vite-plugin-svgr         4.5.0
  UI Components            Lucide React                     0.561.0
  Back-End Framework       Express.js                       5.2.1
  Runtime                  Node.js                          18+
  Module System            ECMAScript Modules (ESM)         —
  Database                 MySQL (Plesk built-in)           —
  DB Query Driver          postgres (tagged template)       3.4.7
  Authentication           jsonwebtoken                     9.0.3
  Password Hashing         bcryptjs                         3.0.3
  File Upload Handling     Multer                           2.0.2
  OTP / Email              the cloud OTP email service JS Client               2.110.0
  CORS Handling            cors (npm)                       2.8.5
  Environment Config       dotenv                           17.2.3
  Deployment Platform      Plesk / Phusion Passenger        —
  TLS Certificates         Let's Encrypt (via Plesk)        —

──────────────────────────────────────────────────────────────────────────────
APPENDIX B — COMPLETE CLIENT ROUTE TREE
──────────────────────────────────────────────────────────────────────────────

  PUBLIC ROUTES  (layout: <Home /> — Navbar + Outlet + Footer)
  ─────────────────────────────────────────────────────────────
  /                           →  HomePage
  /about_us                   →  AboutUs
  /departments                →  Departments
  /departments/:id            →  DepartmentDetails
  /news                       →  News
  /news/:id                   →  NewsDetails
  /events                     →  Events
  /events/:id                 →  EventDetails
  /vacancy                    →  Vacancy  (canonical)
  /vaccancy                   →  redirect → /vacancy
  /vacancy/:id                →  VacancyDetails
  /vaccancy/:id               →  VacancyDetails  (legacy compat)
  /complaints                 →  Complaints  (canonical)
  /compliants                 →  redirect → /complaints
  /contacts                   →  Contacts

  CITIZEN AUTH  (no layout shell)
  ────────────────────────────────
  /account/auth               →  UserAuth
                                  (login / register / OTP / forgot-password)
  /account                    →  UserDashboard

  ADMIN AUTH  (no layout shell)
  ──────────────────────────────
  /auth/login                 →  Login  (admin only)

  ADMIN PANEL  (layout: <Admin /> — provides adminContext)
  ─────────────────────────────────────────────────────────
  /admin                      →  AdminHome
                                  [RoleGuard: admin]
  /admin/complaints           →  AdminComplaints
                                  [RoleGuard: admin, complaint_admin]
  /admin/compliants           →  redirect → /admin/complaints
  /admin/events               →  AdminEvent
                                  [RoleGuard: admin, event_admin]
  /admin/news                 →  AdminNews
                                  [RoleGuard: admin, news_admin]
  /admin/vacancy              →  AdminVacancy
                                  [RoleGuard: admin, vacancy_admin]
  /admin/profile              →  AdminProfile
                                  [RoleGuard: all admin roles]

  SUPERADMIN PANEL  (layout: <SuperAdminLayout />)
  ──────────────────────────────────────────────────
  /superadmin                 →  redirect → /superadmin/home
  /superadmin/home            →  SuperAdminHome
  /superadmin/profile         →  SuperAdminProfile

──────────────────────────────────────────────────────────────────────────────
APPENDIX C — FILE UPLOAD PATHS
──────────────────────────────────────────────────────────────────────────────

  Upload Type           Field Name        Storage Path                  Public URL
  ────────────────────  ────────────────  ────────────────────────────  ──────────────────────────────
  News/Event photos     photo / image     uploads/photos/               /uploads/photos/<filename>
  Complaint photos      photo             uploads/photos/               /uploads/photos/<filename>
  Complaint videos      video             uploads/videos/               /uploads/videos/<filename>
  Complaint audio       audio             uploads/audios/               /uploads/audios/<filename>
  Admin profile pics    profile_picture   uploads/admin_profiles/       /uploads/admin_profiles/<file>
  Applicant CVs         cv                uploads/cvs/                  /uploads/cvs/<applicant_id>.pdf

  All paths are relative to `client/public/`.
  All files are publicly accessible without authentication.
  Filename format:  <sanitized_name>-<timestamp>-<9_digit_random>.<ext>
  CV files are renamed post-insertion to:  <applicant_db_id>.<ext>

──────────────────────────────────────────────────────────────────────────────
APPENDIX D — ENVIRONMENT VARIABLE REFERENCE
──────────────────────────────────────────────────────────────────────────────

  # Database
  DATABASE_URL=mysql://user:password@localhost:3306/lideta_db

  # Authentication
  JWT_SECRET=<minimum-256-bit-cryptographically-random-string>

  # Server Runtime
  SERVER_PORT=<port-assigned-by-plesk>
  NODE_ENV=production

  # OTP Email Service
  OTP_SERVICE_URL=https://<otp-service-endpoint>
  OTP_SERVICE_KEY=<otp-service-api-key>

  # CORS
  CLIENT_ORIGIN=https://lidetasubcity.gov.et

  # Client build-time variable (set in Vercel/CDN environment, not server)
  VITE_API_URL=https://lidetasubcity.gov.et

──────────────────────────────────────────────────────────────────────────────
APPENDIX E — ADMIN ROLE DEFAULT LANDING PATHS
──────────────────────────────────────────────────────────────────────────────

  Role                Default Path After Login
  ──────────────────  ─────────────────────────
  superadmin          /superadmin/home
  admin               /admin
  complaint_admin     /admin/complaints
  event_admin         /admin/events
  news_admin          /admin/news
  vacancy_admin       /admin/vacancy

──────────────────────────────────────────────────────────────────────────────
APPENDIX F — SATISFACTION SURVEY QUESTION REFERENCE
──────────────────────────────────────────────────────────────────────────────

  Question ID    Subject Area
  ─────────────  ──────────────────────────────────────────────────────────────
  q1             Overall satisfaction with the service received
  q2             Staff courtesy and professional conduct
  q3             Speed and timeliness of service delivery
  q4             Clarity and completeness of information provided
  q5             Ease of accessing the service
  q6             Physical environment and office conditions
  q7             Resolution effectiveness for complaints or issues
  q8             Transparency and openness of the administrative process
  q9             Availability and responsiveness of staff
  q10            Satisfaction with digital and online service options
  q11            Likelihood of recommending the service to others

  Response scale (stored as VARCHAR in database):
    very_high = 5 points
    high      = 4 points
    medium    = 3 points
    low       = 2 points
    very_low  = 1 point

  Aggregate statistics are computed server-side at
  GET /api/contacts/satisfaction/stats and returned as:
    - 30-day average score per question (q1 through q11)
    - Daily total response count for the past 30 days

──────────────────────────────────────────────────────────────────────────────
APPENDIX G — KNOWN LIMITATIONS AND FUTURE RECOMMENDATIONS
──────────────────────────────────────────────────────────────────────────────

  Item                      Current State               Recommendation
  ──────────────────────    ─────────────────────────── ────────────────────────────────────────
  JWT storage               localStorage (XSS exposure) Migrate to HttpOnly SameSite=Strict
                                                        cookies to prevent XSS token theft.

  CV file access            Publicly accessible         Restrict /uploads/cvs/* to authenticated
                            by direct URL (PII)         admin users via middleware auth check
                                                        or signed URL approach.

  Two-factor authentication requires2FA flag is         Implement per-account 2FA toggle stored
                            globally false              in admin_settings or admins table.

  Token revocation          No revocation mechanism;    Implement a JWT blocklist table for
                            relies on expiry only       immediate invalidation on logout or
                                                        compromise.

  Real-time notifications   Not implemented             Add Socket.io for live complaint status
                                                        updates; apply handshake JWT auth.

  DB SSL certificate        rejectUnauthorized: false   Enable full certificate validation for
  validation                                            production database connections.

  Activity log protection   No tamper protection        Add append-only DB role or export logs
                                                        to an external audit system.

  File type validation      MIME type header only       Add magic byte / file signature
                            (can be spoofed)            validation for all uploaded files.

  Admin API granularity     Any admin token accepted    Add per-role API authorization checks
                            on most /api/admin/*        to prevent cross-role data access via
                            endpoints (role control     direct API calls without browser UI.
                            is UI-only for most routes)

================================================================================
END OF DOCUMENT
================================================================================

Document:   LSC-SRS-001
Version:    1.0.0
Pages:      [see file length]
Status:     Final
Issued:     August 2026

This document contains confidential information pertaining to the Lideta
Sub-City Official Website and Administration System. It is intended solely
for the use of the IT Department and Information Network Security
Administration of Lideta Sub-City Administration, Addis Ababa, Ethiopia,
and authorized security auditors. Unauthorized reproduction, distribution,
or disclosure of this document is strictly prohibited.

________________________________________________________________________________
