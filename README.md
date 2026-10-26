# Chair Servicing & Refurbishment Portal (Next.js)

A complete corporate chair repair, deep cleaning, refurbishment, and sales platform. Built with modern **Next.js (App Router)**, **React 19**, and **Tailwind CSS**.

---

## 🚀 Running the Project

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm run start
```

---

## 📂 Routes & Architecture

| Route | Description |
|---|---|
| `/` | Homepage with hero slideshow, service highlights, process, and Before/After showcase |
| `/chair-repair` | On-site repair services (gas lifts, wheels, mechanisms, armrests, foam) |
| `/chair-cleaning` | Deep cleaning & shampoo extraction for fabric, mesh, and leatherette chairs |
| `/bulk-service` | Bulk / corporate refurbishment with controlled zero-downtime batches |
| `/seating` | Premium ergonomic seating collections |
| `/products` | Supply of new chairs and spare parts |
| `/shop` | Interactive chair catalogue with category filtering and enquiry cart |
| `/our-work` | Interactive Before & After comparison sliders |
| `/quote` | Multi-step quote request form with photo upload and WhatsApp integration |

---

## 🛠️ Key Modules & Stack

* **`src/app/`**: Next.js App Router structure with dedicated route pages.
* **`src/components/`**: Reusable UI components:
  * `Header.js`: Dynamic navigation, contact numbers, mobile drawer, and CTA.
  * `Footer.js`: Global footer with service links and contact details.
  * `HeroSlides.js`: Dynamic hero slideshow with zoom animation, swipe, and progress bar.
  * `BeforeAfterSlider.js`: Interactive drag-slider for before/after transformations.
  * `FloatingActions.js`: Fixed WhatsApp, Call, and Callback buttons.
  * `CallbackModal.js`: Fast callback request modal integrated with the store.
* **`src/lib/config.js`**: Centralized business profile (company name, phone numbers, WhatsApp, addresses, service regions).
* **`src/lib/store.js`**: Client-side data layer with canvas photo compression and auto-sequenced IDs.
* **`src/styles/`**: Custom stylesheets (`style.css`) paired with Tailwind CSS v4.
