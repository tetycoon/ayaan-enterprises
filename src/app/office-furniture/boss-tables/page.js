import FurnitureCategoryPage, { furnitureMetadata } from "@/components/FurnitureCategoryPage";

export const metadata = furnitureMetadata("boss-tables");

export default function BossTablesPage() {
  return <FurnitureCategoryPage slug="boss-tables" />;
}
