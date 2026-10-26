// Line icons for the office furniture categories (decorative; always paired with a text label).
const PATHS = {
  "boss-tables": (
    <>
      <path d="M5 17h38" />
      <path d="M8 17v20M40 17v20" />
      <rect x="26" y="17" width="14" height="14" rx="1.5" />
      <path d="M30 22h6M30 27h6" />
    </>
  ),
  "manager-tables": (
    <>
      <path d="M5 18h38" />
      <path d="M8 18v19M40 18v19" />
      <rect x="28" y="18" width="12" height="11" rx="1.5" />
      <path d="M31 24h6" />
    </>
  ),
  ergonomics: (
    <>
      <rect x="17" y="5" width="14" height="6" rx="3" />
      <path d="M24 11v3" />
      <path d="M16 14h16l-2 14H18z" />
      <path d="M13 30h22" />
      <path d="M24 30v8M16 43l8-5 8 5" />
      <path d="M12 22v8M36 22v8" />
    </>
  ),
  "conference-tables": (
    <>
      <ellipse cx="24" cy="24" rx="13" ry="7" />
      <circle cx="24" cy="10" r="2.5" />
      <circle cx="24" cy="38" r="2.5" />
      <circle cx="6" cy="24" r="2.5" />
      <circle cx="42" cy="24" r="2.5" />
      <circle cx="13" cy="12" r="2.5" />
      <circle cx="35" cy="12" r="2.5" />
      <circle cx="13" cy="36" r="2.5" />
      <circle cx="35" cy="36" r="2.5" />
    </>
  ),
  "office-workstations": (
    <>
      <path d="M4 30h40" />
      <path d="M24 12v18" />
      <path d="M7 30v12M41 30v12" />
      <rect x="9" y="18" width="10" height="7" rx="1" />
      <rect x="29" y="18" width="10" height="7" rx="1" />
      <path d="M14 25v5M34 25v5" />
    </>
  ),
  "office-cabinets": (
    <>
      <rect x="12" y="4" width="24" height="40" rx="2" />
      <path d="M12 17h24M12 30h24" />
      <path d="M21 10.5h6M21 23.5h6M21 36.5h6" />
    </>
  ),
  "office-seating": (
    <>
      <path d="M14 8h20v18H14z" />
      <path d="M10 22v8h28v-8" />
      <path d="M10 30h28" />
      <path d="M24 30v7M15 43l9-6 9 6" />
    </>
  )
};

export default function FurnitureIcon({ slug, size = 40 }) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[slug]}
    </svg>
  );
}
