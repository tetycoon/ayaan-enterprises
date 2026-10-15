import FurnitureCategoryPage, { furnitureMetadata } from "@/components/FurnitureCategoryPage";

export const metadata = furnitureMetadata("cabin-furniture");

export default function CabinFurniturePage() {
  return <FurnitureCategoryPage slug="cabin-furniture" />;
}
