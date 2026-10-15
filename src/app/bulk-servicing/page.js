import BulkServiceContent, { BULK_METADATA } from "@/components/BulkServiceContent";

export const metadata = BULK_METADATA;

export default function BulkServicingPage() {
  return <BulkServiceContent crumb="Bulk Servicing" showJobPhotos />;
}
