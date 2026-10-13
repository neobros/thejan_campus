# Image & banner brief

Every image on the site has a **slot id**. Until a file is supplied, the site shows a designed gradient placeholder (in development builds the slot id and size are printed in its top-right corner, so you can see exactly where each image goes).

## How to deliver

1. Create each image at the size listed (or larger, same aspect ratio). JPG or PNG, high quality, sRGB.
2. Name the file after its slot id, e.g. `home-hero.jpg`, `page-about.jpg`.
3. Drop the files in a folder and run `npm run images -- <that folder>`. It writes responsive WebP (640/1024/1600/2400 px) to `public/images/` and regenerates `src/api/mock/data/images.generated.ts`, which maps each slot id to its files. In production the CMS supplies images the same way.

**Status (13 Oct 2026):** all 64 slots are filled. 45 are AI marketing illustrations; the other 19 (campus, facilities, team, reception, accreditation, three news photos, video still, share image) are AI **concept** renders wired in with `--concept`, so the site labels them "Concept image". Those 19 must be replaced by **real photographs** before launch — see [`PHOTO_SHOT_LIST.md`](./PHOTO_SHOT_LIST.md). Re-run `npm run images -- <pack1> --concept <pack2>` whenever either folder changes; drop the `--concept` folder once real photos replace it.

## Real photos vs AI-generated

This is a real institution, so images must not mislead prospective students.

| Use | Rule |
| --- | --- |
| Campus buildings, facilities, classrooms, kitchens, labs (`campus-*`, `facility-*`, `page-about`, `page-campuses`, `page-contact`) | **Real photos of the actual campus only.** AI images of buildings that don't exist would misrepresent the institution. |
| Staff portraits, testimonials, partner/accreditation logos, the main logo | **Real, approved files only** — never generated. |
| Students in marketing scenes (heroes, study areas, news, events) | Real photos with consent are best. AI images are acceptable for mood/illustration **only if** they are not presented as real students, events or facilities of this campus. |
| Abstract/concept visuals (`page-fees`, `page-intakes`, `page-pre-arrival`, `page-resources`, `page-news`) | AI-generated is fine. |

## Shared style (append to every AI prompt)

> Photorealistic editorial photography, natural daylight, warm and optimistic mood, shallow depth of field, modern and diverse students aged 18–35, authentic candid moments (not posed stock), subtle deep-navy and warm-gold colour accents, clean uncluttered background, no text, no logos, no watermarks, 35mm lens, high detail.

Negative prompt (if your tool supports one): `text, letters, logos, watermark, distorted hands, extra fingers, blurry faces, oversaturated, cartoon, uniform branding`

---

## 0. Rotating home banners — delivered

The home hero rotates through five 16:9 banners (`nursing-hero`, `nursing-practical-training`, `nursing-student-support`, `nursing-graduation`, `nursing-australia-pathway`, all 2400 × 1350, headline space on the left). Each slide's eyebrow, headline, summary and buttons are CMS content (`hero.slides` on the home page); the rotation interval is `hero.interval`. To add or replace a banner: supply a 2400 × 1350 image with the subject centre-right and the left half calm and dark, then add a slide. The Australia-pathway slide must stay aspirational — never promise visas, migration or employment.

## 1. Priority — home page

| Slot | Size | Notes | Prompt |
| --- | --- | --- | --- |
| `home-hero` | 2400×1350 (16:9) | Full-width banner behind white text. **Keep the left 55% darker and calm** (headline sits there); subject on the right. Also crops to portrait on phones — keep the subject centred-right. | Wide shot of a group of four diverse university students walking and laughing across a sunlit modern campus courtyard at golden hour, glass-and-brick buildings behind, long soft shadows, subject group on the right third, open calm sky and shade on the left side |
| `home-support` | 1600×1200 (4:3) | Framed image beside text | A friendly student-support adviser talking with a student across a small table in a bright, welcoming office, laptop and notebook, plants, warm natural light, both smiling |
| `home-why` | 1600×1200 (4:3) | Spare slot for the "Why study with us" area | Small group of students collaborating around a table with laptops and sticky notes in a bright modern classroom, one student explaining, others engaged |
| `og-default` | 1200×630 | Social-share image when links are posted (Facebook, LinkedIn, WhatsApp). Logo + campus name over a photo or brand gradient. **Needs the real logo/name** — design it rather than generate. | — |

## 2. Study areas — optional

The study-area tiles and course cards now carry their own animated artwork, so these photos are **optional**. Supply them only if you want real photography there. All 1600×1200 (4:3). Keep the **bottom third darker/simpler** — the title and description sit over it.

| Slot | Prompt |
| --- | --- |
| `category-business` | Business students presenting a strategy slide to classmates in a modern seminar room, presenter gesturing at a screen, audience attentive, professional but relaxed |
| `category-it` | Close-up over-the-shoulder view of a student writing code on dual monitors in a computer lab, blue screen glow, other students blurred in background |
| `category-hospitality` | Cookery students in white chef jackets plating colourful dishes in a stainless-steel training kitchen, steam, focus on hands and plates |
| `category-health` | Care students in scrubs practising patient-care skills with a training mannequin in a simulated care room, instructor guiding, calm and respectful atmosphere |
| `category-english` | Diverse adult English-language students in lively discussion around a table, open notebooks, teacher listening, bright classroom |
| `category-short-courses` | Adult learners in an evening workshop with laptops, warm indoor lighting, facilitator at a whiteboard, relaxed and focused |

### Per-course images — recommended next batch

Each course currently reuses its study-area photo (with a different crop per course). Courses in the same area therefore share a picture; supplying one image per course fixes that. All **1600 × 1000** (landscape, 8:5), subject centred, same shared style line as above.

| Slot | Prompt |
| --- | --- |
| `course-certificate-in-business-administration` | A young office worker at a tidy reception desk answering a phone and checking a diary, bright modern office |
| `course-diploma-of-business` | Three students around a table with a laptop and printed charts, one pointing at a figure, confident discussion |
| `course-advanced-diploma-of-leadership-and-management` | A manager leading a stand-up meeting beside a whiteboard with sticky notes, small attentive team |
| `course-certificate-in-information-technology` | A student assembling a desktop computer at a workbench, components and cables laid out neatly |
| `course-diploma-of-information-technology` | Two students pair-programming at a wide monitor showing code, lab setting, screen glow |
| `course-diploma-of-cyber-security` | A student monitoring a network dashboard on dual screens in a dim lab, blue light, focused |
| `course-certificate-in-professional-cookery` | Close-up of a student in chef whites plating a dish with tweezers in a stainless kitchen |
| `course-diploma-of-hospitality-management` | A hospitality student in a dark apron briefing two colleagues in a restaurant before service |
| `course-certificate-in-health-and-care-support` | A care student in scrubs helping an older person stand from a chair in a bright training room |
| `course-diploma-of-community-services` | A community worker talking with a young person across a table in a welcoming office, notebook open |
| `course-general-english` | A small English class in lively conversation, teacher at a whiteboard with vocabulary, smiling students |
| `course-english-for-academic-purposes` | A student presenting slides to a seminar room, classmates taking notes |
| `course-digital-marketing-essentials` | A marketer planning a social-media calendar on a laptop, phone beside it showing a feed, café setting |
| `course-data-skills-for-the-workplace` | Colleagues reviewing a spreadsheet chart on a large screen, one explaining, office setting |

These go through the same `npm run images` step as everything else.

## 3. Page banners (framed image on the right of each page header)

All 1600×1200 (4:3), subject centred (the frame has rounded corners).

| Slot | Page | Prompt / requirement |
| --- | --- | --- |
| `page-about` | About | **Real photo:** main campus entrance in morning light |
| `page-team` | Leadership & faculty | **Real photo** of the team, or: teaching staff in friendly conversation in a modern staff area |
| `page-accreditation` | Accreditation | Close-up of framed certificates on a clean office wall, soft focus, no readable text |
| `page-courses` | Courses | Students studying with laptops and notebooks at long tables in a bright library |
| `page-admissions` | Admissions / Apply | A prospective student and an admissions adviser reviewing a course brochure together at a desk |
| `page-entry-requirements` | Entry requirements | An applicant checking documents against a checklist with an adviser, folders on the desk |
| `page-fees` | Fees | Flat-lay of a calculator, notebook, pen and course brochure on a wooden desk, morning light |
| `page-intakes` | Intakes | Wall planner calendar with a few dates circled in gold marker, sticky notes, shallow depth of field |
| `page-scholarships` | Scholarships | A student smiling while reading a letter at a sunny desk |
| `page-credit-transfer` | Credit transfer | A neat folder of certificates and transcripts on a table, hands organising papers |
| `page-international` | International | Diverse international students chatting outside a modern building with backpacks |
| `page-pre-arrival` | Before you arrive | A suitcase, passport-style travel wallet and boarding pass on a bed, ready to travel (no readable documents) |
| `page-living` | Living & studying | Students relaxing on grass in a city park with a tram/bus visible in the distance |
| `page-agents` | Education agents | An education adviser meeting a student and parent across a desk, friendly professional setting |
| `page-domestic` | Domestic students | Local students arriving at campus with backpacks on a bright morning |
| `page-student-life` | Student life | Students laughing together at an outdoor campus event with string lights |
| `page-support` | Student support | A support adviser helping a student at a welcoming help desk |
| `page-orientation` | Orientation | New students at a welcome session, name tags, staff greeting them |
| `page-resources` | Student resources | A student browsing documents on a tablet in a café-style study space |
| `page-campuses` | Campuses | **Real photo:** aerial or wide view of the actual campus |
| `page-contact` | Contact | **Real photo:** the actual reception desk |
| `page-news` | News | A campus noticeboard with colourful flyers, blurred students passing |
| `page-events` | Events | Students gathered at an evening campus event, warm lighting |
| `page-gallery` | Gallery | Collage-style composition of campus moments (or pick a favourite gallery photo) |

## 4. Campuses & facilities — real photos required

| Slot | Size | Shot list |
| --- | --- | --- |
| `campus-city`, `campus-riverside`, `campus-parkview` | 1600×1000 | Exterior of each actual campus, daylight, entrance visible |
| `facility-library`, `facility-computer-lab`, `facility-kitchen`, `facility-classroom`, `facility-lounge`, `facility-care-lab` | 1200×900 | The real rooms, tidy, well lit, ideally with a few (consenting) students |

## 5. Student life & gallery

1200×900 (4:3). Real, consented photos preferred.

| Slot | Prompt |
| --- | --- |
| `life-clubs` | Students at a club meeting in a common room, casual and friendly |
| `life-events` | Students enjoying a cultural celebration on campus, colourful food and decorations |
| `life-study` | Peer study group working together in a library |
| `life-community` | Students volunteering at a community garden, planting and smiling |
| `life-sport` | A friendly game of basketball between students on an outdoor court |
| `gallery-courtyard` | Students chatting at outdoor tables in a shaded courtyard |
| `gallery-orientation` | New students meeting classmates during an orientation icebreaker |
| `gallery-cookery-showcase` | Cookery students presenting plated dishes at a showcase lunch |
| `gallery-welcome-video` | 1600×900 still frame for the welcome video (main entrance) — supply the video with captions |

## 6. News & events (1600×900, 16:9)

| Slot | Prompt |
| --- | --- |
| `news-1` | Students collecting welcome packs at an information desk |
| `news-2` | A refreshed computer lab with students at new workstations |
| `news-3` | Cookery students serving a community lunch |
| `news-4` | Students at a careers and pathways information session |
| `news-5` | Volunteers planting trees in a campus garden |
| `news-6` | A library study space with new modern seating |
| `event-open-day` | Visitors on a guided campus tour during an open day |
| `event-info-session` | An online information session on a laptop screen in a home setting |
| `event-orientation` | A welcome table for new students with lanyards and smiling staff |
| `event-workshop` | Students in a hands-on study-skills workshop with sticky notes |
| `event-culture` | Students sharing food at a multicultural festival |
| `event-careers` | Students talking with employers at a careers-fair booth |

## 7. From the client (not generated)

- **Logo** — SVG preferred (plus a white version for dark backgrounds). Replaces the placeholder arch mark in the header, footer and favicon.
- **Favicon** — square logo mark, 512×512 PNG or SVG.
- **Staff portraits** — 800×1000 (4:5), consistent background and lighting.
- **Partner/accreditation logos** — SVG/PNG with permission to use.
- **Brand colours** — if the client has them, they replace the navy/gold tokens in `src/styles/index.css`.
