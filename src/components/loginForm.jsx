import { useEffect, useState } from "react";
import { RiMoonLine, RiSunLine } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RegisterForm } from "./registerForm";
import { useNavigate } from "react-router-dom";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");
  const [showRegister, setShowRegister] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:3003/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al iniciar sesión");
      }

      localStorage.setItem('userName', data.user.name);
      localStorage.setItem('userEmail', data.user.email);
      
      navigate('/api/leads');
    } catch (err) {
      console.error("Error durante el login:", err.message);
      setError(err.message);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3003/api/auth/google";
  };

  if (showRegister) {
    return (
      <div className="w-full max-w-[500px] mx-auto">
        <RegisterForm onCancel={() => setShowRegister(false)} />
      </div>
    );
  }

  return (
    <Card className="w-full overflow-hidden border-0 shadow-none">
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-4"
        onClick={() => setDark((d) => !d)}
      >
        {dark ? (
          <RiMoonLine className="h-[1.2rem] w-[1.2rem]" />
        ) : (
          <RiSunLine className="h-[1.2rem] w-[1.2rem]" />
        )}
      </Button>
      <CardContent className="flex flex-col space-y-10 md:flex-row md:space-x-6 md:space-y-0 p-0">
        <div className="md:w-1/2 p-10">
          <div className="flex flex-col space-y-8">
            <div className="flex flex-col space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight">¡Bienvenido!</h1>
              <p className="text-sm text-muted-foreground">
                Ingresa a tu cuenta de Kuali Gestión
              </p>
            </div>

            <form onSubmit={handleLogin}>
              <div className="grid gap-2">
                <div className="grid gap-1">
                  <Input
                    id="email"
                    placeholder="nombre@ejemplo.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    className="h-9"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-1">
                  <Input
                    id="password"
                    placeholder="Contraseña"
                    type="password"
                    autoCapitalize="none"
                    autoComplete="current-password"
                    className="h-9"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="flex text-sm justify-between items-center">
                  <button 
                    type="button" 
                    onClick={() => setShowRegister(true)}
                    className="text-primary hover:underline underline-offset-4"
                  >
                    Crear cuenta
                  </button>
                </div>

                {error && (
                  <div className="bg-destructive/15 text-destructive text-sm p-2 rounded-md">
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full">
                  Iniciar sesión
                </Button>
              </div>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  O continúa con
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              type="button"
              className="w-full flex items-center justify-center gap-2"
              onClick={handleGoogleLogin}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 3.573-5.2 3.573-8.92 0-.493-.053-.987-.107-1.48H12.48z"
                  fill="currentColor"
                />
              </svg>
              Google
            </Button>
          </div>
        </div>

        <div className="relative hidden md:block md:w-1/2">
          <div className="absolute inset-0 bg-gradient-to-t from-background to-background/60 z-10" />
          <img
            src="/img/kuali_portada.png"
            alt="Authentication"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </CardContent>
    </Card>
  );
}
