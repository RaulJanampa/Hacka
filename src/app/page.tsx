'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomeRedirect() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Si no hay token, redirigir al login
      router.push('/auth/login');
    } else {
      // Si hay token, redirigir a la página principal o al dashboard
      router.push('/');
    }
  }, [router]);

  return <p>Redirigiendo...</p>;
}
