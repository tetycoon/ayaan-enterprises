import BulkServiceContent, { BULK_METADATA } from "@/components/BulkServiceContent";

export const metadata = BULK_METADATA;

export default function BulkServicePage() {
  return <BulkServiceContent crumb="Bulk Service" showJobPhotos />;
}
