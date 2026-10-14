# Chair Service Website & Service Management

A service-first website (repair and cleaning first, products second) plus a staff panel that tracks every enquiry through to payment.

## Run it
```
node serve.js        # then open http://localhost:8080
```
Or open `index.html` directly in a browser.

## Pages
| Page | File |
|---|---|
| Home (3D animated hero) | `index.html` |
| Chair repair | `chair-repair.html` |
| Old chair cleaning | `chair-cleaning.html` |
| Bulk / corporate service | `bulk-service.html` |
| Maintenance contract (AMC) | `amc.html` |
| Products supplied | `products.html` |
| Completed work & clients | `our-work.html` |
| Quote form (quantity + photos) | `quote.html` |
| Staff panel | `admin.html` (default PIN `1234`) |

WhatsApp, call and callback buttons appear on every page.

## What to edit first
1. `js/config.js`: business name, phone, WhatsApp number, email, address, service areas, stats.
2. `images/`: add photos using the names in `images/IMAGE-PROMPTS.md`.
3. Testimonials, stats and project captions in the HTML are sample text. Replace them with real ones.
4. Admin → Settings: GSTIN, bank/UPI details, quotation terms, technicians, PIN.

## Staff panel workflow
Enquiry → Site inspection → Quotation (print/PDF) → Job (schedule, technicians, batch progress, before/after photos, photo report) → Invoice (payments, reminders) → Next-service follow-up → Reports.

## Important before going live
Data is stored in the **browser's localStorage**. That works for a demo or for one office computer, but:
- Website enquiries only reach the staff panel if both are opened **in the same browser**.
- The PIN screen is not real security.

For production, connect `js/store.js` to a backend (Firebase, Supabase, or a PHP/Node API with a database) and add proper login. Every read and write goes through `Store.load()` and `Store.save()`, so only that file needs to change.
