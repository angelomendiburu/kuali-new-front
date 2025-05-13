import { useState } from "react";

export default function UserModal({ open, onClose, onCreated }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = (field, value) => {
    let error = "";
    if (field === "name" && value.trim().length < 3) error = "El nombre debe tener al menos 3 caracteres.";
    if (field === "email" && !/\S+@\S+\.\S+/.test(value)) error = "Correo inválido.";
    if (field === "password" && value.length < 6) error = "La contraseña debe tener al menos 6 caracteres.";
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors((prev) => ({
      ...prev,
      [name]: validate(name, value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {
      name: validate("name", form.name),
      email: validate("email", form.email),
      password: validate("password", form.password),
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some((err) => err)) return;

    setLoading(true);
    try {
      const res = await fetch("http://localhost:3003/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Error al crear usuario");
      onCreated();
      onClose();
    } catch {
      setErrors({ general: "No se pudo crear el usuario" });
    }
    setLoading(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">Nuevo Usuario</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-zinc-700 dark:text-zinc-200 mb-1">Nombre</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
            />
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-zinc-700 dark:text-zinc-200 mb-1">Correo</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-zinc-700 dark:text-zinc-200 mb-1">Contraseña</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
            />
            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
          </div>
          {errors.general && <p className="text-red-600 text-sm">{errors.general}</p>}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}