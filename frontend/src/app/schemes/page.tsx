import { SchemesClient } from '@/components/schemes/SchemesClient';

// Disable caching for this route so it always fetches fresh data from backend
export const dynamic = 'force-dynamic';

export default async function SchemesPage() {
  let schemes = [];
  try {
    const res = await fetch('http://localhost:8000/api/v1/schemes', { cache: 'no-store' });
    if (res.ok) {
      schemes = await res.json();
    }
  } catch (error) {
    console.error("Failed to fetch schemes:", error);
  }

  return <SchemesClient schemes={schemes} />;
}
