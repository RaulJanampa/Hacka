"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>(""); // Nueva variable para errores
  const router = useRouter();

  const handleRedirect = () => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      if (parsedUser.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } else {
      router.push("/auth/login");
    }
  };

  useEffect(() => {
    handleRedirect();
  }, []);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/auth/login",
        { username, password },
        { headers: { "Content-Type": "application/json" } }
      );
      
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        await handleAuthMe();
      } else {
        setErrorMessage("Credenciales incorrectas");
      }
    } catch (error) {
      setErrorMessage("Hubo un error al intentar iniciar sesión");
    }
  };

  const handleAuthMe = async () => {
    const response = await axios.get("http://localhost:8000/auth/me", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.status === 200) {
      localStorage.setItem("user", JSON.stringify(response.data));
      handleRedirect(); // Redirige según el rol
    } else {
      setErrorMessage("Error al obtener los detalles del usuario");
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-2xl font-bold">Login</h1>
        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
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
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="p-2 bg-blue-500 text-white rounded">
            Login
          </button>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>} {/* Mostrar error */}
          <Link href="/auth/register" className="text-blue-500">
            Don't have an account? Register
          </Link>
        </form>
      </main>
    </div>
  );
}
