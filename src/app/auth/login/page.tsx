'use client'; // Especifica que este es un componente de cliente.

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; // Usamos el hook de Next.js para navegar
import { useAuth } from "../../AuthContext"; // Usamos el contexto para el manejo de autenticación
import Link from "next/link"; // Para agregar el enlace al registro

export default function LoginPage() {
  const [email, setEmail] = useState(""); // Estado para el email
  const [password, setPassword] = useState(""); // Estado para la contraseña
  const [errorMessage, setErrorMessage] = useState(""); // Mensaje de error
  const { login } = useAuth(); // Usamos el hook useAuth para acceder a la función de login
  const router = useRouter(); // Hook de Next.js para navegación

  // Maneja la petición de login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevenimos el comportamiento por defecto del formulario
    try {
      // Hacemos la petición POST a la API de login
      const response = await axios.post(
        "http://198.211.105.95:8080/authentication/login", 
        {
          email,
          passwd: password, // Enviamos el correo y la contraseña en el cuerpo de la petición
        }
      );

      if (response.status === 200) {
        // Si la respuesta es exitosa, almacenamos el token en el localStorage y hacemos el login
        login(response.data.token); // Usamos la función de login que guardará el token
        router.push("/"); // Redirigimos al usuario a la página principal
      }
    } catch (error: any) {
      // Si hay algún error en la petición, mostramos un mensaje de error
      setErrorMessage("Credenciales incorrectas o error de conexión.");
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      {errorMessage && <p>{errorMessage}</p>}
      
      {/* Enlace al formulario de registro si no tienes cuenta */}
      <p>
        ¿No tienes una cuenta? 
        <Link href="/auth/register" className="text-blue-500">
          Regístrate aquí
        </Link>
      </p>
    </div>
  );
}
