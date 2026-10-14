# Course & study-area image brief (current catalogue)

Image prompts for the 13 courses and 6 study areas now in the catalogue (The Centre of Excellence courses, kept under AIT branding). This **supersedes the course/study-area sections of `IMAGE_PROMPTS.md`**, whose course list is from the old demo catalogue.

Until a file is supplied, each slot shows a designed animated placeholder (the coloured tile with an icon you see now), so the site already looks complete — these images are an upgrade, not a blocker.

## How to deliver

1. Create each image at the size listed (or larger, **same aspect ratio**). JPG or PNG, high quality, sRGB.
2. **Name the file exactly after its slot id**, e.g. `course-diploma-of-beauty-therapy.jpg`, `category-beauty.jpg`.
3. Put the files in one folder and run `npm run images -- <that folder>`. It writes responsive WebP to `public/images/` and regenerates the slot→file map. Re-run whenever you add or change files.
4. Supplying one image per course replaces the shared study-area artwork, so courses in the same area stop looking identical.

## Real photos vs AI-generated

These are generic training/marketing scenes, acceptable as AI illustrations **only if** they are not presented as real students, staff, events or facilities of this campus. Real photos of the **actual** campus, rooms, salons, kitchens, labs and staff (and all logos/portraits) must be real files — see `PHOTO_SHOT_LIST.md`. Keep every Australia / career reference aspirational — never imply visas, migration or guaranteed employment.

## Shared style (append to every AI prompt)

> Photorealistic editorial photography, natural daylight, warm and optimistic mood, shallow depth of field, modern and diverse students aged 18–40, authentic candid moments (not posed stock), subtle deep-navy and warm-gold colour accents, clean uncluttered background, no text, no logos, no watermarks, 35mm lens, high detail.

Negative prompt (if your tool supports one): `text, letters, logos, watermark, distorted hands, extra fingers, blurry faces, oversaturated, cartoon, uniform branding`

---

## 1. Study-area tiles — optional

One per study area, shown on the study-area tiles and as the fallback photo for any course without its own image. **1600 × 1200 (4:3)**, subject centred, **keep the bottom third darker/simpler** (the title and description sit over it). `category-business` and `category-english` already have files; the four below are empty.

| Slot | Prompt |
| --- | --- |
| `category-beauty` | Beauty therapy students practising treatments in a bright modern training salon, treatment beds, skincare products and soft towels, calm and professional atmosphere |
| `category-hairdressing` | Hairdressing students cutting, colouring and styling hair at salon chairs with large mirrors, combs and tools on the station, lively training salon |
| `category-construction` | Building and construction students in hi-vis vests and hard hats working with timber framing and hand tools on a training site, daylight, safety-focused |
| `category-civil-construction` | Civil design students at dual-monitor CAD workstations reviewing road and bridge plans, printed drawings on the desk, modern design studio |

## 2. Per-course images — recommended

One photo per course. **1600 × 1200 (4:3)**, subject centred (the card crops to fit). Same shared style line as above.

### Business & Management

| Slot | Prompt |
| --- | --- |
| `course-diploma-of-business` | Three business students around a table with a laptop and printed charts, one presenting a figure, confident collaborative discussion, bright modern classroom |
| `course-advanced-diploma-of-business` | A confident young manager leading a planning session at a glass wall covered in sticky notes and strategy diagrams, a small engaged team listening, modern office |

### English Language (ELICOS)

| Slot | Prompt |
| --- | --- |
| `course-general-english-elicos` | Diverse adult English-language students in lively discussion around a table, open notebooks and vocabulary cards, teacher listening and smiling, bright classroom |

### Beauty Therapy

| Slot | Prompt |
| --- | --- |
| `course-diploma-of-beauty-therapy` | A beauty therapy student performing a relaxing facial treatment on a client lying on a treatment bed in a clean modern training spa, soft lighting, towels and skincare products |
| `course-certificate-iv-in-beauty-therapy` | A beauty student preparing skincare products and tools at a tidy salon station with a mirror, focused and professional, bright training salon |
| `course-certificate-iii-in-beauty-services` | A beauty student applying a manicure to a client's hands at a nail station, colourful polishes neatly arranged, clean bright training salon |

### Hairdressing & Salon

| Slot | Prompt |
| --- | --- |
| `course-certificate-iii-in-hairdressing` | A hairdressing student cutting a client's hair at a salon chair with a large mirror, combs and scissors in hand, focused, bright training salon |
| `course-certificate-iv-in-hairdressing` | A senior hairdressing student applying creative foils and colour to a client's hair, colour bowls and brushes on the trolley, stylish modern salon |
| `course-diploma-of-salon-management` | A salon manager leading a short team briefing on the salon floor, tablet or clipboard in hand, stylists listening, professional welcoming salon |

### Building & Construction

| Slot | Prompt |
| --- | --- |
| `course-diploma-of-building-and-construction` | A building student in hi-vis and a hard hat reviewing printed building plans on a site table, timber framing and tools in the background, daylight |
| `course-certificate-iii-in-painting-and-decorating` | A painting and decorating student in overalls cutting in a wall edge with a brush, roller and paint tray nearby, clean bright interior under renovation |

### Civil Construction Design

| Slot | Prompt |
| --- | --- |
| `course-advanced-diploma-of-civil-construction-design` | A civil design student working on detailed infrastructure drawings at a dual-monitor CAD workstation, road and bridge plans on screen, focused, modern studio |
| `course-diploma-of-civil-construction-design` | Two civil design students reviewing a 3-D model on a large monitor at a CAD workstation, rulers and printed plans on the desk, bright design studio |

---

## Checklist

- [ ] 4 study-area tiles (`category-beauty`, `category-hairdressing`, `category-construction`, `category-civil-construction`)
- [ ] 13 per-course images (`course-…` for each course above)
- [ ] Delivered named by slot id, then `npm run images -- <folder>` run
