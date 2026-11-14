# AIT Homepage & About — Image Prompts

Prompts for the images used by the new mockup-matched **Home** and **About AIT** pages.
Generate each image, name the file **exactly** as the "File" name below, then deliver them (see
[How to deliver](#how-to-deliver)). Until a file exists, the site shows a designed placeholder, so
the layout already works — the photos just drop in.

## House style (apply to every image)

- **Photoreal**, bright, optimistic, professional. Natural light, clean modern settings.
- **People:** South Asian / Sri Lankan students and professionals, mixed genders, 18–35, confident and approachable. Diverse and inclusive.
- **Brand feel:** navy blue + a touch of red accent; Australian cues where noted (Sydney Opera House / Harbour Bridge, blue skies).
- **No text, no logos, no watermarks, no borders.** Leave some clean/negative space so the image reads well when cropped.
- Sharp focus on the subject, softly blurred background. Avoid clutter, avoid fake-looking AI artefacts (hands, faces).
- Deliver as **JPG** (or PNG), landscape unless noted, at least the pixel size listed.

---

## Home page

### 1. Hero collage — `ait-hero`
- **File:** `ait-hero.jpg` · **Size:** 1600 × 1100 (landscape, subject centre-right)
- **Prompt:** A confident group of three young Sri Lankan people standing together, lit by warm daylight: a construction worker in a hi-vis vest and yellow hardhat holding a laptop, a nursing student in navy-blue scrubs, and a smart-casual young professional. Behind them, softly blended, the Sydney Opera House and harbour under a blue sky. Bright, aspirational, photoreal, shallow depth of field. Clean space on the left for text overlay.

### 2. Our Story — `ait-story`
- **File:** `ait-story.jpg` · **Size:** 1600 × 1200 (4:3 landscape)
- **Prompt:** Exterior of a modern education building in bright daylight, clean glass-and-stone façade, framed by green trees. A premium university feel. (A crest/emblem on the façade is welcome but keep any lettering illegible — no real logos.) Blue sky, welcoming and established.

### 3. What is TNE — `ait-tne`
- **File:** `ait-tne.jpg` · **Size:** 1600 × 1100 (landscape)
- **Prompt:** The Sydney Opera House and harbour skyline at dusk, calm water with soft reflections, warm city lights, deep blue sky. Cinematic, serene, premium. No people, no text.

### 4. Programme card — Construction — `ait-prog-construction`
- **File:** `ait-prog-construction.jpg` · **Size:** 1200 × 760 (16:10)
- **Prompt:** A young construction trainee in a hi-vis vest and hardhat on a bright, tidy building site, a crane and part-built structure softly blurred behind. Professional, capable, safe. Daylight.

### 5. Programme card — Advanced Nursing (GCAN) — `ait-prog-nursing`
- **File:** `ait-prog-nursing.jpg` · **Size:** 1200 × 760 (16:10)
- **Prompt:** A nursing student in navy-blue scrubs with a stethoscope in a clean, modern clinical training room, warm and caring expression, soft clinical lighting. Professional healthcare feel.

### 6. Partnered — Hospitality & Cookery — `ait-partnered-hospitality`
- **File:** `ait-partnered-hospitality.jpg` · **Size:** 1200 × 760 (16:10)
- **Prompt:** A chef in clean white uniform plating a beautiful dish in a professional stainless-steel commercial kitchen, focused and skilled, warm appetising light.

### 7. Partnered — Community Services — `ait-partnered-community`
- **File:** `ait-partnered-community.jpg` · **Size:** 1200 × 760 (16:10)
- **Prompt:** A kind young community-support worker smiling warmly beside an older person in a bright, comfortable care setting. Compassionate, respectful, genuine human connection.

### 8. Partnered — Hair & Beauty — `ait-partnered-beauty`
- **File:** `ait-partnered-beauty.jpg` · **Size:** 1200 × 760 (16:10)
- **Prompt:** A hair-and-beauty student working confidently with a client in a bright, modern salon, stylish and professional, soft natural light.

### 9. Skyline band (optional, for CTA bands) — `ait-skyline`
- **File:** `ait-skyline.jpg` · **Size:** 2400 × 800 (wide 3:1)
- **Prompt:** A wide Sydney harbour skyline at dusk — Opera House and Harbour Bridge silhouetted against a deep blue-to-purple sky, soft city lights along the water. Panoramic, calm, premium. No people, no text.

---

## About AIT page

### 10. About hero — AIT building — `ait-about-hero`
- **File:** `ait-about-hero.jpg` · **Size:** 1800 × 1200 (3:2 landscape)
- **Prompt:** A modern campus/education building with a confident, established feel, clean façade, framed by green trees and a blue sky, bright morning light. Room on the left/centre for a dark overlay with white heading text.

> The **founder portrait** (Dr Niroshan Ranaweera) is already in place.
> The **AusAsia logo** (A Journey From AusAsia) and the **Sri Lankan delivery-partner logos**
> (InSITE, First Friends, ESOFT, IIHS, AEHBA) are real logos — please send the files, not AI images.

---

## How to deliver

1. Name each file **exactly** as the `File` name above (e.g. `ait-hero.jpg`).
2. Put them in **one folder together with the images the site already uses** (the optimiser rebuilds
   the whole image map from the folders you pass, so anything not included is dropped).
3. From the project root, run the optimiser, listing **every** image folder:

   ```bash
   npm run images -- "<folder-with-all-images>"
   ```

   If your existing images live in a different folder, pass both:

   ```bash
   npm run images -- "<existing-images-folder>" "<new-ait-images-folder>"
   ```

4. This generates responsive WebP in `public/images/` and updates `src/api/mock/data/images.generated.ts`.
   Reload the site — the photos replace the placeholders automatically.

> Tip: keep one master folder with **all** delivered images so a single command always rebuilds
> everything correctly. Never hand-edit `images.generated.ts`.
