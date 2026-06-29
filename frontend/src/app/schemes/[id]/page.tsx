import { SchemeDetailsClient } from '@/components/schemes/SchemeDetailsClient';

export const dynamic = 'force-dynamic';

export default async function SchemeDetailsPage({ params }: { params: { id: string } }) {
  let scheme = null;
  
  try {
    const res = await fetch('http://localhost:8000/api/v1/schemes', { cache: 'no-store' });
    if (res.ok) {
      const schemes = await res.json();
      scheme = schemes.find((s: any) => s.id === params.id);
    }
  } catch (error) {
    console.error("Failed to fetch schemes:", error);
  }

  return <SchemeDetailsClient scheme={scheme} />;
}
