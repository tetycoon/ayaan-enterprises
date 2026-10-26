// Office furniture catalogue: header dropdown, /office-furniture landing page and the eight
// category pages all read from here.
//
// Images: only the client's own product photos, client-supplied photos, or Pexels-licensed photos
// already in the project (see public/images/CREDITS.md) that genuinely show the category.
// Categories without a product gallery yet (`gallery: null`) show a WhatsApp photo request instead.
// Gallery photos may set `zoom` when a wide photo is cropped into the 4:3 tile (see components/Photo.js).
// No prices, stock, materials, measurements, warranties or features are stated anywhere.

const P = "/images/products";
const F = "/images/furniture"; // client-supplied furniture photos

const ARMCHAIR_PHOTO = {
  src: `${F}/lounge-armchair-tan.jpg`,
  alt: "Tan upholstered lounge armchair with slim dark wooden legs"
};
const BOSS_TABLE_HERO = {
  src: `${F}/boss-table-brown-l-desk-black-chair-hd.png`,
  alt: "Brown wood-finish L-shaped executive desk with a dark grey panel base and a black high-back leather chair",
  contain: true, // cut-out product shot on white
  fill: true // fill the frame edge to edge; only the white margins around the desk are trimmed
};
const BOSS_TABLE_PHOTOS = [
  {
    src: `${F}/boss-table-wood-l-desk-grey-panel.jpg`,
    alt: "L-shaped office table with a wood-finish top, slanted wood side panel and grey pedestal"
  },
  {
    src: `${F}/boss-table-white-executive-desk-grey-panel.jpg`,
    alt: "White glossy executive desk with dark grey side panels and a wrapped high-back chair in an office"
  },
  {
    src: `${F}/boss-table-white-top-l-desk-brown-cabinet.jpg`,
    alt: "L-shaped office table with a white top, dark brown body and a matching wooden cabinet along the wall"
  }
];
const MANAGER_TABLE_HERO = {
  src: `${F}/manager-table-white-desk-office.jpg`,
  alt: "Manager working on a tablet at a white L-shaped desk with white legs and a grey mesh chair in a bright office",
  position: "50% 55%" // same 16:10 frame as Office Workstations; keep the person and desk top in view
};
const MANAGER_TABLE_PHOTOS = [
  {
    src: `${F}/manager-table-walnut-shelf-pedestal.jpg`,
    alt: "Walnut-finish L-shaped manager desk with an open shelf pedestal and a grey mesh chair"
  },
  {
    src: `${F}/manager-table-walnut-white-mobile-pedestal.jpg`,
    alt: "Walnut-finish manager desk with a white mobile pedestal drawer unit on castors"
  },
  {
    src: `${F}/manager-table-oak-tapered-legs-return.jpg`,
    alt: "Light oak L-shaped manager desk with tapered black metal legs and a matching return"
  },
  {
    src: `${F}/manager-table-oak-white-frame-l-desk.jpg`,
    alt: "Oak-finish L-shaped manager desk with a white loop frame and a black mesh high-back chair"
  }
];
const CONFERENCE_TABLE_PHOTOS = [
  {
    src: `${F}/conference-boardroom-grey-mesh.jpg`,
    alt: "Boardroom with a long U-shaped wood-finish conference table, cable ports and grey mesh chairs"
  },
  {
    src: `${F}/conference-table-meeting-room-screen.jpg`,
    alt: "Meeting room with a light wood conference table, black cantilever chairs and a wall-mounted screen"
  },
  {
    src: `${F}/conference-table-maple-white-legs.jpg`,
    alt: "Maple-finish conference table with rounded corners, white steel legs and cable management ports"
  }
];
// Upright cabinet photos, shown whole (contain) so the tall units aren't cropped.
const CABINET_PHOTOS = [
  {
    src: `${F}/cabinet-steel-locker-15-door-blue.jpg`,
    alt: "Steel staff locker with fifteen lockable blue doors in a white frame",
    contain: true
  },
  {
    src: `${F}/cabinet-steel-glass-doors.jpg`,
    alt: "Grey steel storage cabinet with two lockable glass doors and adjustable shelves",
    contain: true
  },
  {
    src: `${F}/cabinet-wooden-cupboards-set.jpg`,
    alt: "Set of four light wood two-door office cupboards in graded heights",
    contain: true
  }
];

// ---------- Chair models (client's own product photos) ----------
// `back` groups chairs on the Ergonomics page (back height, plus pantry and lobby chairs);
// `seating` groups them on the Office Seating page.
export const CHAIRS = [
  {
    id: "ergo-multizone-black",
    back: "high-back",
    seating: "ergonomic",
    name: "High-Back Ergonomic Chair · Black Mesh & Chrome Base",
    images: [
      { src: `${P}/ergonomic-highback-black.jpg`, alt: "Black high-back ergonomic mesh chair with headrest and chrome base, front view" },
      { src: `${P}/ergonomic-highback-black-back.jpg`, alt: "Black high-back ergonomic mesh chair, rear view showing the back frame" }
    ]
  },
  {
    id: "ergo-multizone-grey",
    back: "high-back",
    seating: "ergonomic",
    name: "High-Back Ergonomic Chair · Grey Mesh & Chrome Base",
    images: [{ src: `${P}/ergonomic-multizone-grey.jpg`, alt: "Grey high-back ergonomic mesh chair with headrest and chrome base" }]
  },
  {
    id: "flip-arm-grey",
    back: "high-back",
    seating: "ergonomic",
    name: "High-Back Mesh Chair · Grey with Flip-Up Arms",
    badge: "Showroom photos",
    images: [
      { src: `${P}/highback-dark-brown-leather-chrome.jpg`, alt: "Dark brown leatherette high-back office chair with padded chrome arms and chrome base" },
      { src: `${P}/flip-arm-highback-grey-showroom-1.jpg`, alt: "Grey high-back mesh chair with headrest and flip-up armrests, angled view in the showroom" },
      { src: `${P}/flip-arm-highback-grey-showroom-3.jpg`, alt: "Grey high-back mesh chair, side and rear view showing the headrest bracket and recline knob" }
    ]
  },
  {
    id: "mesh-hb-grey-chrome",
    back: "high-back",
    seating: "ergonomic",
    name: "High-Back Mesh Chair · Grey Mesh, White Arms & Chrome Base",
    images: [
      { src: `${P}/mesh-highback-grey-chrome.jpg`, alt: "Grey high-back mesh chair with headrest, white armrests and chrome base, front view" },
      { src: `${P}/mesh-highback-grey-chrome-back.jpg`, alt: "Grey high-back mesh chair with headrest, rear view showing the lumbar support" }
    ]
  },
  {
    id: "mesh-hb-white-frame",
    back: "high-back",
    seating: "ergonomic",
    name: "High-Back Mesh Chair · White Frame & Grey Mesh",
    images: [
      { src: `${P}/mesh-highback-white-grey.jpg`, alt: "High-back mesh chair with white frame, grey mesh, headrest and white base, front view" },
      { src: `${P}/mesh-highback-white-grey-back.jpg`, alt: "High-back mesh chair with white frame, rear view" }
    ]
  },
  {
    id: "ergo-y-back-black",
    back: "high-back",
    seating: "ergonomic",
    name: "High-Back Ergonomic Chair · Black Mesh with Headrest",
    images: [{ src: `${P}/ergonomic-headrest-black.png`, alt: "Black high-back ergonomic mesh chair with headrest and adjustable arms, front view" }]
  },
  {
    id: "mesh-hb-black-headrest",
    back: "high-back",
    seating: "ergonomic",
    name: "High-Back Mesh Chair · Black with Headrest",
    images: [{ src: `${P}/mesh-highback-black-headrest.png`, alt: "Black high-back mesh chair with headrest and lumbar pad, front view" }]
  },
  {
    id: "mesh-hb-black-rear",
    back: "high-back",
    seating: "ergonomic",
    name: "High-Back Mesh Chair · Black Frame & Black Mesh",
    images: [{ src: `${P}/mesh-highback-black-back.png`, alt: "Black high-back mesh chair with headrest, rear view showing the lumbar support" }]
  },
  {
    id: "mesh-hb-black-side",
    back: "high-back",
    seating: "ergonomic",
    name: "High-Back Mesh Chair · Black with Chrome Base",
    images: [{ src: `${P}/mesh-highback-black-side.png`, alt: "Black high-back mesh chair with headrest and chrome base, side view" }]
  },
  {
    id: "mesh-mb-white-frame",
    back: "mid-back",
    seating: "ergonomic",
    name: "Mid-Back Mesh Chair · White Frame & Grey Mesh",
    images: [
      { src: `${P}/mesh-midback-white-grey-angle.jpg`, alt: "Mid-back mesh chair with white frame, grey mesh and white base, angled view" },
      { src: `${P}/mesh-midback-white-grey-front.jpg`, alt: "Mid-back mesh chair with white frame and grey mesh, front view" },
      { src: `${P}/mesh-midback-white-grey-back.jpg`, alt: "Mid-back mesh chair with white frame, rear view" }
    ]
  },
  {
    id: "mesh-mb-grey-chrome",
    back: "mid-back",
    seating: "ergonomic",
    name: "Mid-Back Mesh Chair · Grey Mesh, White Arms & Chrome Base",
    images: [{ src: `${P}/mesh-midback-grey-chrome.jpg`, alt: "Grey mid-back mesh chair with white armrests and chrome base" }]
  },
  {
    id: "mesh-mb-black-lumbar",
    back: "mid-back",
    seating: "ergonomic",
    name: "Mid-Back Mesh Chair · Black with Lumbar Pad",
    images: [{ src: `${P}/mesh-midback-black.png`, alt: "Black mid-back mesh chair with lumbar pad and adjustable arms, front view" }]
  },
  {
    id: "mesh-mb-black-grey-frame",
    back: "mid-back",
    seating: "ergonomic",
    name: "Mid-Back Mesh Chair · Black Mesh & Grey Back Frame",
    images: [
      { src: `${P}/mesh-midback-black-front.png`, alt: "Black mid-back mesh chair with grey back frame and adjustable arms, angled view" },
      { src: `${P}/mesh-midback-black-angle.png`, alt: "Black mid-back mesh chair with grey back frame, side angle" }
    ]
  },
  {
    id: "mesh-mb-black-t-arms",
    back: "mid-back",
    seating: "ergonomic",
    name: "Mid-Back Mesh Chair · Black with Fixed T-Arms",
    images: [{ src: `${P}/workstation-midback-black.png`, alt: "Black mid-back mesh workstation chair with fixed T-shaped armrests" }]
  },
  {
    id: "compact-low-back",
    seating: "ergonomic",
    name: "Low-Back Mesh Chair · Black with Loop Arms",
    images: [{ src: `${P}/compact-lowback-black.jpg`, alt: "Black low-back mesh office chair with fixed loop armrests" }]
  },
  {
    id: "exec-leatherette",
    seating: "executive",
    name: "Executive High-Back Chair · Black Leatherette & Chrome",
    images: [{ src: `${P}/executive-leatherette-black.jpg`, alt: "Black high-back leatherette executive chair with chrome armrests and chrome base" }]
  },
  {
    id: "exec-leatherette-padded",
    seating: "executive",
    name: "Executive High-Back Chair · Padded Black Leatherette",
    images: [{ src: "/images/hero-executive.jpg", alt: "High-back black leatherette executive chair with padded headrest, chrome arms and chrome base" }]
  },
  {
    id: "waiting-beam",
    seating: "visitor",
    name: "Waiting Area Seating · Beam-Mounted Chairs",
    cover: true,
    images: [{ src: "/images/chairs-waiting.jpg", alt: "Black beam-mounted waiting area chairs with perforated steel seats" }]
  },
  {
    id: "lounge-armchair",
    seating: "visitor",
    name: "Lounge Armchair · Tan Upholstery & Wooden Legs",
    images: [ARMCHAIR_PHOTO]
  },
  {
    id: "pantry-chair",
    seating: "visitor",
    name: "Pantry Chair · Office Pantry & Staff Dining",
    images: [
      { src: "/images/chair-pantry.jpg", alt: "Grey moulded shell pantry chair with a padded seat and black steel legs" },
      { src: "/images/chair-pantry-stool.jpg", alt: "Grey high pantry stool with a spindle back, padded seat and footrest" }
    ]
  },
  {
    id: "auditorium",
    seating: "auditorium",
    name: "Auditorium Seating · Red Upholstered Rows",
    cover: true,
    images: [{ src: "/images/chairs-auditorium.jpg", alt: "Rows of red upholstered auditorium seats" }]
  },
  {
    id: "pantry-shell-wooden-legs",
    back: "pantry",
    name: "Pantry Chair · Moulded Shell with Wooden Legs",
    images: [
      {
        src: `${P}/pantry-chair-shell-wooden-legs-colours.jpg`,
        alt: "Four moulded shell pantry chairs with padded seats and wooden legs in black, red, blue and orange"
      }
    ]
  },
  {
    id: "lobby-slatted-shell-armchair",
    back: "lobby",
    name: "Lobby Chair · Slatted-Back Shell Armchair",
    images: [
      {
        src: `${P}/lobby-chair-slatted-shell-armchair-colours.jpg`,
        alt: "Slatted-back shell armchairs with padded seats and black metal legs in black, white, green, yellow, navy and purple"
      }
    ]
  }
];

export const ERGONOMIC_GROUPS = [
  { id: "high-back", label: "High-Back" },
  { id: "mid-back", label: "Mid-Back" },
  { id: "pantry", label: "Pantry Chairs" },
  { id: "lobby", label: "Lobby Chairs" }
];

export const SEATING_GROUPS = [
  { id: "executive", label: "Executive" },
  { id: "ergonomic", label: "Ergonomic & Task" },
  { id: "visitor", label: "Visitor & Lounge" },
  { id: "auditorium", label: "Auditorium" }
];

export const chairQuoteHref = (name) =>
  `/quote?service=${encodeURIComponent("Buy New Office Chairs")}&items=${encodeURIComponent(`1x ${name}`)}`;

// ---------- Categories ----------
export const OFFICE_FURNITURE = [
  {
    slug: "boss-tables",
    label: "Boss Tables",
    blurb: "Executive and manager tables for management offices.",
    title: "Boss Tables & Executive Office Tables in Chennai | Ayaan Enterprises",
    description:
      "Executive office tables and boss tables for management offices and professional workspaces. Discuss your office layout and requirements with Ayaan Enterprises, Chennai.",
    h1: "Executive Office Tables for Professional Workspaces",
    intro:
      "Create a professional workspace with executive office tables designed for everyday work, meetings, and management offices. Explore office table styles that suit different workspace layouts and business needs. Contact AYAAN ENTERPRISES to discuss your requirements and find a suitable table for your office.",
    hero: { ...BOSS_TABLE_HERO },
    gallery: {
      type: "photos",
      heading: "Boss table styles",
      note: "A few of the executive table styles we can supply. Ask us for photos of more options.",
      photos: BOSS_TABLE_PHOTOS,
      catalogue: true // keep the WhatsApp photo-request card below the gallery
    },
    tips: [
      "The size of the cabin or room where the table will be placed",
      "Your preferred table shape, finish and colour",
      "Whether you would like matching storage or side units",
      "How many tables you need and your timeline"
    ],
    related: ["manager-tables", "conference-tables", "office-cabinets", "office-workstations"]
  },
  {
    slug: "manager-tables",
    label: "Manager Tables",
    blurb: "Manager and team leader desks for supervisor cabins and offices.",
    title: "Manager Tables & Desks for Supervisor Cabins in Chennai | Ayaan Enterprises",
    description:
      "Manager tables and desks for team leaders, supervisors and department heads. Share your room size and requirements with Ayaan Enterprises, Chennai.",
    h1: "Manager Tables for Team Leaders and Supervisors",
    intro:
      "Give your managers a practical desk for daily work, planning and team discussions. Explore manager table styles in wood, white and oak finishes, with L-shaped layouts and storage options for supervisor cabins and department offices. Contact AYAAN ENTERPRISES to discuss the table that suits your team and space.",
    hero: { ...MANAGER_TABLE_HERO },
    gallery: {
      type: "photos",
      heading: "Manager table styles",
      note: "A few of the manager table styles we can supply. Ask us for photos of more options.",
      photos: MANAGER_TABLE_PHOTOS,
      catalogue: true // keep the WhatsApp photo-request card below the gallery
    },
    tips: [
      "The size of the cabin or desk area where the table will be placed",
      "Whether the manager needs a side return or a storage pedestal",
      "Your preferred finish, such as wood, white or oak",
      "How many tables you need and your timeline"
    ],
    related: ["boss-tables", "office-cabinets", "office-workstations"]
  },
  {
    slug: "ergonomics",
    label: "Ergonomics",
    blurb: "Ergonomic chairs and furniture for everyday office use.",
    title: "Ergonomic Office Chairs & Furniture in Chennai | Ayaan Enterprises",
    description:
      "Ergonomic office chairs and furniture for everyday office use. View photos of high-back and mid-back mesh chair models and send an enquiry to Ayaan Enterprises.",
    h1: "Ergonomic Furniture for Comfortable Workspaces",
    intro:
      "Build a more comfortable and practical workspace with ergonomic office furniture. Explore seating and workstation options designed to support comfortable working positions and everyday office use. Contact AYAAN ENTERPRISES to discuss the furniture options suitable for your workplace.",
    hero: {
      src: `${F}/ergonomic-cream-tan-leather-highback.jpg`,
      alt: "Cream leatherette high-back office chair with tan side panels, padded chrome arms and chrome base",
      contain: true // cut-out product shot: show the whole chair on white
    },
    gallery: {
      type: "chairs",
      heading: "Ergonomic chair models",
      text: "Hover over a chair to see another angle, or open it to view all of its photos.",
      groupKey: "back",
      groups: ERGONOMIC_GROUPS
    },
    tips: [
      "How many people or workstations you are furnishing",
      "Your preferred back height: high-back or mid-back",
      "Preferred mesh and frame colours",
      "Whether you also need desks or workstations"
    ],
    related: ["office-seating", "office-workstations", "boss-tables"]
  },
  {
    slug: "conference-tables",
    label: "Conference Tables",
    blurb: "Tables for meeting rooms, boardrooms and team spaces.",
    title: "Conference & Meeting Room Tables in Chennai | Ayaan Enterprises",
    description:
      "Conference tables for meeting rooms, boardrooms and collaborative workspaces. Share your room layout with Ayaan Enterprises to discuss table styles and configurations.",
    h1: "Conference Tables for Meetings and Team Discussions",
    intro:
      "Create a well-organised meeting space with conference tables suited to your office layout and team requirements. Explore furniture options for meeting rooms, boardrooms, and collaborative workspaces. Contact AYAAN ENTERPRISES to discuss suitable table styles and configurations for your office.",
    hero: { ...CONFERENCE_TABLE_PHOTOS[0] },
    gallery: {
      type: "photos",
      heading: "Meeting room settings",
      note: "Example meeting room photos. Ask us for photos of the conference tables currently available.",
      photos: CONFERENCE_TABLE_PHOTOS
    },
    tips: [
      "The dimensions of the meeting room",
      "How many people the table should seat",
      "Your preferred table shape and finish",
      "Whether you also need conference chairs"
    ],
    related: ["office-seating", "boss-tables", "office-workstations"]
  },
  {
    slug: "office-workstations",
    label: "Office Workstations",
    blurb: "Individual, shared and team workstation layouts.",
    title: "Office Workstations for Teams & Open-Plan Offices | Ayaan Enterprises",
    description:
      "Office workstations for individual desks, shared desks and team work areas. Discuss workstation layouts that fit your office with Ayaan Enterprises, Chennai.",
    h1: "Office Workstations for Productive Teams",
    intro:
      "Organise your office with workstations designed to make better use of available space and support everyday team activities. Explore workstation layouts for individual employees, shared desks, and team work areas. Contact AYAAN ENTERPRISES to discuss workstation options that fit your office layout.",
    hero: { src: "/images/industry-corporate.jpg", alt: "Open-plan office with rows of desks and ergonomic chairs" },
    gallery: {
      type: "photos",
      heading: "Workstation layouts",
      note: "Example workstation photos. Ask us for photos of the workstation options currently available.",
      photos: [
        { src: `${F}/workstation-blue-partition-cubicles.jpg`, alt: "Rows of partitioned office workstations with blue and light wood panels and black chairs" },
        { src: `${F}/workstation-linear-bench-open-plan.jpg`, alt: "Long linear bench workstations with white desk screens and new mesh chairs in an open-plan office" },
        { src: `${F}/workstation-shared-desk-glass-screens.jpg`, alt: "Shared four-seat workstation desk with frosted glass screens and grey steel legs" }
      ]
    },
    tips: [
      "How many seats you need now, and any planned growth",
      "Your floor area, or a layout drawing if you have one",
      "Whether you want single desks, shared desks or partitioned workstations",
      "Whether each seat needs a pedestal or storage"
    ],
    related: ["ergonomics", "office-cabinets", "office-seating"]
  },
  {
    slug: "office-cabinets",
    label: "Office Cabinets",
    blurb: "Cabinets and storage for documents and supplies.",
    title: "Office Cabinets & Storage Furniture in Chennai | Ayaan Enterprises",
    description:
      "Office cabinets and storage furniture for documents, office supplies and everyday business items. Enquire with Ayaan Enterprises about storage for your office.",
    h1: "Office Cabinets and Storage Furniture",
    intro:
      "Keep your workspace organised with office cabinets and storage furniture for documents, office supplies, and everyday business items. Explore storage styles that suit your office layout and organisational needs. Contact AYAAN ENTERPRISES to enquire about suitable storage furniture for your workplace.",
    hero: { ...CABINET_PHOTOS[0] },
    gallery: {
      type: "photos",
      heading: "Storage furniture",
      note: "A few examples of the storage we can supply. Ask us for photos of more options.",
      photos: CABINET_PHOTOS,
      catalogue: true // keep the WhatsApp photo-request card below the gallery
    },
    tips: [
      "What you need to store, such as files, supplies or personal items",
      "The wall or floor space available",
      "How many storage units you need",
      "Whether you prefer lockable or open storage"
    ],
    related: ["office-workstations", "boss-tables", "conference-tables"]
  },
  {
    slug: "office-seating",
    label: "Office Seating",
    blurb: "Executive, task, visitor and meeting room chairs.",
    title: "Office Seating: Executive, Task & Visitor Chairs | Ayaan Enterprises",
    description:
      "Office seating for workstations, executive cabins, meeting rooms and visitor areas. View chair photos and discuss seating options with Ayaan Enterprises, Chennai.",
    h1: "Office Seating for Everyday Work and Meetings",
    intro:
      "Explore office seating options for workstations, executive cabins, meeting rooms, and visitor areas. Choose styles that suit the intended use and design of your workspace. Contact AYAAN ENTERPRISES to discuss your seating requirements and available options.",
    hero: {
      src: `${F}/seating-black-mesh-headrest.webp`,
      alt: "Black ergonomic mesh office chair with headrest, lumbar support and adjustable arms",
      contain: true // cut-out product shot: show the whole chair on white
    },
    gallery: {
      type: "chairs",
      heading: "Office chairs by type",
      text: "Filter by where the chairs will be used, then open a chair to view all of its photos.",
      groupKey: "seating",
      groups: SEATING_GROUPS
    },
    tips: [
      "Where the chairs will be used: workstations, cabins, meeting rooms or visitor areas",
      "How many chairs you need for each area",
      "Your preferred style, colour and upholstery",
      "Your delivery timeline"
    ],
    related: ["ergonomics", "conference-tables", "boss-tables"]
  }
];

export const officeFurnitureHref = (slug) => `/office-furniture/${slug}`;
export const getFurnitureCategory = (slug) => OFFICE_FURNITURE.find((c) => c.slug === slug);
export const furnitureEnquiryHref = (label) =>
  `/quote?service=${encodeURIComponent("Office Furniture")}&category=${encodeURIComponent(label)}`;

// Chairs shown in a category gallery: every chair that has a value for the gallery's group key.
export const chairsFor = (groupKey) => CHAIRS.filter((c) => c[groupKey]);
