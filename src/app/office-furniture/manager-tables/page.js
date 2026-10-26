import FurnitureCategoryPage, { furnitureMetadata } from "@/components/FurnitureCategoryPage";

export const metadata = furnitureMetadata("manager-tables");

export default function ManagerTablesPage() {
  return <FurnitureCategoryPage slug="manager-tables" />;
}
