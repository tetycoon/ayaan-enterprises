/* Central business configuration */
export const SITE = {
  name: "Ayaan Enterprises",
  tagline: "Bulk Office Chair Repair, Deep Cleaning & Refurbishment in Chennai",
  logo: "/images/logo-2026.png",
  phone: "+91 97907 33887",
  phoneLink: "+919790733887",
  whatsapp: "918122233887",
  whatsappDisplay: "+91 81222 33887",
  email: "info@ayaanenterprises.com",
  address: "2nd Floor, ANANDHAM ELITE, 1, MRTS Road, 1st Street, Velachery, Chennai, Tamil Nadu 600042, India.",
  // Footer map: the Google Maps listing for this building is "Innodesk Chennai" (same company).
  map: {
    lat: 12.9676861,
    lng: 80.2166465,
    listing: "Innodesk Chennai"
  },
  hours: "Mon - Sat: 10:00 AM - 7:00 PM",
  city: "Chennai",
  serviceServing: "Serving Clients All Over Chennai",
  stats: {
    chairs: "10,000+",
    companies: "400+",
    turnaround: "48 hrs",
    savingsPct: "up to 70%"
  },
  currency: "₹"
};

export function waLink(msg) {
  return (
    "https://wa.me/" +
    SITE.whatsapp +
    "?text=" +
    encodeURIComponent(msg || "Hi, I need a quote for office chair repair / cleaning in Chennai.")
  );
}
