import FurnitureCategoryPage, { furnitureMetadata } from "@/components/FurnitureCategoryPage";

export const metadata = furnitureMetadata("office-cabinets");

export default function OfficeCabinetsPage() {
  return <FurnitureCategoryPage slug="office-cabinets" />;
}
