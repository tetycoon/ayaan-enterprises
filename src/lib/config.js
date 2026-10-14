/* Central business configuration */
export const SITE = {
  name: "Ayaan Enterprises",
  tagline: "Bulk Office Chair Repair, Deep Cleaning & Refurbishment in Chennai",
  logo: "/images/logo.png",
  phone: "+91 81222 33887",
  phoneLink: "+918122233887",
  whatsapp: "918122233887",
  email: "info@ayaanenterprises.com",
  address: "Plot No. 18, SIDCO Industrial Estate, Guindy, Chennai - 600032",
  hours: "Mon - Sat: 8:30 AM - 7:30 PM",
  city: "Chennai",
  serviceServing: "Serving Clients All Over Chennai",
  serviceAreas: ["Guindy", "OMR", "Porur", "Ambattur", "Central Chennai", "GST Road"],
  stats: {
    chairs: "35,000+",
    companies: "420+",
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
