'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomeRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.push('/auth/login');
  }, [router]);

  return <p>Redirigiendo al login...</p>;
}
