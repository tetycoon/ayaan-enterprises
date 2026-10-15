// Google reviews shown in the home page "What Our Customers Say" section.
//
// These are maintained by hand. They are NOT fetched live from Google, so update them yourself
// when the Google profile changes. The reviews were posted on the Innodesk Chennai Google
// profile (Innodesk Chennai and Ayaan Enterprises are branches of the same company), and the
// section says so. Only add reviews copied word for word from that profile.
//
// `date` is Google's relative date ("3 months ago") exactly as shown when the review was copied,
// on DATES_COPIED_ON below. Google's wording changes over time, so refresh both together.
// `excerpt: true` marks a review that Google showed truncated; only the visible part is used.

export const GOOGLE_PROFILE = {
  name: "Innodesk Chennai",
  url: "https://www.google.com/maps/place/Innodesk+Chennai/@12.9676861,80.2166465,808m/data=!3m1!1e3!4m15!1m8!3m7!1s0x3a525dde113a7bad:0xe5d54a667025e785!2sInnodesk+Chennai!8m2!3d12.9676861!4d80.2166465!10e5!16s%2Fg%2F11mcwdbmg5!3m5!1s0x3a525dde113a7bad:0xe5d54a667025e785!8m2!3d12.9676861!4d80.2166465!16s%2Fg%2F11mcwdbmg5",
  // Set to a Google "write a review" link to show the "Write a Review" button; leave null to hide it.
  writeReviewUrl: null,
  rating: 5.0,
  totalReviews: 29
};

export const DATES_COPIED_ON = "2026-10-15";

export const REVIEWS = [
  {
    name: "Jayashree Kidambi",
    rating: 5,
    date: "3 months ago",
    excerpt: true,
    text: "I purchased my office furnitures from Innodesk. It was not just about the quality of furnitures but also the customer care, ensuring that the furnitures reached on time."
  },
  {
    name: "ATS. GOPI",
    rating: 5,
    date: "11 months ago",
    text: "We recently purchased furniture for our new office expansion, and we are extremely satisfied! The quality is excellent, and it was exactly what we expected. Delivery was on time, and the executive's interaction, service, and support were all outstanding. Highly recommend!"
  },
  {
    name: "Mahesh Paramasivan",
    rating: 5,
    date: "3 months ago",
    text: "I procured this chair for our office and it has turned out to be an excellent product. The quality is very good, and it fully meets our expectations. I would highly recommend it. Additionally, I would appreciate an improvement in the delivery speed."
  }
];
