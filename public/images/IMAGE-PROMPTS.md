# Website images: file names, sizes and AI prompts

Every image on the website loads from this `images/` folder.
Until a file exists, the page shows a striped placeholder with the **exact file name** it is waiting for.
Generate an image, save it with that name, refresh, and it appears in the right place.

## How to keep images consistent

1. **Use the exact file name** (lowercase, with hyphens) and the format shown (`.jpg` or `.png`).
2. **Use the size shown.** Every slot has a fixed shape (16:10, 4:3, 1:1). Images are cropped from the centre to fit, so keep the main subject in the middle.
3. **Add this style line to the end of every prompt** so all images look like one set:

   > photorealistic, bright natural daylight, clean modern corporate office in India, neutral colours with teal and navy accents, 35mm lens, shallow depth of field, no text, no logos, no watermark

4. **Before/after pairs:** generate the **after** image first. Then use your tool's *edit / image-to-image* feature on that same image to make the **before** version: "same chair, same angle, but old, stained, torn and broken". Both photos then line up exactly in the drag slider.
5. **Compress before uploading** (for example with squoosh.app, about 80% JPEG quality). Aim for under 250 KB per image.

---

## Home page (`index.html`)

| File | Size | Prompt |
|---|---|---|
| `hero-chair.jpg` | 1200×1200 (1:1) | Only shown if the 3D animation can't run. A single refurbished ergonomic mesh office chair, teal mesh back, navy seat, centred on a dark navy studio background with a soft teal rim light |
| `service-repair.jpg` | 1200×900 (4:3) | Technician in a navy uniform kneeling and replacing the gas lift cylinder of an office chair, tools on the floor, office background |
| `service-cleaning.jpg` | 1200×900 (4:3) | Close-up of a fabric office chair seat being cleaned with a hot-water extraction machine, visible clean stripe on a stained seat |
| `service-bulk.jpg` | 1200×900 (4:3) | Long row of 20 identical refurbished office chairs lined up neatly in an open-plan office |
| `service-amc.jpg` | 1200×900 (4:3) | Technician with a tablet checklist inspecting office chairs during a maintenance visit |
| `why-us-team.jpg` | 1200×900 (4:3) | Three technicians in navy uniforms working on several office chairs at once inside a corporate office, organised work area |
| `product-spare-parts.jpg` | 1000×1000 (1:1) | Flat-lay of new office chair spare parts on a white surface: gas lift, five castor wheels, star base, armrest, tilt mechanism |

## Before / after pairs (home + Our Work page)

| Files | Size | Prompt for the AFTER image (then edit it into BEFORE) |
|---|---|---|
| `work-1-after.jpg` / `work-1-before.jpg` | 1200×900 (4:3) | Grey fabric office chair, front three-quarter view, spotless fabric · BEFORE: same chair with coffee stains, dust and sweat marks |
| `work-2-after.jpg` / `work-2-before.jpg` | 1200×900 (4:3) | Black leatherette high-back executive chair, freshly re-upholstered · BEFORE: same chair with peeling, cracked leatherette and exposed foam |
| `work-3-after.jpg` / `work-3-before.jpg` | 1200×900 (4:3) | Lower half of an office chair: new chrome star base, gas lift and wheels · BEFORE: cracked plastic base, missing wheel, rusty cylinder |
| `work-4-after.jpg` / `work-4-before.jpg` | 1200×900 (4:3) | Black mesh office chair, clean mesh back · BEFORE: same chair with dusty, grimy mesh |
| `work-5-after.jpg` / `work-5-before.jpg` | 1200×900 (4:3) | Row of red fabric auditorium seats, clean and vibrant · BEFORE: faded, stained, dusty seats |
| `work-6-after.jpg` / `work-6-before.jpg` | 1200×900 (4:3) | Hospital waiting-area chairs with new blue vinyl covers · BEFORE: torn, faded covers |

## Chair Repair page (`chair-repair.html`)

| File | Size | Prompt |
|---|---|---|
| `page-repair.jpg` | 1600×1000 (16:10) | Technician's hands fitting a new gas lift into an upturned office chair, tools nearby, office background |
| `repair-onsite.jpg` | 1200×900 (4:3) | On-site repair station in a corporate office corner, several chairs upside down, neat tool box |
| `repair-parts.jpg` | 1200×900 (4:3) | New chair spare parts neatly laid out: gas lifts, castor wheels, nylon star base, mechanism |

## Chair Cleaning page (`chair-cleaning.html`)

| File | Size | Prompt |
|---|---|---|
| `page-cleaning.jpg` | 1600×1000 (16:10) | Cleaner using an upholstery extraction wand on a blue fabric office chair, foam visible |
| `cleaning-after.jpg` / `cleaning-before.jpg` | 1200×900 (4:3) | Close-up of a blue fabric chair seat, perfectly clean · BEFORE: same seat with heavy stains (make this one with an edit) |

## Bulk / Corporate page (`bulk-service.html`)

| File | Size | Prompt |
|---|---|---|
| `page-bulk.jpg` | 1600×1000 (16:10) | Large open-plan office floor with rows of matching refurbished mesh chairs at workstations |
| `industry-corporate.jpg` | 1600×1000 (16:10) | Modern IT office workstations with ergonomic chairs |
| `industry-education.jpg` | 1600×1000 (16:10) | College classroom with rows of student chairs |
| `industry-hospital.jpg` | 1600×1000 (16:10) | Clean hospital waiting area with rows of chairs |
| `industry-callcentre.jpg` | 1600×1000 (16:10) | Call centre floor with headsets on desks and many office chairs |
| `industry-coworking.jpg` | 1600×1000 (16:10) | Stylish co-working space with designer office chairs |
| `industry-government.jpg` | 1600×1000 (16:10) | Formal government or bank office with wooden desks and executive chairs |
| `bulk-report.jpg` | 1200×900 (4:3) | Tablet on a desk showing a grid of before/after chair photos, next to a printed quotation |

## AMC page (`amc.html`)

| File | Size | Prompt |
|---|---|---|
| `page-amc.jpg` | 1600×1000 (16:10) | Technician doing a scheduled check-up, testing the height adjustment of an office chair |
| `amc-visit.jpg` | 1200×900 (4:3) | Close-up of a clipboard maintenance checklist with ticks, office chairs blurred in the background |

## Products page (`products.html`)

| File | Size | Prompt |
|---|---|---|
| `page-products.jpg` | 1600×1000 (16:10) | Showroom with a range of new office chairs: mesh, executive and visitor chairs |
| `product-mesh-chair.jpg` | 1000×1000 (1:1) | New black ergonomic mesh chair with headrest, plain light-grey background, product photo |
| `product-office-chair.jpg` | 1000×1000 (1:1) | New fabric revolving workstation chair, plain light-grey background, product photo |
| `product-executive-chair.jpg` | 1000×1000 (1:1) | New high-back black leatherette executive chair, plain light-grey background |
| `product-visitor-chair.jpg` | 1000×1000 (1:1) | Two cantilever visitor chairs and a stackable training chair, plain light-grey background |
| `part-gas-lift.jpg` | 1200×900 (4:3) | Chrome and black office chair gas lift cylinder, white background |
| `part-wheels.jpg` | 1200×900 (4:3) | Set of five black twin-wheel castors, white background |
| `part-base.jpg` | 1200×900 (4:3) | Five-star chrome office chair base, top view, white background |
| `part-mechanism.jpg` | 1200×900 (4:3) | Office chair synchro tilt mechanism with lever, white background |
| `part-armrest.jpg` | 1200×900 (4:3) | Pair of adjustable office chair armrests, white background |
| `part-foam-fabric.jpg` | 1200×900 (4:3) | Moulded seat foam with fabric and leatherette swatches in navy, grey and teal |

## Our Work page (`our-work.html`)

| File | Size | Prompt |
|---|---|---|
| `page-work.jpg` | 1600×1000 (16:10) | Neat row of freshly refurbished office chairs ready for handover, wrapped in clear plastic |
| `client-1.png` … `client-6.png` | 600×400 (3:2), transparent PNG | **Use real client logos, with their permission.** Do not generate them. |

> The homepage 3D chair is built in code (`js/hero3d.js`). It needs no image.
