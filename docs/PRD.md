```markdown
# MA Training — Product Requirements Document

---

## Section 1 — Project Identity

| Field             | Value                                        |
| ----------------- | -------------------------------------------- |
| Project Name      | MA Training Platform                         |
| Project ID        | PRD-001                                      |
| Version           | v1.1                                         |
| Status            | Draft                                        |
| Priority          | High                                         |
| Created Date      | 2026-04-12                                   |
| Last Updated      | 2026-04-12                                   |
| Owner / PM        | Aziza                                        |
| Team Members      | Frontend Dev / Backend Dev / Designer / QA   |
| Frontend Stack    | Vue.js 3 + Vue Router + Pinia + Tailwind CSS |
| Backend Stack     | Node.js + Express.js + TypeScript            |
| Database          | PostgreSQL                                   |
| Cache             | Redis                                        |
| Email / Queue     | BullMQ + Nodemailer / SendGrid               |
| Rendering         | Nuxt.js 3 (SSR + SSG)                        |
| Repository        | [TBD]                                        |
| Git Branch Prefix | NNN-feature-name                             |
| PRD File Path     | docs/PRD.md                                  |

---

## Section 2 — Problem & Purpose

### Problem Statement

Corporate professionals and HR managers across the MENA region currently rely on outdated, poorly designed, and Arabic-unfriendly training websites to discover and inquire about professional development courses. These platforms are slow, non-responsive on mobile, and fail to support RTL layouts — creating significant friction in the course discovery and booking process and causing organizations to lose trust in the training providers they are trying to engage with.

### Project Purpose

MA Training is a modern, multilingual (Arabic / English) corporate training website that allows users to browse, search, filter, explore, and book professional training courses across multiple categories, cities, and dates. Booking is handled via an email-based inquiry system that connects the user directly with the MA Training team — no online payment required.

### Business Value

- Increases course discoverability through advanced search and filtering
- Drives qualified booking leads via the course booking inquiry system
- Drives additional lead generation via trainer applications, contact forms, and newsletter subscriptions
- Automates schedule delivery via email, reducing manual operational effort
- Establishes MA Training as a modern, professional, and trustworthy corporate training brand
- Enables scalable content management through a purpose-built admin dashboard

### Opportunity

The MENA professional training market is growing rapidly. Organizations are actively seeking structured, digitally accessible training programs. A modern, fast, SEO-optimized, bilingual platform with a frictionless booking inquiry flow will capture organic traffic, outperform competitors with outdated web presence, and convert visitors into qualified leads at a significantly higher rate.

---

## Section 3 — Goals & Objectives

### Primary Goal

Launch a fully functional, multilingual (Arabic / English) corporate training website that allows users to browse, search, explore, and submit booking inquiries for courses — and enables administrators to manage all content and leads — within 16 weeks from project kickoff.

### Objectives

1. Deliver a complete 9-page public website with multilingual support (AR/EN) and full RTL layout compliance
2. Implement a courses catalog with advanced search, filtering, and sorting capabilities
3. Build a course booking inquiry system that collects user details and notifies the MA Training team via email
4. Build an automated schedule export system that generates Excel files and delivers them to user emails via background job queues
5. Develop a comprehensive admin dashboard with CRUD operations for all content entities and full leads management
6. Achieve full SEO compliance including SSR via Nuxt.js, Schema.org structured data, sitemap.xml, hreflang tags, and Open Graph metadata

### Success Definition

The platform is considered successfully launched when:

- All 9 public pages are live, responsive, and fully bilingual
- Courses can be searched, filtered, and browsed without errors
- Booking inquiry emails are delivered to the MA Training team within 2 minutes of submission
- Schedule export emails are delivered to users within 2 minutes of request
- Admin dashboard allows full content and leads management without developer intervention
- Lighthouse SEO score ≥ 90 on all key pages
- Core Web Vitals pass on both mobile and desktop

### Non-Goals (v1)

- Online payment or payment gateway integration
- Student accounts or user authentication on the public site
- Course ratings, reviews, or community features
- Video streaming or LMS functionality
- Native iOS or Android application
- Live chat or real-time support

---

## Section 4 — Scope

### In Scope

- Full public website: Home, Courses Listing, Course Details, Schedule, Workshops, Become a Trainer, About, Contact, Privacy Policy & Terms
- Multilingual support: Arabic (RTL) and English (LTR) with language switcher in header
- Localized URLs: /en/[page] and /ar/[page] with hreflang SEO tags
- Courses catalog with all specified fields: title, description, category, subcategory, country, city, start date, duration, price, image
- Advanced search and filters: category, subcategory, country, city, date — with sorting (upcoming first, newest, alphabetical)
- **Course Booking Inquiry System:** Users fill out a booking request form on the course detail page; the system sends a booking inquiry email to the MA Training owner and sends a confirmation email to the user — no online payment involved
- Schedule export: user enters email → system generates Excel (.xlsx) → delivers via email automatically
- Become a Trainer form with CV file upload
- Contact form with backend storage and admin visibility
- Admin dashboard: CRUD for categories, subcategories, courses, workshops, cities, countries
- Admin leads management: trainer applications, booking inquiries, schedule email requests, newsletter subscribers, contact messages
- Admin basic CMS: homepage sections editor, About page editor, social media links manager
- Social media icons in header and footer (LinkedIn, Facebook, Instagram, X, YouTube)
- SEO: Nuxt.js SSR, dynamic meta tags, OG tags, Twitter cards, Schema.org (Course), sitemap.xml, robots.txt
- Image optimization and lazy loading
- Responsive design: mobile, tablet, desktop
- WCAG 2.1 AA accessibility basics

### Out of Scope

- Online payment or payment gateway integration (Stripe, PayPal, etc.)
- Student portal or user accounts on the public site
- Course ratings and reviews
- Live chat or chatbot
- Video streaming or LMS features
- Native mobile application
- Multi-vendor or marketplace functionality
- Advanced analytics dashboard (deferred to v2)

### Assumptions

- Content (course data, images, copy) will be provided by the MA Training team before Phase 2
- A domain name and hosting environment will be provisioned before Phase 4
- SMTP credentials or email API (SendGrid) will be available before email feature development
- The design team will deliver approved UI mockups before Phase 2 begins
- Arabic translations for all static UI strings will be provided by the client
- The MA Training owner email address for receiving booking inquiries will be provided before Phase 3

### Constraints

- Launch target: 16 weeks from kickoff
- All public-facing pages must render correctly in Arabic RTL and English LTR
- The platform must pass Core Web Vitals thresholds on both mobile and desktop
- No online payment processing in v1 — all bookings handled via email inquiry

### Dependencies

- SendGrid or SMTP provider account for email delivery (booking notifications + schedule export)
- Cloud storage (AWS S3 or equivalent) for CV uploads and course images
- Nuxt.js 3 SSR hosting environment (Vercel, Railway, or VPS)
- PostgreSQL database hosting
- Redis instance for BullMQ job queues
- Domain and SSL certificate provisioning
- MA Training owner email address for booking inquiry delivery

---

## Section 5 — Users & Personas

### Primary Users

Corporate HR managers, learning & development officers, and individual professionals across the MENA region seeking structured, credible professional training courses to browse, explore, and book.

### Secondary Users

Website administrators and MA Training staff who manage course content, respond to booking inquiries and leads, and operate the platform day-to-day.

---

### Persona 1 — Primary User

| Field      | Detail                                                                                                                                                 |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Name       | Hana                                                                                                                                                   |
| Role       | HR Manager — Mid-size corporation, MENA region                                                                                                         |
| Goal       | Find relevant training courses for her team, request the schedule, and submit a booking inquiry directly from the course page                          |
| Pain Point | Current training websites are slow, not mobile-friendly, show no Arabic support, and require calling the provider just to express interest in a course |
| Tech Level | Medium — comfortable with web browsing, forms, and email                                                                                               |
| Frequency  | Weekly — actively researching and booking training for quarterly planning                                                                              |
| Success    | Finds a relevant course, reads full details, submits a booking inquiry in under 3 minutes, and receives a confirmation email immediately               |

---

### Persona 2 — Secondary User

| Field      | Detail                                                                                                                          |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Name       | Omar                                                                                                                            |
| Role       | MA Training Content Admin                                                                                                       |
| Goal       | Manage all courses and leads — including incoming booking inquiries — from a single dashboard without needing developer support |
| Pain Point | Currently manages booking requests via WhatsApp or phone calls with no central system to track or follow up on leads            |
| Tech Level | Low to Medium — non-technical, expects a clean UI                                                                               |
| Frequency  | Daily — adds new courses, reviews booking inquiries, exports leads                                                              |
| Success    | Views all incoming booking inquiries in one place, sees inquiry details (name, course, date, message), marks as reviewed        |

---

## Section 6 — MoSCoW Feature Prioritization

### Must Have — P0

| ID      | Feature                        | Status | Description                                                                                                                                    | Assigned To            | Sprint |
| ------- | ------------------------------ | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- | ------ |
| P0-F001 | Multilingual Website (AR/EN)   | TODO   | Full bilingual support with RTL for Arabic and LTR for English, language switcher in header, localized URLs                                    | Frontend Dev           | 1      |
| P0-F002 | Courses Catalog                | TODO   | Display all courses with title, description, category, subcategory, country, city, start date, duration, price, image                          | Frontend + Backend Dev | 2      |
| P0-F003 | Advanced Search & Filters      | TODO   | Filter by category, subcategory, country, city, date — with sorting: upcoming first, newest, alphabetical                                      | Frontend + Backend Dev | 2      |
| P0-F004 | Schedule Export via Email      | TODO   | User enters email, system generates Excel (.xlsx) and delivers it automatically via background queue                                           | Backend Dev            | 3      |
| P0-F005 | Admin Dashboard — Content CRUD | TODO   | Full CRUD for courses, categories, subcategories, cities, countries, workshops                                                                 | Backend + Frontend Dev | 3      |
| P0-F006 | SEO Implementation             | TODO   | Nuxt.js SSR, dynamic meta tags, OG tags, Schema.org Course, sitemap.xml, robots.txt, hreflang                                                  | Frontend Dev           | 1      |
| P0-F007 | Become a Trainer Form          | TODO   | Form with name, email, phone, CV upload, expertise, message — stored in DB and visible in admin                                                | Backend + Frontend Dev | 2      |
| P0-F008 | Contact Page & Form            | TODO   | Contact form stored in DB, visible in admin dashboard                                                                                          | Backend + Frontend Dev | 2      |
| P0-F009 | Course Booking Inquiry System  | TODO   | User fills booking form on course detail page; system emails inquiry to MA Training owner and sends confirmation to user — no payment involved | Backend + Frontend Dev | 3      |

---

### Should Have — P1

| ID      | Feature                   | Status | Description                                                                                                      | Assigned To            | Sprint |
| ------- | ------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------- | ---------------------- | ------ |
| P1-F001 | Workshops Page            | TODO   | Dedicated workshops listing and detail pages with admin CRUD management                                          | Frontend + Backend Dev | 4      |
| P1-F002 | Newsletter Subscription   | TODO   | Email capture form, stored in DB, exportable from admin                                                          | Backend + Frontend Dev | 4      |
| P1-F003 | Admin Leads Management    | TODO   | Admin views booking inquiries, trainer applications, schedule requests, newsletter subscribers, contact messages | Backend Dev            | 3      |
| P1-F004 | Social Media Integration  | TODO   | Linked social icons (LinkedIn, Facebook, Instagram, X, YouTube) in header and footer                             | Frontend Dev           | 1      |
| P1-F005 | UX Enhancements           | TODO   | Breadcrumbs, loading skeletons, toast notifications, empty states, course share buttons                          | Frontend Dev           | 4      |
| P1-F006 | Localized URLs + hreflang | TODO   | /en/ and /ar/ URL prefixes, hreflang tags in head for multilingual SEO                                           | Frontend Dev           | 1      |

---

### Could Have — P2

| ID      | Feature                      | Status | Description                                                  | Assigned To  | Sprint |
| ------- | ---------------------------- | ------ | ------------------------------------------------------------ | ------------ | ------ |
| P2-F001 | Course Share Buttons         | TODO   | Per-course share via WhatsApp, LinkedIn, copy link           | Frontend Dev | 5      |
| P2-F002 | Sticky Header                | TODO   | Header remains visible on scroll with compact mode on mobile | Frontend Dev | 5      |
| P2-F003 | Related Courses Widget       | TODO   | Show related courses on course detail page based on category | Frontend Dev | 5      |
| P2-F004 | Print-friendly Course Detail | TODO   | CSS print stylesheet for course detail page                  | Frontend Dev | 5      |

---

### Won't Have — P3

| ID      | Feature                        | Status  | Description                                                |
| ------- | ------------------------------ | ------- | ---------------------------------------------------------- |
| P3-F001 | Online Payment / Booking       | SKIPPED | Payment gateway integration — deferred to v2               |
| P3-F002 | Student Portal / User Accounts | SKIPPED | Public-facing user registration and login — deferred to v2 |
| P3-F003 | Course Ratings & Reviews       | SKIPPED | User-generated ratings and reviews — deferred to v2        |
| P3-F004 | Live Chat                      | SKIPPED | Real-time chat support — deferred to v2                    |
| P3-F005 | Video Streaming / LMS          | SKIPPED | Online course delivery and video hosting — deferred to v2  |
| P3-F006 | Native Mobile App              | SKIPPED | iOS and Android applications — deferred to v2              |

---

## Section 7 — Functional Requirements

---

### P0-F001 — Multilingual Website (AR/EN)

**Description**
The platform must fully support Arabic (RTL) and English (LTR). All UI strings, navigation, and static content must be translatable. The user can switch languages via a header toggle. The selected language persists across navigation.

**User Story**
As an Arabic-speaking HR manager, I want to browse the entire website in Arabic with a proper RTL layout so that I can understand the content naturally and trust the platform.

**Trigger:** User clicks language switcher in header or navigates to a localized URL (/ar/ or /en/)

**Pre-conditions:** i18n translation files are loaded for the selected locale

**Post-conditions:** All UI text, layout direction, and URL prefix update to reflect the selected language

**Main Flow**

1. User lands on the website at the default locale (/en/)
2. User clicks the language switcher (AR / EN) in the header
3. System updates the URL prefix to /ar/[current-page]
4. Layout direction switches to RTL
5. All UI strings render in Arabic
6. Language preference is stored in localStorage
7. Subsequent navigation maintains the selected language

**Alternate Flow — Direct navigation to /ar/courses**

1. System detects /ar/ prefix in URL
2. Arabic locale is loaded automatically
3. RTL layout is applied without requiring a manual switch

**Acceptance Criteria**

- [ ] Language switcher is visible and accessible in the header on all pages
- [ ] Switching language updates URL prefix, layout direction, and all UI strings simultaneously
- [ ] Arabic layout is fully RTL — text, navigation, icons, and form fields all mirror correctly
- [ ] Language preference persists across page navigation via localStorage
- [ ] hreflang tags are present in head on all pages pointing to /en/ and /ar/ equivalents
- [ ] No untranslated strings appear in either language

---

### P0-F002 — Courses Catalog

**Description**
The courses listing page displays all available courses in a card-based grid layout. Each course card shows key details. Clicking a card navigates to the full course detail page which includes the booking inquiry button.

**User Story**
As a corporate professional, I want to browse all available training courses in a clean visual layout so that I can quickly scan options and click into the ones that interest me.

**Trigger:** User navigates to /en/courses or /ar/courses

**Pre-conditions:** At least one published course exists in the database

**Post-conditions:** Course cards are displayed in a responsive grid; clicking a card navigates to the course detail page

**Main Flow**

1. User navigates to the courses listing page
2. System fetches published courses from GET /api/v1/courses
3. Courses render as cards in a responsive grid (3 columns desktop, 2 tablet, 1 mobile)
4. Each card displays: course image, title, category, city, start date, duration, price (if available)
5. User clicks a course card
6. System navigates to /en/courses/[slug] with full course details and booking inquiry section

**Alternate Flow — No courses found**

1. System returns empty results
2. Empty state component is displayed: illustration + "No courses available at the moment"
3. No error is thrown

**Acceptance Criteria**

- [ ] Courses listing page loads within 2 seconds on desktop and mobile
- [ ] Course cards display all required fields: image, title, category, city, start date, duration, price
- [ ] Missing optional fields (e.g., price) are hidden gracefully with no broken layout
- [ ] Clicking a card navigates to the correct course detail page
- [ ] Course detail page includes a visible booking inquiry section
- [ ] Empty state is displayed when no courses exist
- [ ] Loading skeleton is shown while courses are being fetched
- [ ] Page is fully responsive across mobile, tablet, and desktop
- [ ] Course detail page includes Schema.org Course structured data

---

### P0-F003 — Advanced Search & Filters

**Description**
Users can filter the courses listing by category, subcategory, country, city, and date range. Results can be sorted by upcoming first, newest, or alphabetical. Filters update results dynamically without a full page reload.

**User Story**
As an HR manager, I want to filter courses by category, city, and upcoming date so that I can quickly find courses relevant to my team's location and schedule.

**Trigger:** User interacts with any filter control or search input on the courses listing page

**Pre-conditions:** Courses listing page is loaded

**Post-conditions:** Course list updates to reflect applied filters; URL query parameters update to reflect current filter state

**Main Flow**

1. User selects a category from the category dropdown
2. Subcategory dropdown populates based on selected category
3. User selects country → city dropdown populates with cities in that country
4. User selects a date range using the date picker
5. User selects a sort order
6. System sends GET /api/v1/courses?category=&city=&date=&sort= with selected parameters
7. Course grid updates with filtered results
8. Applied filter tags appear below the search bar
9. User can remove individual filters by clicking × on each tag

**Alternate Flow — No results match filters**

1. System returns empty array
2. Empty state displays: "No courses match your search. Try adjusting your filters."
3. "Clear all filters" button resets all filters

**Acceptance Criteria**

- [ ] All filter controls (category, subcategory, country, city, date, sort) are functional
- [ ] Subcategory dropdown is disabled until a category is selected
- [ ] City dropdown is disabled until a country is selected
- [ ] Filtering updates results without full page reload
- [ ] Applied filters are reflected in the URL as query parameters
- [ ] Each applied filter displays as a removable tag
- [ ] "Clear all filters" resets all filter controls and restores full course list
- [ ] Empty state is displayed when no courses match filters
- [ ] Filter state survives browser back/forward navigation

---

### P0-F004 — Schedule Export via Email

**Description**
Users can request the full training schedule as an Excel file delivered to their email. The system validates the email, queues a background job, generates the .xlsx file dynamically, and sends it automatically. The user sees a success message upon submission.

**User Story**
As an HR manager, I want to enter my email and receive the full training schedule as an Excel file so that I can review it offline and share it with my team.

**Trigger:** User clicks "Download Schedule" button on the Schedule page

**Pre-conditions:** User is on the Schedule page; email input is visible

**Post-conditions:** Background job is queued; Excel file is generated and emailed to the user within 2 minutes; success message is displayed

**Main Flow**

1. User clicks "Download Schedule" button
2. Modal or inline form appears with email input field
3. User enters their email address
4. System validates email format on the frontend
5. User clicks "Send Schedule"
6. System sends POST /api/v1/schedule/request with email payload
7. Backend validates email format and checks rate limit (max 3 requests per email per hour)
8. Backend queues a BullMQ job: generateScheduleEmail
9. System immediately returns 200 with message: "The schedule has been sent to your email."
10. BullMQ worker processes the job: fetches all upcoming courses, generates .xlsx using ExcelJS, attaches file, sends via SendGrid/Nodemailer
11. User receives email with attached Excel schedule within 2 minutes

**Alternate Flow — Invalid email**

1. User submits an invalid email format
2. Inline error displays: "Please enter a valid email address."
3. No API call is made

**Alternate Flow — Rate limit exceeded**

1. User submits more than 3 requests within 1 hour from the same email
2. System returns 429
3. UI displays: "You have already requested the schedule. Please check your inbox or try again later."

**Alternate Flow — Email delivery failure**

1. BullMQ job fails (SMTP error or API timeout)
2. Job retries up to 3 times with exponential backoff
3. If all retries fail, error is logged and admin is notified

**Acceptance Criteria**

- [ ] Schedule export button is visible on the Schedule page
- [ ] Email input validates format before submission
- [ ] Success message "The schedule has been sent to your email." displays immediately after valid submission
- [ ] Excel file is generated dynamically with all upcoming courses
- [ ] Excel columns include: Course Title, Category, City, Country, Start Date, Duration, Price
- [ ] Email is delivered within 2 minutes of request
- [ ] Rate limiting enforced: max 3 requests per email per hour
- [ ] Invalid email format is rejected with inline error
- [ ] BullMQ job retries up to 3 times on failure
- [ ] All schedule requests are stored in the database and visible in the admin dashboard

---

### P0-F005 — Admin Dashboard — Content CRUD

**Description**
Authenticated admin users can create, read, update, and delete all content entities: courses, categories, subcategories, cities, countries, workshops. The dashboard is protected by JWT authentication and accessible only to authorized MA Training staff.

**User Story**
As a content admin, I want to manage all course information from a single dashboard so that I can keep the website up to date without needing developer assistance.

**Trigger:** Admin navigates to /admin and logs in with valid credentials

**Pre-conditions:** Admin account exists in the database; JWT auth is configured

**Post-conditions:** Admin can perform full CRUD on all content entities

**Main Flow**

1. Admin navigates to /admin/login
2. Admin enters email and password
3. System validates credentials and returns JWT access token + refresh token
4. Admin is redirected to /admin/dashboard
5. Admin selects "Courses" from the sidebar
6. Courses list displays with search, filter, and pagination
7. Admin clicks "Add New Course"
8. Form renders with all required fields: title (AR + EN), description (AR + EN), category, subcategory, country, city, start date, duration, price (optional), image upload
9. Admin fills form and clicks "Save"
10. System sends POST /api/v1/admin/courses
11. Course is created; toast notification: "Course created successfully."

**Alternate Flow — Edit existing course**

1. Admin clicks "Edit" on any course row
2. Form pre-fills with existing data
3. Admin modifies fields and saves
4. System sends PUT /api/v1/admin/courses/:id
5. Toast confirms: "Course updated successfully."

**Alternate Flow — Delete course**

1. Admin clicks "Delete" on a course row
2. Confirmation dialog: "Are you sure you want to delete this course?"
3. Admin confirms
4. System sends DELETE /api/v1/admin/courses/:id
5. Toast confirms: "Course deleted."

**Acceptance Criteria**

- [ ] /admin routes are protected — unauthenticated users are redirected to /admin/login
- [ ] JWT tokens expire appropriately; refresh token rotation is implemented
- [ ] Admin can create, edit, and delete: courses, categories, subcategories, cities, countries, workshops
- [ ] Course form supports bilingual input (Arabic + English fields for title and description)
- [ ] Image upload is handled via cloud storage (AWS S3 or equivalent)
- [ ] All CRUD operations show toast notifications on success and error
- [ ] Admin dashboard is responsive and usable on tablet

---

### P0-F006 — SEO Implementation

**Description**
Every public page must be server-side rendered via Nuxt.js to ensure full crawlability. Dynamic meta tags, Open Graph, Twitter Card, and Schema.org structured data must be set per page. sitemap.xml is auto-generated. hreflang tags link AR/EN equivalents.

**User Story**
As the MA Training marketing team, we want every course page to be discoverable by Google in both Arabic and English so that we can capture organic search traffic across the MENA region.

**Trigger:** Any public page is loaded by a user or search engine crawler

**Pre-conditions:** Nuxt.js SSR is configured and deployed

**Post-conditions:** Page HTML includes all required meta, OG, hreflang, and structured data tags in the server-rendered response

**Main Flow**

1. Search engine crawler requests /en/courses/project-management-fundamentals
2. Nuxt.js server renders the full HTML page including all meta tags
3. head includes: title, meta description, canonical URL, OG tags, Twitter Card tags, hreflang for /ar/ equivalent, Schema.org JSON-LD for Course entity
4. Crawler indexes the page with full metadata

**Acceptance Criteria**

- [ ] All public pages are server-side rendered via Nuxt.js
- [ ] Each page has a unique, dynamic title and meta description
- [ ] Open Graph tags (og:title, og:description, og:image, og:url) are present on all pages
- [ ] Twitter Card tags are present on all pages
- [ ] Schema.org Course structured data (JSON-LD) is present on all course detail pages
- [ ] hreflang tags link /en/ and /ar/ equivalents on all pages
- [ ] sitemap.xml is auto-generated and includes all public pages and course URLs
- [ ] robots.txt is configured correctly
- [ ] All images have descriptive alt attributes
- [ ] Lighthouse SEO score ≥ 90 on homepage and course detail page

---

### P0-F007 — Become a Trainer Form

**Description**
Prospective trainers can submit an application via a dedicated form. The form collects personal information, expertise, and a CV file upload. Submissions are stored in the database and visible to admins.

**User Story**
As an experienced professional, I want to apply to become a trainer at MA Training by submitting my CV and expertise details so that the team can evaluate my application.

**Trigger:** User navigates to the Become a Trainer page and submits the form

**Pre-conditions:** Form page is accessible; file upload endpoint is configured

**Post-conditions:** Application is stored in the database; admin can view it in the dashboard

**Main Flow**

1. User navigates to /en/become-a-trainer
2. Form renders: Full Name, Email, Phone, Expertise/Specialization, Message, CV Upload (PDF/DOC, max 5MB)
3. User fills all fields and uploads CV
4. User clicks "Submit Application"
5. Frontend validates all fields (required, email format, file type, file size)
6. System sends POST /api/v1/trainer-applications (multipart/form-data)
7. CV is uploaded to cloud storage; URL stored in database
8. Success message: "Your application has been submitted. We will contact you soon."

**Alternate Flow — Invalid file type**

1. User uploads a file that is not PDF or DOC
2. Inline error: "Please upload a PDF or Word document."
3. Form is not submitted

**Acceptance Criteria**

- [ ] All form fields are required except Message
- [ ] Email field validates format
- [ ] CV upload accepts only PDF and DOC/DOCX
- [ ] CV file size is limited to 5MB with inline error if exceeded
- [ ] Successful submission shows confirmation message
- [ ] Application data and CV URL are stored in the database
- [ ] All trainer applications are visible in the admin dashboard

---

### P0-F008 — Contact Page & Form

**Description**
The contact page provides MA Training's contact information and a form for general inquiries. Submissions are stored in the database and visible in the admin dashboard.

**User Story**
As a potential client, I want to send a message to MA Training through the website so that I can inquire about custom training programs or partnerships.

**Trigger:** User navigates to /en/contact and submits the form

**Pre-conditions:** Contact page is accessible

**Post-conditions:** Message is stored in the database; admin can view it in the dashboard

**Main Flow**

1. User navigates to /en/contact
2. Form renders: Full Name, Email, Phone (optional), Subject, Message
3. User fills required fields and submits
4. System validates fields on frontend
5. System sends POST /api/v1/contact
6. Message is stored in the database
7. Success message: "Thank you for reaching out. We will get back to you within 1 business day."

**Acceptance Criteria**

- [ ] Form fields: Name (required), Email (required), Phone (optional), Subject (required), Message (required)
- [ ] Email validates format before submission
- [ ] Successful submission shows confirmation message
- [ ] All contact messages are stored in database and visible in admin dashboard
- [ ] Admin can mark messages as read/unread and delete them

---

### P0-F009 — Course Booking Inquiry System

**Description**
On every course detail page, users can submit a booking inquiry by filling out a short form with their personal and organizational details. The system sends a formatted booking notification email to the MA Training owner and a confirmation email to the user. No payment is involved. All inquiries are stored in the database and visible in the admin dashboard.

**User Story**
As an HR manager interested in enrolling my team in a course, I want to submit a booking inquiry directly from the course page so that the MA Training team can contact me to confirm availability and arrange next steps — without needing to make a payment online.

**Trigger:** User clicks "Book This Course" or "Request Booking" button on a course detail page

**Pre-conditions:**

- User is on a course detail page
- Course is published and active
- BullMQ and email service are configured

**Post-conditions:**

- Booking inquiry is stored in the database
- Notification email is sent to the MA Training owner email
- Confirmation email is sent to the user
- Success message is displayed on screen

**Main Flow**

1. User navigates to /en/courses/[slug]
2. User reads course details and clicks "Book This Course"
3. Booking inquiry form appears (modal or inline section) with fields:
   - Full Name (required)
   - Email Address (required)
   - Phone Number (required)
   - Company / Organization (optional)
   - Number of Attendees (required, numeric, min 1)
   - Preferred Start Date (pre-filled with course start date, editable)
   - Message / Special Requirements (optional)
4. User fills the form and clicks "Send Booking Request"
5. Frontend validates all required fields
6. System sends POST /api/v1/bookings with form data and course ID
7. Booking inquiry is saved to the database with status: pending
8. BullMQ queues two background jobs:
   - sendBookingNotificationToOwner — sends formatted email to MA Training owner with all inquiry details and course info
   - sendBookingConfirmationToUser — sends confirmation email to the user's email address
9. Both emails are delivered within 2 minutes
10. User sees success message: "Your booking request has been sent. Our team will contact you shortly to confirm your enrollment."

**Alternate Flow — Invalid form fields**

1. User submits with missing required fields
2. Inline errors appear on each invalid field
3. No API call is made until all required fields are valid

**Alternate Flow — Email delivery failure**

1. BullMQ job fails (SMTP/SendGrid error)
2. Job retries up to 3 times with exponential backoff
3. Booking record remains in database regardless of email status
4. Admin can view the inquiry and follow up manually if needed

**Owner Notification Email — Required Content**

- Subject: New Booking Inquiry — [Course Title]
- Course name, category, city, start date
- Applicant: full name, email, phone, company
- Number of attendees
- Preferred start date
- Message / special requirements
- Timestamp of submission

**User Confirmation Email — Required Content**

- Subject: Booking Request Received — [Course Title]
- Thank-you message
- Summary of submitted details
- Note: "Our team will contact you within 1–2 business days to confirm your enrollment."
- MA Training contact information

**Acceptance Criteria**

- [ ] "Book This Course" button is visible and accessible on all course detail pages in both AR and EN
- [ ] Booking form renders correctly in RTL (Arabic) and LTR (English) layouts
- [ ] All required fields validate before submission
- [ ] Phone field accepts international formats
- [ ] Number of attendees field accepts integers only, minimum value of 1
- [ ] Successful submission displays: "Your booking request has been sent. Our team will contact you shortly to confirm your enrollment."
- [ ] Booking inquiry is saved in the database with: course ID, user details, attendee count, preferred date, message, timestamp, status = pending
- [ ] Owner receives formatted notification email within 2 minutes containing all inquiry details
- [ ] User receives confirmation email within 2 minutes
- [ ] All booking inquiries are visible in the admin dashboard under a dedicated "Booking Inquiries" section
- [ ] Admin can view inquiry details, update status (pending / contacted / confirmed / cancelled), and filter by status
- [ ] BullMQ retries email jobs up to 3 times on failure
- [ ] Rate limiting applied: max 5 booking requests per IP per hour

---

## Section 8 — Non-Functional Requirements

### Performance

- Page load time: < 2 seconds on desktop, < 3 seconds on mobile (3G)
- API response time: < 500ms for all endpoints under normal load
- Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1
- Booking inquiry email (owner notification + user confirmation): delivered within 2 minutes
- Schedule export email: delivered within 2 minutes

### Security

- JWT authentication with refresh token rotation for all admin routes
- All admin API endpoints protected by authentication middleware
- Input validation and sanitization on all form submissions (backend)
- CV and image file uploads validated for type and size
- Rate limiting on public endpoints:
  - Booking inquiry: max 5 requests per IP per hour
  - Schedule export: max 3 requests per email per hour
  - Contact form: max 5 requests per IP per hour
- HTTPS enforced across all environments
- Environment variables used for all secrets (SMTP, JWT secret, DB connection, owner email)
- SQL injection prevention via Prisma ORM parameterized queries
- XSS prevention via Vue's built-in output escaping

### Availability

- Target uptime: 99.9% monthly
- Graceful degradation: if email service is down, requests are queued and retried
- BullMQ job retries: 3 attempts with exponential backoff
- Booking inquiries are always stored in the database regardless of email delivery status

### Scalability

- PostgreSQL with connection pooling (PgBouncer or built-in)
- Redis for BullMQ job queue and optional caching layer
- Stateless Express.js API (horizontal scaling ready)
- CDN for static assets and images

### Accessibility

- WCAG 2.1 AA compliance on all public pages
- Proper semantic HTML structure
- All images have descriptive alt attributes
- Form fields have associated labels
- Keyboard navigation supported throughout
- Focus indicators visible on all interactive elements
- Color contrast ratio ≥ 4.5:1
- Booking form accessible in both RTL and LTR layouts

### Compatibility

- Browsers: Chrome 100+, Safari 15+, Firefox 100+, Edge 100+
- Mobile: iOS Safari 15+, Android Chrome 100+
- Responsive breakpoints: 375px (mobile), 768px (tablet), 1280px (desktop)

### Data & Compliance

- GDPR-compliant data handling for EU visitors (consent for newsletter and booking inquiry data storage)
- CV files stored securely in cloud storage with access-controlled URLs
- No sensitive personal data stored in URL parameters
- Daily automated database backups with 30-day retention
- Booking inquiry personal data retained for 12 months then purged unless actively engaged

### Observability

- Structured JSON logging (Winston or Pino)
- Error rate monitoring: alert triggered if error rate > 1% over 5-minute window
- BullMQ job failure logging with admin notification
- Uptime monitoring via external service (UptimeRobot or Better Uptime)

---

## Section 9 — Technical Architecture

### Frontend Stack

- **Framework:** Nuxt.js 3 (Vue.js 3) — SSR + SSG hybrid mode
- **State Management:** Pinia
- **Routing:** Vue Router (built into Nuxt.js)
- **Styling:** Tailwind CSS + custom design tokens
- **Internationalization:** @nuxtjs/i18n — AR/EN, RTL/LTR
- **HTTP Client:** $fetch (Nuxt built-in) / Axios
- **Form Validation:** VeeValidate + Zod
- **Testing:** Vitest + Vue Test Utils

### Backend Stack

- **Runtime:** Node.js 20.12+ LTS
- **Framework:** Express.js + TypeScript
- **ORM:** Prisma (PostgreSQL)
- **Validation:** Zod
- **Auth:** JWT (jsonwebtoken) + bcrypt — access token 15min + refresh token 7d rotation
- **File Upload:** Multer + AWS S3 SDK
- **Excel Generation:** ExcelJS
- **Email Delivery:** Nodemailer + SendGrid API
- **Job Queue:** BullMQ + Redis
- **Testing:** Jest + Supertest
- **API Style:** REST — versioned /api/v1/

### Database Architecture

**Database:** PostgreSQL 15

| Entity                 | Key Fields                                                                                                                                                                                                            |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| categories             | id, name_en, name_ar, slug, created_at                                                                                                                                                                                |
| subcategories          | id, category_id (FK), name_en, name_ar, slug, created_at                                                                                                                                                              |
| countries              | id, name_en, name_ar, code                                                                                                                                                                                            |
| cities                 | id, country_id (FK), name_en, name_ar                                                                                                                                                                                 |
| courses                | id, title_en, title_ar, description_en, description_ar, category_id (FK), subcategory_id (FK), country_id (FK), city_id (FK), start_date, duration_days, price, image_url, slug, is_published, created_at, updated_at |
| workshops              | id, title_en, title_ar, description_en, description_ar, date, location, image_url, slug, is_published, created_at                                                                                                     |
| booking_inquiries      | id, course_id (FK), full_name, email, phone, company, attendees_count, preferred_date, message, status (pending/contacted/confirmed/cancelled), created_at                                                            |
| trainer_applications   | id, full_name, email, phone, expertise, message, cv_url, status, created_at                                                                                                                                           |
| contact_messages       | id, full_name, email, phone, subject, message, is_read, created_at                                                                                                                                                    |
| newsletter_subscribers | id, email, subscribed_at, is_active                                                                                                                                                                                   |
| schedule_requests      | id, email, requested_at, status, delivered_at                                                                                                                                                                         |
| admin_users            | id, email, password_hash, role, created_at, last_login                                                                                                                                                                |

**Cache:** Redis

- BullMQ job queues (booking emails, schedule export emails)
- Optional: course listing cache (5-minute TTL)

### Auth & Authorization

- Admin-only authentication (public site has no user login in v1)
- JWT access token: 15-minute expiry
- JWT refresh token: 7-day expiry, stored in httpOnly cookie
- Refresh token rotation on each use
- All /api/v1/admin/\* routes protected by authMiddleware

### Infrastructure & Deployment

- **Frontend (Nuxt.js SSR):** Vercel or Railway
- **Backend (Express.js API):** Railway or VPS (Ubuntu + PM2)
- **Database:** Railway PostgreSQL or Supabase
- **Cache / Queue:** Railway Redis or Upstash
- **File Storage:** AWS S3 or Cloudflare R2
- **CDN:** Cloudflare
- **SSL:** Let's Encrypt or Cloudflare
- **CI/CD:** GitHub Actions — lint → test → build → deploy (staging + production)

### External Integrations

- **SendGrid** — transactional emails (booking owner notification, booking user confirmation, schedule export)
- **AWS S3 / Cloudflare R2** — CV uploads and course image storage
- **BullMQ + Redis** — background job processing for all email delivery
- **Google Search Console** — sitemap submission and SEO monitoring
- **UptimeRobot** — uptime monitoring and alerting

---

## Section 10 — Implementation Phases

### Phase 1 — Foundation (Weeks 1–2)

**Goal:** Set up project infrastructure, CI/CD, and core architecture

- [ ] Initialize Nuxt.js 3 project with TypeScript, Tailwind CSS, @nuxtjs/i18n
- [ ] Configure Vue Router, Pinia store structure
- [ ] Initialize Express.js API with TypeScript, Prisma, PostgreSQL connection
- [ ] Set up Redis connection and BullMQ configuration
- [ ] Configure JWT auth system (login, access token, refresh token rotation)
- [ ] Set up AWS S3 / Cloudflare R2 for file uploads
- [ ] Set up GitHub Actions CI/CD pipeline (lint, test, build, deploy)
- [ ] Deploy staging environments (frontend + backend)
- [ ] Configure multilingual routing: /en/ and /ar/ prefixes with RTL/LTR switching
- [ ] Add hreflang tags and robots.txt
- [ ] Create base SEO composable for dynamic meta tags
- [ ] Add social media links in header and footer — P1-F004
- [ ] Add localized URL routing — P1-F006

**Validation:** Staging environment is live. Language switcher works. CI/CD pipeline passes.

---

### Phase 2 — Core Public Pages & Catalog (Weeks 3–6)

**Goal:** Build all public-facing pages and core catalog features

- [ ] Design and implement Home page with hero, search widget, featured courses section
- [ ] Build Courses Listing page with card grid and API integration
- [ ] Build Course Detail page with all fields + Schema.org JSON-LD + booking inquiry section (P0-F009 UI)
- [ ] Implement Advanced Search & Filters — P0-F003
- [ ] Build Schedule page with course timeline view
- [ ] Build Workshops page — P1-F001
- [ ] Build Become a Trainer page with form and CV upload — P0-F007
- [ ] Build Contact page with form — P0-F008
- [ ] Build About, Privacy Policy, and Terms pages
- [ ] Implement all database entities and Prisma migrations (including booking_inquiries table)
- [ ] Build REST API endpoints for all public content
- [ ] Implement Newsletter subscription form and API — P1-F002
- [ ] Add loading skeletons, empty states, toast notifications — P1-F005
- [ ] Add breadcrumbs component
- [ ] Seed database with initial content for testing

**Validation:** All 9 public pages accessible in AR and EN. Courses can be browsed, filtered, and searched. Booking inquiry form renders correctly on course detail page.

---

### Phase 3 — Admin Dashboard, Booking System & Email Delivery (Weeks 7–10)

**Goal:** Build admin dashboard and all automated email delivery systems

- [ ] Build /admin/login with JWT authentication
- [ ] Build admin sidebar layout and navigation
- [ ] Implement Courses CRUD with bilingual fields — P0-F005
- [ ] Implement Categories, Subcategories, Cities, Countries CRUD
- [ ] Implement Workshops CRUD
- [ ] Build admin Booking Inquiries section: list, view details, update status (pending / contacted / confirmed / cancelled) — P1-F003
- [ ] Build admin Leads section: trainer applications, contact messages, newsletter subscribers, schedule requests
- [ ] Build basic CMS: homepage editor, About page editor, social links manager
- [ ] Implement Booking Inquiry Email System — P0-F009 backend:
  - [ ] POST /api/v1/bookings endpoint with validation and rate limiting
  - [ ] BullMQ job: sendBookingNotificationToOwner
  - [ ] BullMQ job: sendBookingConfirmationToUser
  - [ ] SendGrid/Nodemailer: format and send both emails
  - [ ] Store owner notification email address in environment config
- [ ] Implement Schedule Export via Email — P0-F004:
  - [ ] POST /api/v1/schedule/request endpoint with rate limiting
  - [ ] BullMQ job: generateScheduleEmail
  - [ ] ExcelJS: generate .xlsx with all upcoming courses
  - [ ] Send Excel file via email
- [ ] Add image upload to course and workshop forms
- [ ] Admin pagination, search, and filter on all list views

**Validation:** Admin can manage all content and view all leads. Booking inquiry email delivered to owner and confirmation sent to user within 2 minutes. Schedule export email received within 2 minutes. Rate limiting works as specified.

---

### Phase 4 — SEO, Polish & Launch Hardening (Weeks 11–16)

**Goal:** Finalize SEO, performance, accessibility, and prepare for production launch

- [ ] Audit and finalize all dynamic meta tags, OG tags, Twitter Cards on every page
- [ ] Validate Schema.org Course structured data on all course detail pages
- [ ] Generate and submit sitemap.xml to Google Search Console
- [ ] Run Lighthouse audits — achieve SEO ≥ 90, Performance ≥ 85 on key pages
- [ ] Core Web Vitals optimization: LCP, FID, CLS
- [ ] Image optimization: WebP conversion, lazy loading, responsive srcset
- [ ] Implement course share buttons — P2-F001
- [ ] Implement sticky header — P2-F002
- [ ] WCAG 2.1 AA accessibility audit and fixes
- [ ] Cross-browser and mobile testing
- [ ] Security audit: rate limiting, input sanitization, file upload validation, JWT hardening
- [ ] End-to-end test: full booking inquiry flow in AR and EN
- [ ] Set up uptime monitoring (UptimeRobot)
- [ ] Set up structured JSON logging and error alerting
- [ ] Production environment provisioning and DNS configuration
- [ ] SSL certificate validation
- [ ] Load testing on key API endpoints
- [ ] Full QA pass in both AR and EN
- [ ] Stakeholder UAT sign-off
- [ ] Production deployment

**Validation:** All features work in AR and EN. Booking inquiries reach owner inbox. Lighthouse SEO ≥ 90. Core Web Vitals pass. UAT approved. Production live.

---

## Section 11 — User Flow, Edge Cases, API Design & Data Model

### User Flow — Browse, Inquire & Book a Course (Primary Flow)

1. User lands on homepage — redirected to /en/ or /ar/ based on browser locale
2. Hero section displays with prominent search widget
3. User selects a category or enters a keyword from the homepage search
4. User is navigated to /en/courses?category=leadership
5. Course cards load with matching results; loading skeleton shown during fetch
6. User applies additional filters: City = Dubai, Date = Next Month
7. Results update dynamically; applied filter tags appear
8. User clicks a course card → navigates to /en/courses/leadership-essentials
9. Course detail page renders: full description, dates, duration, city, price
10. User scrolls to "Book This Course" section
11. Booking inquiry form appears: Name, Email, Phone, Company, Attendees, Preferred Date, Message
12. User fills required fields and clicks "Send Booking Request"
13. Success message displays: "Your booking request has been sent. Our team will contact you shortly to confirm your enrollment."
14. MA Training owner receives formatted booking notification email within 2 minutes
15. User receives booking confirmation email within 2 minutes

---

### Edge Cases

| Condition                                           | System Behavior                        | User Feedback                                                                          |
| --------------------------------------------------- | -------------------------------------- | -------------------------------------------------------------------------------------- |
| No courses match applied filters                    | API returns empty array                | "No courses match your filters. Try adjusting your search." + "Clear Filters" button   |
| Course image fails to load                          | img onerror triggers placeholder image | Placeholder displayed — no broken image icon                                           |
| Booking form submitted with missing required fields | Frontend validation blocks submission  | Inline error per invalid field                                                         |
| Booking inquiry rate limit exceeded (5/hr per IP)   | API returns 429                        | "Too many requests. Please try again later."                                           |
| Schedule export email is invalid format             | Frontend validation blocks submission  | "Please enter a valid email address."                                                  |
| Schedule export rate limit exceeded                 | API returns 429                        | "You have already requested the schedule. Please check your inbox or try again later." |
| CV upload exceeds 5MB                               | Frontend size check blocks upload      | "File is too large. Please upload a file smaller than 5MB."                            |
| CV upload is wrong file type                        | Frontend MIME check blocks upload      | "Please upload a PDF or Word document only."                                           |
| Booking email delivery fails all retries            | Booking saved in DB; error logged      | User already saw success message; admin can follow up manually                         |
| Network failure during form submission              | fetch() catches network error          | Toast: "Connection error. Please check your internet and try again."                   |
| Admin JWT expires mid-session                       | Refresh token called automatically     | Session continues transparently                                                        |
| Admin refresh token expired                         | Redirect to /admin/login               | "Your session has expired. Please log in again."                                       |
| Course slug does not exist                          | API returns 404                        | Custom 404 page with link back to catalog                                              |
| Database connection failure                         | Express error middleware returns 503   | "Service temporarily unavailable. Please try again shortly."                           |

---

### API Design — High Level

#### Public Endpoints

| Method | Endpoint                     | Description                                   |
| ------ | ---------------------------- | --------------------------------------------- |
| GET    | /api/v1/courses              | List published courses (filters + pagination) |
| GET    | /api/v1/courses/:slug        | Get single course by slug                     |
| GET    | /api/v1/categories           | List all categories with subcategories        |
| GET    | /api/v1/countries            | List all countries                            |
| GET    | /api/v1/cities?country_id=   | List cities by country                        |
| GET    | /api/v1/workshops            | List published workshops                      |
| GET    | /api/v1/workshops/:slug      | Get single workshop by slug                   |
| POST   | /api/v1/bookings             | Submit course booking inquiry                 |
| POST   | /api/v1/schedule/request     | Request schedule export via email             |
| POST   | /api/v1/trainer-applications | Submit trainer application with CV upload     |
| POST   | /api/v1/contact              | Submit contact form                           |
| POST   | /api/v1/newsletter/subscribe | Subscribe to newsletter                       |
| GET    | /sitemap.xml                 | Auto-generated sitemap                        |

#### Admin Endpoints (all protected by authMiddleware)

| Method | Endpoint                           | Description                                                   |
| ------ | ---------------------------------- | ------------------------------------------------------------- |
| POST   | /api/v1/admin/auth/login           | Admin login — returns JWT                                     |
| POST   | /api/v1/admin/auth/refresh         | Refresh access token                                          |
| POST   | /api/v1/admin/auth/logout          | Invalidate refresh token                                      |
| GET    | /api/v1/admin/courses              | List all courses including unpublished                        |
| POST   | /api/v1/admin/courses              | Create new course                                             |
| PUT    | /api/v1/admin/courses/:id          | Update course                                                 |
| DELETE | /api/v1/admin/courses/:id          | Delete course                                                 |
| GET    | /api/v1/admin/categories           | List categories                                               |
| POST   | /api/v1/admin/categories           | Create category                                               |
| PUT    | /api/v1/admin/categories/:id       | Update category                                               |
| DELETE | /api/v1/admin/categories/:id       | Delete category                                               |
| GET    | /api/v1/admin/workshops            | List workshops                                                |
| POST   | /api/v1/admin/workshops            | Create workshop                                               |
| PUT    | /api/v1/admin/workshops/:id        | Update workshop                                               |
| DELETE | /api/v1/admin/workshops/:id        | Delete workshop                                               |
| GET    | /api/v1/admin/bookings             | List all booking inquiries                                    |
| GET    | /api/v1/admin/bookings/:id         | Get single booking inquiry details                            |
| PATCH  | /api/v1/admin/bookings/:id/status  | Update booking status (pending/contacted/confirmed/cancelled) |
| GET    | /api/v1/admin/trainer-applications | List trainer applications                                     |
| GET    | /api/v1/admin/contact-messages     | List contact messages                                         |
| PATCH  | /api/v1/admin/contact-messages/:id | Mark message as read                                          |
| GET    | /api/v1/admin/newsletter           | List newsletter subscribers                                   |
| GET    | /api/v1/admin/schedule-requests    | List schedule email requests                                  |

---

### Data Model

#### courses

| Field          | Type      | Notes              |
| -------------- | --------- | ------------------ |
| id             | UUID      | Primary key        |
| title_en       | VARCHAR   | Required           |
| title_ar       | VARCHAR   | Required           |
| description_en | TEXT      | Required           |
| description_ar | TEXT      | Required           |
| category_id    | UUID (FK) | → categories.id    |
| subcategory_id | UUID (FK) | → subcategories.id |
| country_id     | UUID (FK) | → countries.id     |
| city_id        | UUID (FK) | → cities.id        |
| start_date     | DATE      | Required           |
| duration_days  | INTEGER   | Required           |
| price          | DECIMAL   | Optional           |
| image_url      | VARCHAR   | S3/R2 URL          |
| slug           | VARCHAR   | Unique, URL-safe   |
| is_published   | BOOLEAN   | Default: false     |
| created_at     | TIMESTAMP | Auto               |
| updated_at     | TIMESTAMP | Auto               |

#### booking_inquiries

| Field           | Type      | Notes                                       |
| --------------- | --------- | ------------------------------------------- |
| id              | UUID      | Primary key                                 |
| course_id       | UUID (FK) | → courses.id                                |
| full_name       | VARCHAR   | Required                                    |
| email           | VARCHAR   | Required                                    |
| phone           | VARCHAR   | Required                                    |
| company         | VARCHAR   | Optional                                    |
| attendees_count | INTEGER   | Required, min 1                             |
| preferred_date  | DATE      | Required, pre-filled with course start_date |
| message         | TEXT      | Optional                                    |
| status          | ENUM      | pending / contacted / confirmed / cancelled |
| created_at      | TIMESTAMP | Auto                                        |

#### trainer_applications

| Field      | Type      | Notes                         |
| ---------- | --------- | ----------------------------- |
| id         | UUID      | Primary key                   |
| full_name  | VARCHAR   | Required                      |
| email      | VARCHAR   | Required                      |
| phone      | VARCHAR   | Required                      |
| expertise  | VARCHAR   | Required                      |
| message    | TEXT      | Optional                      |
| cv_url     | VARCHAR   | S3/R2 URL                     |
| status     | ENUM      | pending / reviewed / rejected |
| created_at | TIMESTAMP | Auto                          |

#### schedule_requests

| Field        | Type      | Notes                  |
| ------------ | --------- | ---------------------- |
| id           | UUID      | Primary key            |
| email        | VARCHAR   | Required               |
| requested_at | TIMESTAMP | Auto                   |
| status       | ENUM      | queued / sent / failed |
| delivered_at | TIMESTAMP | Nullable               |

---

### UX Rules — Applied Across All Features

| Rule             | Behavior                                                                               |
| ---------------- | -------------------------------------------------------------------------------------- |
| Form Validation  | All fields validate on blur; required fields show inline error immediately             |
| Loading States   | Loading skeleton shown on all data-fetching operations before content renders          |
| Error States     | API errors display a red toast notification, auto-dismisses after 5 seconds            |
| Success Feedback | Successful form submissions display a green toast, auto-dismisses after 4 seconds      |
| Empty States     | All list views show an illustrated empty state with a descriptive message              |
| RTL Consistency  | All form inputs, dropdowns, modals, and toasts mirror correctly in RTL mode            |
| Image Fallback   | All course and workshop images have a fallback placeholder on load failure             |
| Disabled States  | Dependent dropdowns (subcategory, city) are visually disabled until parent is selected |
| Booking Form     | Preferred date pre-fills with course start date but remains editable by user           |

---

## Section 12 — Success Metrics and KPIs

| Category  | Metric                                | Target                | Measurement Method                               | Owner        |
| --------- | ------------------------------------- | --------------------- | ------------------------------------------------ | ------------ |
| Business  | Monthly organic sessions              | ≥ 500 in month 1      | Google Analytics / Search Console                | Marketing    |
| Business  | Booking inquiries submitted           | ≥ 30 per month        | booking_inquiries table count — status any       | PM           |
| Business  | Booking inquiry to contact rate       | ≥ 70%                 | booking_inquiries: contacted + confirmed / total | Aziza        |
| Business  | Trainer applications received         | ≥ 5 in first 60 days  | Admin dashboard — applications count             | PM           |
| Product   | Schedule export email completion rate | ≥ 80%                 | schedule_requests: sent / total                  | Backend Dev  |
| Product   | Booking form completion rate          | ≥ 60% of form opens   | GA4 event: booking_submitted / booking_form_open | Frontend Dev |
| Product   | Newsletter subscription rate          | ≥ 5% of visitors      | newsletter_subscribers / total sessions          | Marketing    |
| Technical | API response time                     | < 500ms (p95)         | Server logs / APM tool                           | Backend Dev  |
| Technical | Page load time (LCP)                  | < 2.5s on desktop     | Lighthouse / Core Web Vitals                     | Frontend Dev |
| Technical | Lighthouse SEO score                  | ≥ 90 on all key pages | Lighthouse CI in GitHub Actions                  | Frontend Dev |
| Technical | Booking + schedule email delivery     | ≥ 99% success rate    | BullMQ job stats: completed / total              | Backend Dev  |
| Technical | API error rate                        | < 0.1%                | Server logs — 5xx / total requests               | Backend Dev  |
| UX        | Mobile bounce rate                    | < 50%                 | Google Analytics — mobile segment                | Frontend Dev |

**Tracking Tool:** Google Analytics 4 + Google Search Console
**Review Cadence:** 1 week post-launch, 2 weeks post-launch, 30 days post-launch
**Owner:** Aziza coordinates review with dev leads

---

## Section 13 — Timeline and Milestones

**Start Date:** 2026-04-12
**Target Launch Date:** 2026-08-02
**Total Duration:** 16 weeks

| Milestone               | Description                                                     | Due Date   | Status | Owner        |
| ----------------------- | --------------------------------------------------------------- | ---------- | ------ | ------------ |
| Project Kickoff         | Team assembled, environments set up, PRD approved               | 2026-04-12 | TODO   | Aziza        |
| PRD v1.1 Approved       | Stakeholder sign-off on updated PRD including booking system    | 2026-04-19 | TODO   | Aziza        |
| Phase 1 Complete        | Infrastructure, CI/CD, multilingual routing live on staging     | 2026-04-26 | TODO   | Frontend Dev |
| Design Mockups Approved | UI mockups reviewed and approved by Aziza                       | 2026-05-03 | TODO   | Designer     |
| Phase 2 Complete        | All 9 public pages + booking form UI live on staging in AR + EN | 2026-05-24 | TODO   | Full Team    |
| Phase 3 Complete        | Admin dashboard, booking email system, schedule export live     | 2026-06-21 | TODO   | Backend Dev  |
| Internal QA Pass        | Full QA on all P0 and P1 features including booking flow        | 2026-07-05 | TODO   | QA           |
| Stakeholder UAT         | Aziza reviews and approves booking inquiry flow on staging      | 2026-07-19 | TODO   | Aziza        |
| Phase 4 Complete        | SEO audit, performance optimization, accessibility done         | 2026-07-26 | TODO   | Full Team    |
| Beta Launch             | Soft launch on production domain for internal review            | 2026-07-26 | TODO   | Aziza        |
| Public Launch           | DNS live, production deployment, sitemap submitted              | 2026-08-02 | TODO   | Full Team    |

---

## Section 14 — Risk Register

| ID   | Description                                      | Likelihood | Impact | Score | Mitigation                                                             | Owner        |
| ---- | ------------------------------------------------ | ---------- | ------ | ----- | ---------------------------------------------------------------------- | ------------ |
| R-01 | Arabic translations delivered late               | High       | High   | 9     | Request all translations by end of Phase 1; use placeholder EN content | Aziza        |
| R-02 | Scope creep mid-build                            | Medium     | High   | 6     | Enforce MoSCoW strictly; all new requests deferred to v2 backlog       | Aziza        |
| R-03 | Email delivery failure (SendGrid / SMTP)         | Medium     | High   | 6     | Spike email integration in Phase 1; test with real credentials early   | Backend Dev  |
| R-04 | Owner email not provided before Phase 3          | Medium     | High   | 6     | Collect owner notification email address by end of Phase 2             | Aziza        |
| R-05 | Course image assets not provided on time         | High       | Medium | 6     | Use placeholder images; admin can self-serve via image upload          | Designer     |
| R-06 | Booking inquiry spam / abuse                     | Medium     | Medium | 4     | Rate limiting (5/hr per IP); CAPTCHA considered for v2                 | Backend Dev  |
| R-07 | SSR performance issues with Nuxt.js              | Low        | High   | 3     | Use ISR for catalog pages; spike in Phase 1                            | Frontend Dev |
| R-08 | Key person dependency — single dev per domain    | Medium     | Medium | 4     | Document all architecture decisions; maintain up-to-date README        | All          |
| R-09 | Third-party service outage (S3, SendGrid, Redis) | Low        | Medium | 2     | Managed services with SLAs; retry logic and graceful degradation       | Backend Dev  |
| R-10 | SEO expectations not met at launch               | Medium     | Medium | 4     | Lighthouse CI on every deploy; fix regressions before Phase 4 ends     | Frontend Dev |

_Score = Likelihood × Impact (High=3, Medium=2, Low=1)_

---

## Section 15 — Stakeholders and Approvals

### Stakeholders

| Name  | Role               | Involvement                                                                  | Contact |
| ----- | ------------------ | ---------------------------------------------------------------------------- | ------- |
| Aziza | Owner / PM         | Final approvals, content sign-off, UAT, launch decision, booking owner email | [TBD]   |
| [TBD] | Frontend Developer | Nuxt.js, UI, SEO, i18n, booking form implementation                          | [TBD]   |
| [TBD] | Backend Developer  | Express.js API, DB, booking email system, admin dashboard                    | [TBD]   |
| [TBD] | UI/UX Designer     | Mockups, design system, booking form UX, responsive layouts                  | [TBD]   |
| [TBD] | QA Engineer        | Test plans, regression testing, booking flow UAT support                     | [TBD]   |

### Approval Gates

| Gate                 | Approver | Required By | Status  |
| -------------------- | -------- | ----------- | ------- |
| PRD v1.1 Sign-off    | Aziza    | 2026-04-19  | Pending |
| Design Mockups       | Aziza    | 2026-05-03  | Pending |
| Phase 2 Staging Demo | Aziza    | 2026-05-24  | Pending |
| Phase 3 Staging Demo | Aziza    | 2026-06-21  | Pending |
| Booking Flow UAT     | Aziza    | 2026-07-19  | Pending |
| Production Launch    | Aziza    | 2026-08-02  | Pending |

---

## Section 16 — References and Links

| Resource               | Link / Location        |
| ---------------------- | ---------------------- |
| Design Files (Figma)   | [TBD]                  |
| Repository             | [TBD]                  |
| API Documentation      | [TBD]                  |
| Architecture Diagram   | [TBD]                  |
| Staging Environment    | [TBD]                  |
| Production Environment | [TBD]                  |
| CI/CD Pipeline         | GitHub Actions — [TBD] |
| Monitoring Dashboard   | UptimeRobot — [TBD]    |
| Google Search Console  | [TBD]                  |
| SendGrid Account       | [TBD]                  |
| AWS S3 / Cloudflare R2 | [TBD]                  |
| Related PRDs           | None — initial project |
| Slack Channel          | [TBD]                  |
| Meeting Notes          | [TBD]                  |

---

## Section 17 — Revision History

| Version | Date       | Author | Changes                                                                 |
| ------- | ---------- | ------ | ----------------------------------------------------------------------- |
| v1.0    | 2026-04-12 | Aziza  | Initial PRD created                                                     |
| v1.1    | 2026-04-12 | Aziza  | Added Course Booking Inquiry System (P0-F009) — email-based, no payment |
```
