import FurnitureCategoryPage, { furnitureMetadata } from "@/components/FurnitureCategoryPage";

export const metadata = furnitureMetadata("conference-tables");

export default function ConferenceTablesPage() {
  return <FurnitureCategoryPage slug="conference-tables" />;
}
