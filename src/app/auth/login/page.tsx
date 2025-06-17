"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleRedirect = () => {
    const user = localStorage.getItem("user");
    console.log("User Info:", user);
    if (user) {
      console.log("User exists, redirecting...");
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

  const handleAuthMe = async () => {
    const response = await axios.get("http://localhost:8000/auth/me", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    console.log("Auth Me Response:", response.data);
    if (response.status === 200) {
      localStorage.setItem("user", JSON.stringify(response.data));
      console.log("User Info successful:", response.data);
      handleRedirect(); // Redirect based on user role
    } else {
      console.error("User failed:", response.data.message);
    }
  };

  const handleLogin = async (e: any) => {
    e.preventDefault();
    const response = await axios.post(
      "http://localhost:8000/auth/login",
      {
        username,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      localStorage.setItem("token", response.data.token);
      console.log("Login successful:", response.data);
      await handleAuthMe(); // Fetch user info after login
    } else {
      console.error("Login failed:", response.data.message);
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
          <Link href="/auth/register" className="text-blue-500">
            Don't have an account? Register
          </Link>
        </form>
      </main>
    </div>
  );
}
