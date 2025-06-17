"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("client"); // Default role is 'client'
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

  const handleRegister = async (e: any) => {
    e.preventDefault();
    const response = await axios.post(
      "http://localhost:8000/auth/register",
      {
        username,
        password,
        role,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 201) {
      console.log("Register successful:", response.data);
      router.push("/auth/login");
    } else {
      console.error("Register failed:", response.data.message);
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
            onChange={(e) => setPassword(e.target.value)}
          />
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
          <Link href="/auth/login" className="text-blue-500">
            Already have an account? Login
          </Link>
        </form>
      </main>
    </div>
  );
}
