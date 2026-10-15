import FurnitureCategoryPage, { furnitureMetadata } from "@/components/FurnitureCategoryPage";

export const metadata = furnitureMetadata("ergonomics");

export default function ErgonomicsPage() {
  return <FurnitureCategoryPage slug="ergonomics" />;
}
