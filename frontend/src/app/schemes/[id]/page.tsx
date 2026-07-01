import { SchemeDetailsClient } from '@/components/schemes/SchemeDetailsClient';

export const dynamic = 'force-dynamic';

export default async function SchemeDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  let scheme = null;
  const { id } = await params;
  
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const res = await fetch(`${apiUrl}/api/v1/schemes`, { cache: 'no-store' });
    if (res.ok) {
      const schemes = await res.json();
      scheme = schemes.find((s: any) => s.id === id);
    }
  } catch (error) {
    console.error("Failed to fetch schemes:", error);
  }

  return <SchemeDetailsClient scheme={scheme} />;
}
