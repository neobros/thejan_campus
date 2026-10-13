import type { Article } from '@/api/types'
import { media } from './media'
import { at, daysFromToday } from './time'

/** DEMO DATA — `readingMinutes` and `related` are derived by the mock API. */
export type ArticleSeed = Omit<Article, 'related' | 'readingMinutes'>

/*
 * Sample news (specification §5.24). "announcement" = institutional notice to be verified by the
 * client before publication; "story" = editorial content. Stories avoid named students and quotes:
 * only consented stories and photos may be published.
 */
export const articles: ArticleSeed[] = [
  {
    id: 'article-applications-open',
    slug: 'applications-open-for-upcoming-intakes',
    title: 'Applications are open for upcoming intakes',
    summary: 'Applications are now open for courses starting over the coming months. Here is how to choose an intake and what to prepare.',
    category: 'Announcements',
    kind: 'announcement',
    publishedAt: at(daysFromToday(-3), '09:00'),
    author: 'Admissions team',
    image: media.news[0],
    body: `Applications are now open for intakes starting over the coming months across our business, information technology, hospitality, health and English language programs. Start dates, deadlines and availability for each campus are listed on the [intakes page](/admissions/intakes).

## Choosing your intake

Each course has its own intake dates and application deadlines. Some intakes have limited places, so we recommend checking the status shown next to each date and applying early. If your preferred date is full, you can choose a later intake or [ask our admissions team](/enquire?topic=admissions) about alternatives.

## What to prepare

Before you start the online form, gather your academic certificates and transcripts, any English language evidence your course requires, and certified translations of documents that are not in English. The form shows the exact document checklist for your course.

## What happens next

Submitting an application asks our admissions team to review your details — it is not an offer or an enrolment. We may contact you for more information, and you will receive your outcome and any next steps in writing.`,
  },
  {
    id: 'article-computer-lab',
    slug: 'refreshed-computer-lab-at-city-campus',
    title: 'Refreshed computer lab opens at City Campus',
    summary: 'Information technology students now have updated workstations and more flexible space for team projects at City Campus.',
    category: 'Campus life',
    kind: 'announcement',
    publishedAt: at(daysFromToday(-9), '09:00'),
    author: 'Campus operations team',
    image: media.news[1],
    body: `The computer lab at City Campus has reopened after a refresh, with updated workstations and a new layout that makes team projects easier.

## What has changed

The lab now includes [number and type of workstations — to be confirmed], movable desks for group work and a presentation screen for code reviews and demonstrations. The software used in our information technology courses has been updated for the current intake.

## Who can use it

The lab is used for scheduled information technology classes. Outside class times, enrolled students can use available workstations during campus opening hours [booking arrangements — to be confirmed].

## Accessibility

City Campus has a step-free entrance and lifts to all floors. If you need an adjustable desk or assistive software, please contact [student support](/student-support) so we can arrange it before your class.`,
  },
  {
    id: 'article-community-lunch',
    slug: 'cookery-students-serve-a-community-lunch',
    title: 'Cookery students serve a community lunch',
    summary: 'Students from the Certificate in Professional Cookery planned, prepared and served a lunch for local community groups at Riverside Campus.',
    category: 'Student stories',
    kind: 'story',
    publishedAt: at(daysFromToday(-16), '09:00'),
    author: 'Student experience team',
    image: media.news[2],
    body: `Students from the Certificate in Professional Cookery recently put their skills to work, planning and serving a lunch for guests from local community groups in the Riverside Campus training restaurant.

## From menu plan to service

The lunch was part of the menu planning and kitchen operations modules. Working in kitchen brigades, students costed the menu, ordered ingredients, prepared each course and ran the service from start to finish, with trainers on hand to guide them.

## Learning beyond the kitchen

As well as cooking, students practised the teamwork and communication that keep a service running smoothly — from timing each course to welcoming guests and catering for dietary requirements.

## Thank you

Thank you to everyone who joined us, and to the students and trainers who made the day possible. Photos from the lunch are in our [gallery](/gallery), shared with the consent of the people pictured.`,
  },
  {
    id: 'article-choosing-a-level',
    slug: 'certificate-diploma-or-short-course',
    title: 'Certificate, diploma or short course? Choosing your starting point',
    summary: 'Not sure which level of study suits you? A plain-language guide to the differences between our course types.',
    category: 'Courses',
    kind: 'story',
    publishedAt: at(daysFromToday(-27), '09:00'),
    author: 'Admissions team',
    image: media.news[3],
    body: `Choosing a course level can feel confusing, especially if you are returning to study or comparing options from another country. Here is a quick guide to the types of course we offer.

## Short courses

Short courses focus on one practical skill and usually run part-time over a few weeks. They are a low-commitment way to explore a field, and most have no formal academic entry requirements. Short courses do not lead to a formal qualification.

## Certificates

Certificate courses build foundation skills in a study area. They suit school leavers, career changers and people who want to formalise skills they already use. Some certificates can lead into diploma-level study.

## Diplomas and advanced diplomas

Diplomas develop broader knowledge and the skills used in supervisory and specialist roles. Advanced diplomas build on this for people with relevant study or experience. Entry requirements are higher, and some courses include supervised work placement.

## Still unsure?

Every course page lists entry requirements, duration, delivery and fees, so you can compare options side by side. Pathways show possible next steps only — further study depends on meeting each course's entry requirements. If you would like help deciding, [talk to our admissions team](/enquire?topic=course).`,
  },
  {
    id: 'article-community-garden',
    slug: 'students-grow-a-community-garden-at-parkview',
    title: 'Students grow a community garden at Parkview',
    summary: 'Student volunteers have turned an unused corner of Parkview Campus into a vegetable and herb garden for everyone to enjoy.',
    category: 'Student stories',
    kind: 'story',
    publishedAt: at(daysFromToday(-41), '09:00'),
    author: 'Student experience team',
    image: media.news[4],
    body: `An unused corner of Parkview Campus is now home to raised vegetable beds and a herb garden, thanks to a group of student volunteers.

## How it started

The idea came from students who wanted a calm outdoor space to spend time between classes. With support from campus staff, volunteers planned the layout, chose plants suited to the local climate and spent several afternoons building and planting the beds.

## A shared space

The garden is open to all students and staff. Volunteers take turns watering and caring for the beds, and herbs are shared in the student common areas.

## Get involved

New volunteers are always welcome, and no gardening experience is needed. Look out for upcoming working bees on our [events page](/events), or ask at reception at Parkview Campus.`,
  },
  {
    id: 'article-library-spaces',
    slug: 'library-study-spaces-refreshed',
    title: 'Library study spaces refreshed ahead of assessment weeks',
    summary: 'New seating and bookable group study rooms are now available in the City Campus library, with extended hours during assessment weeks.',
    category: 'Announcements',
    kind: 'announcement',
    publishedAt: at(daysFromToday(-55), '09:00'),
    author: 'Campus operations team',
    image: media.news[5],
    body: `The library at City Campus has new seating, improved lighting and additional bookable rooms for group study.

## Extended hours during assessment weeks

During assessment weeks the library will open for extended hours: [extended opening hours — to be confirmed]. Assessment weeks are listed in the academic calendar on the [downloads page](/downloads).

## Booking a study room

Enrolled students can book a room for group work [booking method and time limits — to be confirmed]. Please leave rooms tidy and cancel bookings you no longer need so that others can use the space.

## Quiet study

The main reading area remains a quiet zone. If you need an accessible workstation or assistive technology, ask library staff or contact [student support](/student-support).`,
  },
]
