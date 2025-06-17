'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Category {
  id: string;
  name: string;
}

export default function NewExpensePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [categoryId, setCategoryId] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch('http://198.211.105.95:8080/expenses_category', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error('Error cargando categorías:', err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch('http://198.211.105.95:8080/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          description,
          amount,
          categoryId,
        }),
      });

      if (!res.ok) throw new Error('Error al registrar gasto');

      router.push('/dashboard/expenses');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registrar nuevo gasto</h2>
      <input
        type="text"
        placeholder="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Monto"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        required
      />
      <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
        <option value="">Selecciona una categoría</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
      <button type="submit">Guardar</button>
    </form>
  );
}
