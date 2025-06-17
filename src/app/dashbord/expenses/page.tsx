'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
}

export default function ExpenseDetailPage() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('categoryId');
  const year = searchParams.get('year') || '2024';
  const month = searchParams.get('month') || '06';

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!categoryId || !token) return;

    fetch(`http://198.211.105.95:8080/expenses/detail?year=${year}&month=${month}&categoryId=${categoryId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setExpenses(data))
      .catch((err) => console.error('Error cargando gastos:', err))
      .finally(() => setLoading(false));
  }, [categoryId, year, month]);

  if (!categoryId) return <p>Selecciona una categoría desde el resumen.</p>;
  if (loading) return <p>Cargando gastos...</p>;

  return (
    <div>
      <h2>Gastos de la categoría {categoryId}</h2>
      <ul>
        {expenses.map((g) => (
          <li key={g.id}>
            {g.description} - S/ {g.amount} - {g.date}
          </li>
        ))}
      </ul>
    </div>
  );
}
