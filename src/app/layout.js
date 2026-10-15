import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import ClientWrapper from "@/components/ClientWrapper";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata = {
  title: "Chennai's Bulk Office Chair Repair & Cleaning | Ayaan Enterprises",
  description:
    "Corporate office chair repair, deep cleaning, refurbishment and seating solutions operating exclusively across Chennai (OMR, Guindy, Porur, Ambattur, and Central Chennai).",
  // Tab icons come from the app/ file conventions: favicon.ico, icon.png and apple-icon.png
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={sans.variable} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
