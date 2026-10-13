# Campus Website — Full Content and Development Specification

Version: 1.0 | Prepared: 13 October 2026

Purpose: A build-ready brief for an education/campus website inspired by the information structure of the client's reference. This document defines pages, content, functionality, data, administration and delivery checks. Visual design, colours, typography and mockups are outside this brief.

## 1. Scope and assumptions

- Working institution name: `[CAMPUS_NAME]`. Replace all bracketed placeholders before publication.
- Proposed scope: public marketing website, course catalogue, admissions information, online application intake, enquiries and a staff CMS.
- International and domestic student content is supported. Hide either branch if the client serves only one audience.
- The campus country, qualifications, accreditation and actual admissions process are unconfirmed. Australian-specific information is conditional, not a statement that this client is an Australian provider.
- A submitted application is a request for admissions review. It does not automatically create an enrolment, offer, visa document or payment obligation.
- Student learning, timetables, attendance, grades, finance ERP and an LMS are separate systems. Phase 1 can link to existing systems; developing them requires additional scope.
- All content and functionality below is a proposed specification unless explicitly labelled as a reference observation.

### Reference review and limits

Reviewed reference pages:

1. International home: https://www.thecentreofexcellence.com.au/international/
2. About: https://www.thecentreofexcellence.com.au/international/about-us/
3. Example course: https://www.thecentreofexcellence.com.au/international/bsb50120-diploma-of-business/
4. Support: https://www.thecentreofexcellence.com.au/international/student-services/

Observed structure: course discovery, admissions/intake information, institution profile, campus information, support contacts, news, resources and contact/application entry points. The sample course presents a description, units, prior-learning information, prerequisites, fee guidance, duration, campuses and related study. These are structural observations only. The application link could not be retrieved during review; the application workflow specified here is an original proposal. This is not a complete crawl or a verified description of the reference's backend.

Use original client content. Do not reuse the reference institution's text, identity, contact information, registration numbers, photographs or partnership claims.

## 2. Goals, audiences and core journeys

Goals: explain the institution, help visitors choose a suitable course, explain eligibility and costs, generate qualified enquiries, receive applications, and let staff keep information current.

| Audience | Main need | Main journey |
| --- | --- | --- |
| Prospective student | Compare study options | Home → Courses → Course → Entry requirements → Apply |
| International applicant | Understand overseas study | International → Requirements/fees → Course → Apply |
| Domestic applicant | Find local eligibility and fees | Domestic → Courses → Apply |
| Parent/sponsor | Understand costs and support | Fees → Campuses → Student support → Contact |
| Current student | Find help and documents | Student resources → Support/downloads/portal |
| Education agent | Guide an applicant | Agents → Application process → Agent enquiry |
| Admissions staff | Review and follow up | Admin → Applications → Review → Status update |
| Content staff | Maintain accurate information | Admin → Content → Preview → Publish |

## 3. Navigation and shared content

Main navigation: About, Courses, Admissions, International, Student Life, Campuses, News, Contact. Primary actions: Apply Now and Enquire. Utility links: Domestic Students, Student Portal, Downloads and Search. Show the student portal link only after its destination is confirmed.

Footer content: legal and trading names, address and contact details, quick links, campus links, approved provider/registration details where applicable, privacy, terms, policies, accessibility, social links and copyright year. Show partner logos only with client approval. Any land acknowledgement must be appropriate to the actual location and approved by the client.

Shared requirements:

- Breadcrumbs on internal pages; one clear page title.
- Context-aware enquiry/apply links preserve course, campus and student audience.
- Contact details, opening hours and footer information come from shared CMS settings.
- Public lists include useful empty states and pagination where needed.
- Draft content and expired announcements do not appear in public searches or menus.
- Include accessible text alternatives for media and downloadable file type/size labels.
- Optional multilingual publishing requires separately reviewed translations; do not silently translate entry requirements or contractual content.

## 4. Public page inventory

P1 = first release. Conditional = publish if the client offers that service/audience. P2 = later enhancement.

| Page/template | Proposed URL | Release |
| --- | --- | --- |
| Home | `/` | P1 |
| About | `/about` | P1 |
| Leadership and faculty | `/about/team` | P1 |
| Accreditation and partners | `/about/accreditation` | P1 |
| Course listing | `/courses` | P1 |
| Course category | `/courses/category/[slug]` | P1 |
| Course detail | `/courses/[slug]` | P1 |
| Admissions overview | `/admissions` | P1 |
| Entry requirements | `/admissions/entry-requirements` | P1 |
| Fees and payment information | `/admissions/fees` | P1 |
| Intakes | `/admissions/intakes` | P1 |
| Scholarships | `/admissions/scholarships` | Conditional |
| Credit transfer and prior learning | `/admissions/credit-transfer` | Conditional |
| Application form | `/apply` | P1 |
| Application confirmation | `/apply/confirmation` | P1, private response |
| International overview | `/international` | Conditional |
| Before arrival | `/international/pre-arrival` | Conditional |
| Living and studying locally | `/international/living-and-studying` | Conditional |
| Education agents | `/international/agents` | Conditional |
| Domestic overview | `/domestic` | Conditional |
| Student life | `/student-life` | P1 |
| Student support | `/student-support` | P1 |
| Orientation | `/student-support/orientation` | P1 |
| Student resources | `/student-resources` | P1 |
| Downloads | `/downloads` | P1 |
| Policies index | `/policies` | P1 |
| Policy detail | `/policies/[slug]` | P1 |
| FAQs | `/faq` | P1 |
| Campus listing | `/campuses` | P1 |
| Campus detail | `/campuses/[slug]` | P1 |
| News listing/detail | `/news`, `/news/[slug]` | P1 |
| Events listing/detail | `/events`, `/events/[slug]` | P1 |
| Gallery | `/gallery` | P1 |
| Contact | `/contact` | P1 |
| Enquiry | `/enquire` | P1 |
| Search | `/search?q=...` | P1 |
| Privacy, terms, accessibility | `/privacy`, `/terms`, `/accessibility` | P1 |
| Page not found | Unmatched paths return HTTP 404 | P1 |
| Applicant account/status portal | `/applicant/...` | P2 |

Dynamic routes are reusable templates, not separately coded pages for every course or campus. The inventory contains proposed additions beyond the pages reviewed on the reference.

## 5. Detailed page content briefs

### 5.1 Home

Purpose: explain the institution and lead visitors to courses or admissions.

Sections, in order:

1. Institution introduction: `[CAMPUS_NAME]`, a client-approved positioning sentence, and course/apply actions.
2. Course search: keyword, study area, qualification, campus and student audience.
3. Study areas: published categories with short descriptions and course counts.
4. Featured courses: title, qualification, campus, duration and detail link.
5. Why study here: 3–6 supported benefits; no invented rankings or employment figures.
6. Admissions summary: choose course, check requirements, submit application, admissions review, follow instructions.
7. Upcoming intakes: course, campus, date, deadline and availability.
8. Campus overview: location descriptions and detail links.
9. Student support summary and student-life links.
10. Approved testimonials and partner information, if available.
11. Latest published news/events and final enquiry action.

Starter copy: “Explore study opportunities at [CAMPUS_NAME]. Compare courses, review entry requirements and speak with our admissions team about your next step.”

Data: shared settings, categories, selected courses, active intakes, campuses, published articles/events and approved testimonials. If there are no testimonials or partners, omit those sections.

### 5.2 About

Sections: institution overview, history, mission, vision, values, teaching approach, learning facilities, student support, verified recognitions and links to campuses/team.

Client inputs: legal/trading names, establishment year, ownership description if public, approved history, mission/vision, accurate facts and photographs. Starter copy: “[CAMPUS_NAME] provides [APPROVED_STUDY_AREAS] education at [LOCATIONS]. Our teaching approach combines [CLIENT_CONFIRMED_METHODS] with support throughout the student journey.”

### 5.3 Leadership and faculty

List approved profiles by leadership/faculty/department. Each profile: name, role, department, short biography, confirmed qualifications, areas of expertise and approved photograph. Publish contact details only if intended for public use. Profiles can be sections on this page; separate profile pages are optional.

### 5.4 Accreditation and partners

Present verified awarding bodies, provider registrations and active partnerships. Each item needs name, relationship type, description, validity/effective dates where relevant, evidence URL and approved logo. Distinguish a teaching partnership from accreditation. Country-specific identifiers appear only when applicable and verified for this client.

### 5.5 Course listing and category pages

Catalogue fields: keyword search, category, qualification level, campus, delivery mode, student audience and available intake. Filters combine, can be cleared, survive browser navigation and are shareable in the URL. Sort by title or next intake; paginate consistently.

Each result: title, course code if applicable, short summary, qualification level, duration, delivery, campuses and View Course. Display audience-specific fees only when an approved fee record exists; otherwise “Contact admissions for current fees.” Never represent missing fees as zero.

Category pages: category introduction, suitable audience, available courses, general study pathways and enquiry action. The category description must not promise outcomes for every course.

Suggested categories for discussion only: Business, Information Technology, Engineering/Construction, Hospitality, Health, English/Language and Short Courses. Create only categories actually offered by the client.

### 5.6 Course detail — required reusable template

| Section | Required information |
| --- | --- |
| Identity | Official title, internal/external code, qualification level, category and audience |
| Summary | Plain-language overview, intended students and course purpose |
| Facts | Duration, study/holiday breakdown if relevant, mode, attendance pattern, campuses, teaching language |
| Learning outcomes | Client-approved skills and knowledge students will develop |
| Curriculum | Modules/units with code, title, core/elective classification and summary |
| Entry requirements | Academic, language, age, prerequisites and required evidence; audience differences |
| Delivery and assessment | Teaching methods, assessment types and practical components |
| Placement | Whether required, duration, prerequisites, costs and who arranges it, if applicable |
| Fees | Audience, currency, tuition basis, additional costs, effective dates, payment guidance |
| Intakes | Campus-specific dates, deadlines, open/full/closed status |
| Credit and prior learning | Availability, evidence and review process |
| Further study/careers | Approved potential pathways; distinguish eligibility from guaranteed outcomes |
| Downloads | Current brochure, handbook and linked policies |
| Actions | Apply, course enquiry and related courses |

Starter structure:

> [COURSE_TITLE] introduces students to [SUBJECT_AREA] through [CONFIRMED_LEARNING_METHODS]. Students study [MAIN_TOPICS] and complete [ASSESSMENT_SUMMARY]. Review the entry requirements, available campuses and current fees before applying.

Course rules: an application selection must reference an active course/intake/campus combination; closed intakes can accept enquiries but cannot appear as available applications. Changes to published fees must preserve historical application context. Archived courses receive an explanatory page or a relevant redirect, never an unrelated destination.

### 5.7 Admissions overview

Explain the actual process step by step: explore course → check entry requirements and intake → prepare documents → submit → staff assess and request missing information → receive outcome → complete applicable acceptance/enrolment steps → orientation. Show responsible department, approved turnaround guidance and application document checklist. Course selection and help links appear at the end.

The admissions team must confirm the final stages before launch. Do not imply that a website submission is enrolment approval.

### 5.8 Entry requirements

Provide general requirements, qualification-specific guidance, domestic/international differences, language evidence, document verification and exceptions subject to staff review. Link to exact requirements on individual courses. Use course-specific content as the authority when general guidance differs. Do not publish guessed English scores, minimum ages or qualifications.

### 5.9 Fees and payment information

Show course/audience/campus fee tables, currency, whether amounts are per unit/term/year/whole course, validity period, application/material/placement charges, instalment options and approved refund guidance. Explain how applicants receive payment instructions. Optional bank information must be supplied and approved by finance; bank-detail changes require privileged review and an audit record. Payment collection and reconciliation are P2 unless explicitly commissioned.

### 5.10 Intakes

Search by course, campus and audience. Show start date, application deadline, delivery and availability; identify the campus timezone. Do not hard-code weekly/monthly intake claims from the reference. Include course/apply/enquire links and a clear state for no upcoming dates.

### 5.11 Scholarships — conditional

For each approved scholarship: name, sponsor, value/currency, eligibility, covered expenses, exclusions, opening/closing dates, application instructions, selection process and contact. Expired opportunities remain labelled closed or are archived. Do not invent funding or eligibility.

### 5.12 Credit transfer and prior learning — conditional

Define each available process using client-approved wording. Explain eligibility, evidence, assessment steps, possible course/fee effects, decision authority, fees and appeal links. Include downloadable form or enquiry action. Final credit decisions remain with authorised academic staff.

### 5.13 International overview

Sections: international course options, entry requirements, admissions checklist, fee links, accommodation and support, pre-arrival information, agents and contact. Include official country-specific immigration/health/education links only after checking them for the actual jurisdiction. No promises of visa approval, migration eligibility or employment.

### 5.14 Pre-arrival and local living

Pre-arrival checklist: acceptance/enrolment instructions, travel preparation, required documents, accommodation planning, insurance if applicable, orientation and support contact. Local-living content: housing options, transport, estimated living expenses with source/date, banking/phone setup, safety, cultural adjustment and campus access. Costs and rules require approved current sources; do not copy figures from the reference.

### 5.15 Education agents

If the client uses agents: explain their role, show approved agents by country with name/contact/website, clarify direct applications and provide agent-enquiry instructions. An agent agreement request is separate from an approved listing. Agent accounts and applicant submission permissions are P2; phase 1 can accept an agent reference in the application.

### 5.16 Domestic overview

Explain domestic course options, eligibility, local entry requirements, fees and support. Publish funding or concession information only if approved for this provider and course. Link to courses/admissions; reuse data rather than maintaining a conflicting second course catalogue.

### 5.17 Student life

Describe confirmed clubs, activities, facilities, community opportunities and student experiences. Link to events, gallery and support. Publish only consented student stories/photos. Do not imply services exist when the client has not confirmed them.

### 5.18 Student support

Explain academic help, language/study assistance, accessibility, wellbeing, administrative support, fees enquiries and complaint routes. Use a support table: issue → team → available assistance → contact → hours → request method. State any charges or external referral limits accurately. Emergency instructions and contacts must be appropriate to the campus location; ordinary enquiry forms are not emergency channels.

### 5.19 Orientation

Include date/time/location by intake/campus, arrival instructions, documents to bring, session topics, accessibility requests, remote access if offered and coordinator contact. Link to current handbook and academic calendar. Closed orientation events must not appear as upcoming.

### 5.20 Student resources and downloads

Resources hub: handbook, calendars, forms, policies, support, existing portal/LMS and useful official links. Downloads can filter by type, audience and course. Each document needs title, purpose, format, size, language, version/effective date and owner. Public resources exclude individual student records. Retain previous versions privately and show the approved current version publicly.

### 5.21 Policies

Index and individual pages for client-approved admissions, fees/refunds, complaints/appeals, academic integrity, assessment, attendance/progression, deferral/withdrawal, accessibility and other applicable policies. Each page: policy title, version, effective date, owner, accessible text or PDF, related forms and contact. These are content requirements, not drafted legal policies.

### 5.22 FAQs

Categories: courses, eligibility, applications, fees, intakes, campuses, international, support and resources. Each answer links to authoritative pages. Initial prompts for client answers: How do I apply? What documents are required? Where is my course delivered? Can I change my intake? How are fees paid? How do I request support? Keep answers consistent with current policies.

### 5.23 Campus listing and detail

Listing: campus name, city, address, summary and offered study areas. Detail: approved overview, address, public contact, hours, facilities, courses/intakes, transport/parking, accessibility, map/directions link, photos and admissions contact. Map coordinates and address must refer to the same location. External maps should have a normal link fallback.

### 5.24 News and events

News: category-filtered listing; article title, summary, publication date, author if used, body, approved media and related content. Separate editorial claims from verified institutional announcements.

Events: title, type, campus/location, start/end with timezone, description, audience, cost if any, organiser, registration deadline and accessibility contact. P1 supports an approved external registration link or enquiry; ticketing, payments, seat allocation and automated registrations are additional scope. Past events are labelled clearly.

### 5.25 Gallery

Albums for campus, facilities and activities. Each asset: caption, alt text, credit/rights information and publication consent record. Videos require caption/transcript support. Avoid autoplay with sound. Allow administrators to revoke publication without losing the internal asset record.

### 5.26 Contact and enquiry

Contact: department and campus directory, address/hours, phone/email actions, directions and enquiry form. Department routing must match approved staff recipients.

Enquiry fields: full name, email, optional phone/country, student audience, topic, optional course/campus, message, required privacy acknowledgement and separate optional marketing opt-in. Preserve preselected course context. Show a reference and confirmation after successful storage; send acknowledgement and notify the responsible team. Generic message: “Thank you. Your enquiry [REFERENCE] has been received. Our team will contact you using the details provided.” Do not invent a response-time promise.

### 5.27 Search, legal and error pages

Search covers published courses, pages, campuses, articles and public resources. Return type, title, excerpt and destination; never index applications or private uploads.

Privacy: actual collection purposes, recipients, retention, rights and contact, approved by the client. Terms: approved website terms and document links. Accessibility: access commitment, known limitations if any and help channel. Cookie preferences apply according to the site's actual tracking configuration and applicable requirements.

404: explain the missing page and offer search/course/contact links with HTTP 404. Unavailable services provide a retry/help message without losing entered form information where safe.

## 6. Application intake specification

### 6.1 Phase 1 workflow

Public, multi-step application with a secure server-side draft. Immediate form use does not require a public student account. Resume through an expiring email verification link if implemented; never expose documents through a public reference number.

| Step | Fields/content |
| --- | --- |
| Course selection | Audience, course, campus, valid intake, mode where selectable |
| Identity/contact | Legal name, email, phone with country code, date of birth only if needed, citizenship/residency and address if required |
| Study background | Highest qualification, institution, completion year, relevant experience and language evidence if required |
| Agent details | Applying directly or through an agent; approved agent reference and consent where needed |
| Documents | Configured checklist based on course/audience; qualification evidence, transcripts, language evidence and identity document only where necessary |
| Support | Optional support request with explanation of who receives it; collect minimal sensitive detail |
| Review/declarations | Summary, edit actions, accuracy declaration, privacy acknowledgement and approved admissions declarations |
| Confirmation | Unique reference, received date, next-step guidance and admissions contact |

Fields and required documents are configured with admissions; the table does not mandate collecting every item from every applicant. If minors are eligible, confirm guardian fields and consent workflow before accepting their applications.

### 6.2 Submission behaviour

- Validate each step client-side and server-side; preserve entered values after errors.
- Revalidate course/intake availability at final submission.
- Store a snapshot of selected course, intake, fee information presented and declaration versions.
- Submit once using an idempotency token; repeated requests return the same reference.
- Do not treat duplicate email alone as a duplicate application; a person may apply to different courses/intakes.
- Persist the application before sending email. Queue email retries; notification failure must not create duplicate applications or report a stored application as failed.
- Applicant acknowledgement contains minimal personal information and no document attachments.
- Confirmation pages are not publicly indexed and do not expose sensitive data in URLs.
- Secure draft expiry and submitted-record retention are configurable and approved by the client.

### 6.3 Staff review states

`Submitted → Under review → More information requested → Under review → Approved for next admissions step / Unsuccessful / Withdrawn`

Maintain timestamps, staff actor, reason and private notes for every change. Applicants receive only approved messages; private notes never enter applicant communications. Terminal-state changes require authorised staff and a reason. Track drafts separately from submitted applications. Final enrolment/offer generation is outside phase 1 unless specifically added.

## 7. Forms and security requirements

| Form | Required behaviour |
| --- | --- |
| Enquiry | Validation, anti-spam, topic routing, stored reference, acknowledgement |
| Application | Multi-step validation, private uploads, secure draft, idempotent submission |
| Agent enquiry | Organisation/contact/country/message and separate consent; no automatic approval |
| Newsletter, optional | Email, separate opt-in, confirmation/unsubscribe and consent record |

Uploads: proposed allowlist PDF/JPG/PNG; proposed 10 MB/file and 50 MB/application limits, configurable after client confirmation. Check file signatures as well as extensions, scan/quarantine before staff download, block executable/active content and store privately. Provide time-limited authorised download access; never place applicant documents in the public media directory. If scanning is unavailable, do not describe the upload path as production-ready.

Protect staff accounts with MFA where supported, strong session handling and rate limits. Enforce role permissions on the server. Use TLS, encrypted storage where supported, audit logs, protected backups and secret management. Keep full identity documents, sensitive support information and credentials out of logs, analytics and notification emails. Sanitize rich text, validate inputs, use parameterised queries and apply CSRF protection where relevant.

## 8. Admin CMS pages and permissions

| Admin module | Functions |
| --- | --- |
| Dashboard | New enquiries/applications, open intakes, content needing review, delivery failures |
| Pages/navigation | Edit original page content, menu order, drafts, preview and publishing |
| Courses/categories | Manage details, modules, audience, campuses, eligibility and related courses |
| Fees/intakes | Versioned prices, dates/deadlines, availability and relationships |
| Applications | Filter, authorised detail view, documents, assignment, notes and status history |
| Enquiries | Assign, tag, record follow-up, mark new/in progress/resolved/spam |
| Campuses/team | Addresses, contacts, hours, facilities and approved profiles |
| Support/FAQs | Support directory, topics, answers and related links |
| Documents/policies | Upload public resources, versions, effective dates and retirement |
| News/events/gallery | Draft/review/publish, scheduling, captions and media consent |
| Agents/partners | Approved directory, relationship details and publication approval |
| Users/roles | Staff access, account disable, MFA/session management |
| Settings | Shared branding text, contacts, social links, integrations and SEO defaults |
| Audit/reports | Publish/status/access history and permission-controlled exports |

Roles:

- Administrator: users, configuration and all authorised operational modules.
- Content editor: content/media drafts; no applicant documents or private admissions notes.
- Content approver: publish/retire approved public content, including required fact review.
- Admissions officer: assigned applications/enquiries, documents and status updates.
- Admissions manager: all admissions records, assignment and approved exports.
- Finance reviewer, conditional: approve fee/bank changes without broad applicant-document access.

One person may hold multiple roles. Permission checks must work even when a restricted URL/API is entered directly. Staff deletion should disable accounts while preserving audit attribution. Publishing workflow: draft → review → published → archived. Scheduled publishing uses configured campus timezone. Preview URLs require staff access or expiring tokens and remain excluded from search engines.

## 9. Core data model

| Entity | Main fields/relationships |
| --- | --- |
| InstitutionSettings | Legal/trading name, country, contact, approved identifiers, shared links |
| Page | Title, slug, structured sections, state, owner, SEO and version |
| CourseCategory | Name, slug, description, publication state |
| Course | Title/code, category, audience, qualification, duration, delivery, description, requirements, state |
| CourseModule | Course, code/title, type, sequence and description |
| Campus | Name/slug, address, coordinates, timezone, contacts, hours, facilities |
| CourseOffering | Course + campus + audience + delivery combination |
| Intake | Offering, start/deadline, status and optional capacity |
| FeeSchedule | Offering/audience, currency, amount/basis, extra costs, valid dates and version |
| Application | Reference, applicant details, selected offering/intake, snapshots, state, assignment and declarations |
| ApplicationDocument | Application, private storage key, document type, scan state and retention metadata |
| ApplicationStatusHistory | Application, prior/new status, actor, time and reason |
| Enquiry | Reference, contact, topic, context, message, consent, assignment and status |
| Resource/Policy | Title/type, version, effective date, file, audience and publication state |
| Article/Event | Title/slug, content, category, dates, campus and publication state |
| MediaAsset | Private/public classification, alt text, rights/consent and file metadata |
| StaffProfile/Agent/Partner | Approved public details, roles/relationship and publication state |
| FAQ/Testimonial | Question/answer or approved quote, category/consent and state |
| StaffUser/Role | Identity, permissions, account/session state |
| AuditLog | Actor, action, entity, timestamp and safe change metadata |
| NotificationJob | Recipient class, template, related reference, delivery status and retry count |

Use stable IDs and unique public slugs; preserve redirects after slug changes. Store money with decimal precision and an explicit currency. Store timestamps consistently and render event/intake times in their campus timezone. A course can have many offerings, each with multiple intakes and versioned fee schedules. Keep private applicant files separate from public documents.

## 10. Suggested API boundaries

Framework-neutral; adapt to the selected stack. These are proposed endpoints, not APIs discovered on the reference.

| Endpoint | Behaviour |
| --- | --- |
| `GET /api/courses` | Published searchable/filterable catalogue |
| `GET /api/courses/:slug` | Published course, valid offerings and public resources |
| `GET /api/intakes` | Active intakes filtered by course/campus/audience |
| `GET /api/campuses/:slug` | Published campus details |
| `GET /api/search` | Published content results only |
| `POST /api/enquiries` | Validate, rate-limit, store and queue notifications |
| `POST /api/application-drafts` | Start a protected draft |
| `PATCH /api/application-drafts/:id` | Authorised draft update |
| `POST /api/application-drafts/:id/documents` | Authorised private upload/quarantine |
| `POST /api/applications` | Finalise validated draft with idempotency |
| `/api/admin/...` | Authenticated role-protected content/admissions operations |

Draft access must require a secret/verified session, never the numeric ID alone. Restrict query sort/filter values, paginate lists, standardise field errors and protect every private resource with record-level authorisation. Public APIs must not expose internal notes, staff email-routing configuration or file storage keys.

## 11. Integrations and non-functional requirements

Required: transactional email with retry monitoring, private document storage, public media storage and protected database backups. Optional: CRM sync, existing LMS/portal links, maps, consent-aware analytics, newsletter provider and a confirmed anti-spam service. Phase 2: payment gateway, applicant accounts, agent portal and enrolment-system integration.

SEO: unique metadata, canonical URLs, sitemap for published pages, redirects, social previews and structured data appropriate to actual content. Exclude admin, drafts, applicant pages and private files from indexing; authentication remains necessary because robots rules do not secure content. Filter URLs need a deliberate canonical/indexing strategy.

Accessibility target: WCAG 2.2 AA as a project acceptance target, verified through keyboard/manual checks as well as automated tooling. Forms need labels, accessible errors, focus handling and usable file controls. Provide text alternatives and accessible documents.

Performance target: representative public pages aim for LCP ≤2.5 s, INP ≤200 ms and CLS ≤0.1 where field data is available. Use responsive/compressed images, caching and bounded queries. Lab checks are initial evidence, not a guarantee of field performance.

Operational requirements: separate production/test environments, monitored form/API errors and email failures, deployment rollback, backups and a restore exercise. The client must approve backup frequency, retention, recovery targets and personal-data retention. Analytics tracks page views, course interest and successful form events without recording form contents or identity documents.

## 12. Client information and content checklist

| Input needed | Owner | Blocks |
| --- | --- | --- |
| Campus name, country, legal/trading identity, domain | Client management | Global copy and final site setup |
| Logo and permitted imagery | Marketing | Final content/media |
| Confirmed courses and qualifications | Academic team | Catalogue and course details |
| Entry/language requirements, curriculum, assessment | Academic/admissions | Course publication and application validation |
| Course-campus combinations, intakes and deadlines | Admissions | Available application selections |
| Fee schedules, currency, extra charges, refund rules | Finance | Fees and application disclosures |
| Campuses, contacts, hours, accessibility, facilities | Campus operations | Campus/contact/support pages |
| Admissions steps, required documents, decision authority | Admissions | Application workflow |
| Registration/accreditation/partner evidence | Management | Claims and logos |
| Approved policies, privacy/declarations, retention | Authorised client reviewer | Production forms and legal pages |
| Staff profiles, consented testimonials/media | Marketing/HR | Optional trust and student-life content |
| Email routing and staff role list | Management | Operational submissions/CMS access |
| Portal/LMS/CRM destinations and access arrangements | IT | Integration scope |
| Scholarships/agents/international services if offered | Relevant teams | Conditional pages |

Development can begin with placeholders and a labelled demo dataset. Never publish demo fees, identities, accreditation, course codes or fake testimonials as real content.

## 13. Build sequence and release boundaries

1. Confirm scope, country/audience, course structure, content owners and application process.
2. Create data models, staff authentication, permissions, CMS publishing and shared settings.
3. Build course/category/campus templates, general pages and import approved content.
4. Build admissions/intake/fees resources and enquiry submission with delivery monitoring.
5. Build application drafts, document protection and admissions review workflow.
6. Add news/events/gallery/resources/search and complete conditional pages.
7. Run content, security, accessibility, form and operational acceptance checks.
8. Client reviews complete staging content; resolve defects and deploy with monitoring and staff handover.

P1 includes the public inventory marked P1, staff content management, enquiry processing and application intake. Conditional pages require confirmed services. P2 includes accounts/status portal, payment processing, live LMS integration, event registration/ticketing, agent accounts, scholarships application workflows, course comparison and multilingual publishing. Adding these should update scope explicitly.

## 14. Acceptance checklist

- [ ] Every enabled page exists with accurate navigation, title and approved content.
- [ ] No bracketed placeholders, sample fees, fake course records or unapproved claims are public.
- [ ] Course filters/search work together and preserve shareable URL state.
- [ ] Course details, fee audience/basis and campus-specific intakes agree.
- [ ] Closed/archived offerings cannot be submitted as new applications.
- [ ] Enquiries store exactly once, route correctly and acknowledge receipt.
- [ ] Applications validate server-side, preserve revisions and produce unique references.
- [ ] Refresh/double-click/network retry does not duplicate final submission.
- [ ] Document type/size checks, quarantine and authorised download controls work.
- [ ] Unauthenticated users and content-only staff cannot access applications/files.
- [ ] Email failure retries do not lose stored applications or disclose documents.
- [ ] Private admissions notes remain private in pages, exports and email.
- [ ] CMS preview/review/publish/archive and document versioning behave correctly.
- [ ] Required declarations and consent versions are recorded accurately.
- [ ] Keyboard navigation, form errors and mobile content pass manual checks.
- [ ] Empty lists, missing pages, expired drafts and unavailable services have useful responses.
- [ ] Sitemap, canonical metadata, redirects and private-page indexing exclusions are correct.
- [ ] Backups restore successfully; production errors and email failures are visible to staff.
- [ ] Staff receive CMS/admissions instructions and know who owns content updates.

## 15. Starter build brief for a developer or coding assistant

> Build a campus marketing and admissions website using this specification. Prioritise the complete content architecture, reusable course and campus templates, CMS publishing, enquiry processing and secure application intake. Use [CAMPUS_NAME] and labelled placeholders until the client supplies approved content. Model courses, offerings, intakes and fees separately. Support conditional domestic/international content without inventing accreditation or eligibility. Provide protected staff roles, private document storage, validation, audit history and reliable email queues. Keep applicant, LMS, finance and payment extensions within the stated release boundaries. Do not copy the reference site's branding or wording. Follow the page briefs and acceptance checklist. Visual styling will be specified separately.

## 16. Remaining decisions

Confirm before final production implementation: institution/country, actual student audiences, offered qualifications, whether applications are website-managed or handed to an existing system, staff approval process, required documents, portal/CRM integration, privacy/retention requirements, languages and hosting/stack. These decisions refine the brief; they do not prevent starting reusable content templates and CMS models.
