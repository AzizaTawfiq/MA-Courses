# Feature Specification: MA Training Platform

**Feature Branch**: `001-ma-training-platform`
**Created**: 2026-04-12
**Status**: Draft
**Input**: User description: "Build a modern multilingual corporate training website for MA Training
that allows professionals and HR managers to browse, search, and filter training courses by
category, city, and date. Users can view full course details and submit a booking inquiry that
notifies the MA Training team by email with no online payment involved. Users can also request the
full training schedule and receive it as an Excel file in their inbox automatically. The website
supports Arabic and English with full RTL layout switching. A back-office admin dashboard allows
the MA Training team to manage all courses, categories, workshops, cities, and incoming leads
including booking inquiries, trainer applications, contact messages, and newsletter subscribers
without any developer involvement."

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Course Discovery & Browsing (Priority: P1)

A corporate professional or HR manager lands on the MA Training website and needs to find a
training course relevant to their team. They browse the courses catalog, apply filters by category,
city, and date range, and open a course detail page to read the full description, schedule,
instructor profile, and any prerequisites before deciding to inquire.

**Why this priority**: This is the primary value proposition of the platform. Without the ability
to discover and explore courses, no other user journey is possible. It is the top-of-funnel
experience that drives all downstream conversions.

**Independent Test**: A visitor can arrive at the homepage, navigate to the courses listing,
apply one or more filters (category, city, date), and open a course detail page — all without
signing in or completing any form.

**Acceptance Scenarios**:

1. **Given** a visitor is on the homepage, **When** they click the courses section in navigation,
   **Then** they see a paginated catalog of available courses with title, category, city, date
   preview, and a call-to-action.

2. **Given** a visitor is on the courses listing page, **When** they select a category filter,
   **Then** only courses in that category are displayed and the active filter is visually indicated.

3. **Given** a visitor applies city and date filters together, **When** the results update,
   **Then** only courses matching ALL selected filters are shown and a count of results is
   displayed.

4. **Given** a visitor searches by keyword, **When** they type a word matching a course title or
   description, **Then** matching courses appear and the search term is highlighted in results.

5. **Given** a visitor opens a course detail page, **When** the page loads, **Then** they see:
   full course description, learning outcomes, target audience, schedule/dates, instructor name
   and brief bio, location/city, and a prominent booking inquiry call-to-action.

6. **Given** the active locale is Arabic, **When** any page in the courses section loads,
   **Then** all text is displayed in Arabic, layout flows right-to-left, and the URL reflects
   the Arabic locale prefix.

---

### User Story 2 — Course Booking Inquiry (Priority: P1)

A visitor who has identified a course they are interested in submits a booking inquiry form on
the course detail page. They provide their name, company, email, phone, and an optional message.
Upon submission, they receive a confirmation message on screen, and both the visitor and the MA
Training team receive email notifications.

**Why this priority**: The booking inquiry is the primary conversion action and the direct source
of business leads for MA Training. This flow must work flawlessly every time.

**Independent Test**: A visitor can complete and submit the inquiry form on a course detail page.
After submission, the MA Training team receives an email with the inquiry details, and the visitor
sees a confirmation message — verifiable without any admin login.

**Acceptance Scenarios**:

1. **Given** a visitor is on a course detail page, **When** they click the booking inquiry button,
   **Then** a form appears requesting: full name, company name, email address, phone number,
   number of attendees, and an optional message.

2. **Given** a visitor submits a valid inquiry form, **When** the system processes the submission,
   **Then** the visitor sees an on-screen confirmation that their inquiry was received, with an
   indication that the team will contact them shortly.

3. **Given** a valid inquiry is submitted, **When** the system processes it, **Then** the MA
   Training team receives an email notification containing: visitor name, company, email, phone,
   number of attendees, optional message, course name, and submission timestamp.

4. **Given** a valid inquiry is submitted, **When** the system processes it, **Then** the visitor
   receives a confirmation email in the language they were browsing (Arabic or English) acknowledging
   receipt and summarizing the course they inquired about.

5. **Given** a visitor submits the form with a missing required field, **When** they attempt to
   submit, **Then** the form displays an inline error adjacent to the missing field and does not
   submit.

6. **Given** a visitor submits the same inquiry for the same course within 60 seconds of a prior
   submission, **When** the duplicate arrives, **Then** the visitor still sees a confirmation
   message but only one inquiry record is created and only one set of emails is sent.

---

### User Story 3 — Training Schedule Export by Email (Priority: P2)

A visitor on the Schedule page wants the full training schedule for future planning. They enter
their name and email address and request the schedule. The system generates the complete schedule
as an Excel file and sends it to their inbox automatically.

**Why this priority**: This is a lead-capture tool that also serves a practical operational need.
It reduces manual effort for the MA Training team and generates a qualified email list. It depends
on the course catalog (US1) being complete.

**Independent Test**: A visitor can submit the schedule export form with their name and email.
They receive an email with an attached Excel file containing the full course schedule — verifiable
without any admin interaction.

**Acceptance Scenarios**:

1. **Given** a visitor is on the Schedule page, **When** they view the page, **Then** they see
   a high-level summary of upcoming courses/workshops and a form to request the full schedule
   by email.

2. **Given** a visitor submits their name and email on the schedule request form, **When** the
   system processes the request, **Then** the visitor sees a confirmation that the schedule will
   be sent to their inbox shortly.

3. **Given** a schedule request is submitted, **When** the system generates the export, **Then**
   the visitor receives an email with the full training schedule attached as an `.xlsx` Excel
   file, formatted with course title, category, city, dates, and duration.

4. **Given** no upcoming sessions exist in the schedule, **When** the export is generated,
   **Then** the visitor receives an email informing them that no sessions are currently scheduled
   and inviting them to check back later.

5. **Given** a visitor requests the schedule in the Arabic locale, **When** the email is delivered,
   **Then** the email subject, body, and Excel column headers are in Arabic.

---

### User Story 4 — Multilingual Experience with RTL Switching (Priority: P2)

A visitor switches the website language between English (left-to-right) and Arabic (right-to-left).
All content — navigation, headings, body text, form labels, and error messages — switches to the
selected language, and the entire layout mirrors to reflect the correct text direction.

**Why this priority**: Arabic-first bilingual support is a core differentiator of MA Training in
the MENA market. It must be a first-class, seamless experience for every user.

**Independent Test**: A visitor can toggle the language switcher at any point while navigating the
site. The page immediately displays all visible text in the selected language and the layout
direction changes — verifiable on any public page.

**Acceptance Scenarios**:

1. **Given** a visitor arrives on the website, **When** the page loads, **Then** the language
   (Arabic or English) is pre-selected based on either their previously saved preference or their
   browser's language setting.

2. **Given** a visitor clicks the language switcher in the header, **When** they select Arabic,
   **Then** all text switches to Arabic, the layout mirrors to right-to-left, and the URL
   updates to reflect the Arabic locale prefix (e.g., `/ar/`).

3. **Given** a visitor switches from Arabic to English, **When** the switch is made, **Then**
   the layout returns to left-to-right and all text displays in English — the visitor stays
   on the equivalent page in the new locale.

4. **Given** a visitor is filling out the booking inquiry form in Arabic, **When** they switch
   to English mid-form, **Then** the form labels and validation messages switch to English and
   any already-entered text is preserved.

---

### User Story 5 — Admin Content Management (Priority: P1)

A member of the MA Training team logs in to the admin dashboard and manages all published content:
adding, editing, archiving, and reordering courses, workshops, categories, and cities. All changes
are reflected on the public website immediately without requiring a developer.

**Why this priority**: The admin's ability to self-manage content is the operational independence
goal of the project. Without it, every content change requires developer intervention — directly
contradicting the business case.

**Independent Test**: An admin can log in, create a new course with full bilingual content
(Arabic + English), and see that course appear on the public courses listing page — verifiable
without any code changes.

**Acceptance Scenarios**:

1. **Given** an admin navigates to the admin dashboard login, **When** they enter valid
   credentials, **Then** they are granted access to the dashboard and invalid credentials
   display a clear error message.

2. **Given** an admin is logged in, **When** they create a new course with both Arabic and
   English title, description, category, city, dates, and instructor, **Then** the course
   appears on the public courses listing in both languages.

3. **Given** an admin edits an existing course, **When** they save changes, **Then** the
   updated course details are immediately reflected on the public course detail page.

4. **Given** an admin archives a course, **When** the action is confirmed, **Then** the course
   is removed from the public listing but its data and associated inquiries remain accessible
   in the admin dashboard.

5. **Given** an admin manages categories, **When** they add a new category with Arabic and
   English names, **Then** the category appears in the public courses filter and in the admin
   course creation form.

6. **Given** an admin manages cities, **When** they add, edit, or deactivate a city, **Then**
   the courses filter on the public site reflects the change on next page load.

7. **Given** an admin manages workshops, **When** they create a workshop with bilingual content
   and schedule, **Then** the workshop appears on the public Workshops page.

---

### User Story 6 — Admin Lead Management (Priority: P2)

An admin logs in to the dashboard to review and manage all incoming leads: booking inquiries
from the booking form, trainer applications from the Become a Trainer page, messages from the
Contact page, and newsletter subscribers. The admin can view, filter, mark as handled, and
export this data without developer involvement.

**Why this priority**: Lead management is the operational core of the admin dashboard. The
booking inquiry and email flows (US2) generate the data; this story makes that data actionable
for the MA Training team.

**Acceptance Scenarios**:

1. **Given** an admin views the Booking Inquiries section, **When** the page loads, **Then**
   they see a filterable, sortable table of all inquiries with: submitter name, company, course,
   submission date, and status (new / in progress / handled).

2. **Given** an admin opens a specific booking inquiry, **When** viewing the detail, **Then**
   they see all submitted fields, the course name, and a status update control.

3. **Given** an admin views the Trainer Applications section, **When** the list loads,
   **Then** they see all submitted applications with: applicant name, email, area of expertise,
   submission date, and status.

4. **Given** an admin views Contact Messages, **When** the list loads, **Then** they see
   all messages with: sender name, email, subject, preview, and submission date.

5. **Given** an admin views Newsletter Subscribers, **When** the list loads, **Then** they
   see all subscribers with email, name, language preference, and subscription date. The admin
   can export the subscriber list.

6. **Given** an admin applies a status filter on the inquiries list, **When** the filter is
   applied, **Then** only inquiries matching that status are displayed.

---

### Edge Cases

- What happens when a user submits the booking inquiry form while offline or with a network error
  mid-submission? The system must not lose data on retry.
- What happens when the schedule export generates a very large Excel file (500+ courses)?
  The email must still be delivered within the expected timeframe.
- What happens when an admin deletes a category that has courses assigned to it? The system must
  prevent deletion and display a clear warning.
- What happens when a visitor navigates directly to an Arabic URL in an English browser (or vice
  versa)? The locale in the URL must take precedence.
- What happens when a trainer application contains file attachments (e.g., CV)? The system must
  define an acceptable file handling policy.
- What happens when an admin accidentally archives the wrong course? They must be able to
  restore it from within the admin dashboard.

---

## Requirements *(mandatory)*

### Functional Requirements

**Public Website — Course Catalog**

- **FR-001**: The system MUST display a paginated catalog of courses on the Courses Listing page,
  showing title, category, city, date preview, and a call-to-action per course card.
- **FR-002**: The system MUST allow visitors to filter the course catalog by one or more of:
  category, city, and date range — simultaneously.
- **FR-003**: The system MUST allow visitors to search courses by keyword matching course title
  and/or description.
- **FR-004**: The system MUST display a full course detail page containing: description, learning
  outcomes, target audience, schedule/dates, instructor name and bio, city/location, and a booking
  inquiry call-to-action.
- **FR-005**: The system MUST display a Workshops page listing all available workshops separately
  from the regular course catalog.
- **FR-006**: The system MUST display a Schedule page showing all upcoming course and workshop
  sessions with a schedule-by-email request form.

**Public Website — Booking Inquiry**

- **FR-007**: The system MUST present a booking inquiry form collecting: full name (required),
  company name (required), email address (required), phone number (required), number of attendees
  (required), and message (optional).
- **FR-008**: The system MUST validate all required fields server-side before recording the
  inquiry, regardless of client-side validation state.
- **FR-009**: The system MUST persist the inquiry record before dispatching any email notification.
- **FR-010**: The system MUST send an email notification to the MA Training team within 2 minutes
  of a valid inquiry submission, containing all submitted fields and the course name.
- **FR-011**: The system MUST send a confirmation email to the submitter in their browsing
  language within 2 minutes of submission.
- **FR-012**: The system MUST deduplicate submissions from the same email address for the same
  course within a 60-second window.

**Public Website — Schedule Export**

- **FR-013**: The system MUST provide a schedule export form on the Schedule page, collecting
  the visitor's name and email address.
- **FR-014**: The system MUST generate a complete training schedule as an `.xlsx` Excel file
  server-side and deliver it to the requested email within 2 minutes.
- **FR-015**: The Excel file MUST include: course title, category, city, session dates, and
  duration — in the locale of the requesting visitor.
- **FR-016**: If no sessions are currently scheduled, the system MUST send an informational
  email (not an empty or error file).

**Public Website — Multilingual & Lead Forms**

- **FR-017**: The system MUST support Arabic (RTL) and English (LTR) with a visible language
  switcher in the site header, accessible on every page.
- **FR-018**: All public pages MUST have locale-specific URLs (e.g., `/ar/courses`,
  `/en/courses`) and hreflang tags for SEO.
- **FR-019**: The Become a Trainer page MUST include a form collecting: name, email, phone,
  area of expertise, years of experience, and a brief bio or CV upload.
- **FR-020**: The Contact page MUST include a form collecting: name, email, subject, and message,
  and MUST send the submission to the MA Training team by email.
- **FR-021**: The website MUST include a newsletter subscription widget collecting name and email,
  available on multiple pages.

**Admin Dashboard — Content Management**

- **FR-022**: The admin dashboard MUST require authenticated login with secure session management.
- **FR-023**: Admins MUST be able to create, edit, archive, and restore Courses, including all
  bilingual fields (Arabic + English titles, descriptions, learning outcomes).
- **FR-024**: Admins MUST be able to create, edit, and deactivate Categories with Arabic and
  English names.
- **FR-025**: Admins MUST be able to create, edit, and deactivate Cities with Arabic and English
  names.
- **FR-026**: Admins MUST be able to create, edit, archive, and restore Workshops with bilingual
  content.
- **FR-027**: All admin destructive actions (archive, delete) MUST require an explicit
  confirmation step before executing.
- **FR-028**: The system MUST prevent deletion of a category or city that has active courses
  assigned to it, displaying a clear error message.

**Admin Dashboard — Lead Management**

- **FR-029**: Admins MUST be able to view, filter by status, and update the status of all
  booking inquiries (new / in progress / handled).
- **FR-030**: Admins MUST be able to view all trainer applications with status management.
- **FR-031**: Admins MUST be able to view all contact form messages.
- **FR-032**: Admins MUST be able to view and export the newsletter subscriber list.
- **FR-033**: The email delivery status of each booking inquiry notification (pending / sent /
  failed) MUST be visible in the inquiry detail view.

### Key Entities

- **Course**: Bilingual title and description, learning outcomes, target audience, category,
  city, instructor, session dates, status (active / archived)
- **Workshop**: Similar to Course but displayed in a separate section; may have different
  structural fields (duration format, group size)
- **Category**: Bilingual name, display order, active flag
- **City**: Bilingual name, active flag
- **Instructor**: Name, short bio (bilingual), optional photo
- **CourseSession**: Specific date(s) and time(s) for a Course or Workshop
- **BookingInquiry**: Submitter details, linked Course, message, status, submission timestamp,
  email delivery status
- **ScheduleExportRequest**: Email, name, locale, status, generation timestamp
- **TrainerApplication**: Applicant name, email, phone, expertise, experience, bio, CV reference,
  status, submission timestamp
- **ContactMessage**: Sender name, email, subject, message body, submission timestamp
- **NewsletterSubscriber**: Email, name, language preference, subscription date, active flag

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A visitor can navigate from the homepage to a filtered list of relevant courses
  in under 3 clicks.
- **SC-002**: A visitor can complete and submit a booking inquiry form in under 2 minutes from
  first opening the form.
- **SC-003**: The MA Training team receives a booking inquiry email notification within 2 minutes
  of form submission, 100% of the time under normal operating conditions.
- **SC-004**: The schedule Excel file is delivered to the requesting visitor's inbox within
  2 minutes of form submission, 100% of the time under normal operating conditions.
- **SC-005**: All public pages render correctly in both Arabic (RTL) and English (LTR) with no
  visual layout breakage.
- **SC-006**: An admin can add a new course and see it published on the public site within
  1 minute of saving, with no developer involvement.
- **SC-007**: An admin can locate any specific booking inquiry by filtering and open its detail
  view within 30 seconds from the inquiries list.
- **SC-008**: All key public pages achieve a Lighthouse SEO score of 90 or higher.
- **SC-009**: All public pages pass automated accessibility checks with no critical violations.
- **SC-010**: The platform handles the complete booking inquiry flow — from form submission to
  email delivery to admin visibility — with zero data loss under normal operating conditions.

---

## Assumptions

- Admin authentication uses a simple username/password login with secure session management;
  social login or SSO is out of scope for v1.
- The admin dashboard has a single admin role; fine-grained role-based access (e.g., content
  editor vs. lead manager) is out of scope for v1.
- The Become a Trainer form accepts CV/bio as a text field (optional) in v1; file upload (PDF)
  is a nice-to-have and may be included if technically feasible without blocking delivery.
- Course pricing is informational only (displayed as a range or "contact for pricing"); no
  pricing engine or quote calculator is required in v1.
- The newsletter subscription does not integrate with an external email marketing platform (e.g.,
  Mailchimp) in v1; subscribers are stored in the platform database and exportable as CSV.
- Instructors are managed by admins; there is no instructor self-service portal in v1.
- Payment processing is explicitly out of scope — the booking inquiry is the only conversion
  mechanism; no shopping cart or invoicing is required.
- The platform will be hosted with a deployment environment capable of running server-side
  rendering; static hosting alone is insufficient.
- Existing MA Training course content will be provided by the client as a data dump or entered
  manually via the admin dashboard before launch; data migration scripting is out of scope.
- Email delivery relies on a third-party transactional email service configured by the development
  team; email template design is part of the development scope.
