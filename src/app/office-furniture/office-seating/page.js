import FurnitureCategoryPage, { furnitureMetadata } from "@/components/FurnitureCategoryPage";

export const metadata = furnitureMetadata("office-seating");

export default function OfficeSeatingPage() {
  return <FurnitureCategoryPage slug="office-seating" />;
}
