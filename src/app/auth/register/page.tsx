"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("client"); // Default role is 'client'
  const [errorMessage, setErrorMessage] = useState<string>(""); // Nueva variable para errores
  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(true); // Validación de contraseña
  const router = useRouter();

  const handleRegister = async (e: any) => {
  e.preventDefault();

  // Validación de contraseña
  if (password.length < 12) {
    setIsPasswordValid(false); // Si la contraseña no es válida, no enviamos el formulario
    return;
  }

  try {
    // Intentamos hacer la solicitud de registro
    const response = await axios.post(
      "http://localhost:8000/auth/register",
      { username, password, role },
      { headers: { "Content-Type": "application/json" } }
    );

    // Si el registro es exitoso, redirigimos al login
    if (response.status === 201) {
      router.push("/auth/login");
    } else {
      setErrorMessage("No se pudo completar el registro");
    }
  } catch (error: any) {
    // Manejamos el error si es que se presenta
    if (error.response) {
      // Si el error tiene la respuesta del servidor, lo manejamos
      if (error.response.status === 400) {
        setErrorMessage("El email ya está registrado");
      } else {
        setErrorMessage("Hubo un error al registrar el usuario");
      }
    } else {
      // Si no hay respuesta del servidor (por ejemplo, error de conexión), mostramos un mensaje genérico
      setErrorMessage("Error de conexión. Intenta nuevamente.");
    }
  }
};
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-2xl font-bold">Register</h1>
        <form className="flex flex-col gap-4" onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Username"
            className="p-2 border rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="p-2 border rounded"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setIsPasswordValid(e.target.value.length >= 12);
            }}
          />
          {!isPasswordValid && <p className="text-red-500">La contraseña debe tener al menos 12 caracteres</p>}
          <select
            className="p-2 border rounded"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="client">Client</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit" className="p-2 bg-blue-500 text-white rounded">
            Register
          </button>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>} {/* Mostrar error */}
          <Link href="/auth/login" className="text-blue-500">
            Already have an account? Login
          </Link>
        </form>
      </main>
    </div>
  );
}
