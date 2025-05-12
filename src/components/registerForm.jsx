import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function RegisterForm({ onCancel }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:3003/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
        }),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al registrar usuario");
      }

      // Guardar datos del usuario
      localStorage.setItem('userName', data.user.name);
      localStorage.setItem('userEmail', data.user.email);
      
      // Redirigir al dashboard
      window.location.href = 'http://localhost:5004/';
    } catch (err) {
      console.error("Error durante el registro:", err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  return (
    <Card className="w-full overflow-hidden border-0 shadow-none">
      <CardContent className="p-6">
        <div className="flex flex-col space-y-8">
          <div className="flex flex-col space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">Crear cuenta</h1>
            <p className="text-sm text-muted-foreground">
              Ingresa tus datos para registrarte
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Input
                  id="name"
                  placeholder="Nombre completo"
                  type="text"
                  autoCapitalize="words"
                  autoComplete="name"
                  className="h-9"
                  value={formData.name}
                  onChange={handleChange('name')}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Input
                  id="email"
                  placeholder="correo@ejemplo.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  className="h-9"
                  value={formData.email}
                  onChange={handleChange('email')}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Input
                  id="password"
                  placeholder="Contraseña"
                  type="password"
                  autoComplete="new-password"
                  className="h-9"
                  value={formData.password}
                  onChange={handleChange('password')}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Input
                  id="confirmPassword"
                  placeholder="Confirmar contraseña"
                  type="password"
                  autoComplete="new-password"
                  className="h-9"
                  value={formData.confirmPassword}
                  onChange={handleChange('confirmPassword')}
                  required
                  disabled={isLoading}
                />
              </div>

              {error && (
                <div className="bg-destructive/15 text-destructive text-sm p-2 rounded-md">
                  {error}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1" 
                  onClick={onCancel}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1"
                  disabled={isLoading}
                >
                  {isLoading ? 'Registrando...' : 'Registrarse'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}