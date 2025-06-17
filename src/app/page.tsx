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
      // Si hay token, redirigir al dashboard
      router.push('/dashboard');  // Aquí rediriges al dashboard, no a la página principal
    }
  }, [router]);

  return <p>Redirigiendo...</p>;
}
