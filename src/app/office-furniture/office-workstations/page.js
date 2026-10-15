import FurnitureCategoryPage, { furnitureMetadata } from "@/components/FurnitureCategoryPage";

export const metadata = furnitureMetadata("office-workstations");

export default function OfficeWorkstationsPage() {
  return <FurnitureCategoryPage slug="office-workstations" />;
}
