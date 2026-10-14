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
  icons: {
    icon: "/images/logo-mark.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={sans.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
