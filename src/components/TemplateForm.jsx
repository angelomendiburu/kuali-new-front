import { useState } from "react";

export default function TemplateForm() {
  const [form, setForm] = useState({
    name: "",
    body: "",
    type: "correo",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Validación en tiempo real
  const validate = (field, value) => {
    let error = "";
    if (field === "name" && value.trim().length < 3) {
      error = "El nombre debe tener al menos 3 caracteres.";
    }
    if (field === "body" && value.trim().length < 10) {
      error = "El cuerpo debe tener al menos 10 caracteres.";
    }
    if (field === "type" && !["correo", "whatsapp"].includes(value)) {
      error = "Tipo inválido.";
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Validar campo individual
    setErrors((prev) => ({
      ...prev,
      [name]: validate(name, value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar todos los campos antes de enviar
    const newErrors = {
      name: validate("name", form.name),
      body: validate("body", form.body),
      type: validate("type", form.type),
    };
    setErrors(newErrors);

    // Si hay errores, no enviar
    if (Object.values(newErrors).some((err) => err)) return;

    setLoading(true);
    setSuccess(false);
    try {
      await fetch("http://localhost:3000/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setSuccess(true);
      setForm({ name: "", body: "", type: "correo" });
      setErrors({});
    } catch (err) {
      alert("Error al guardar");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white dark:bg-zinc-900 rounded-lg shadow p-8">
      <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-zinc-100">Crear plantilla</h2>
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
          {errors.name && (
            <p className="text-red-600 text-sm mt-1">{errors.name}</p>
          )}
        </div>
        <div>
          <label className="block text-zinc-700 dark:text-zinc-200 mb-1">Cuerpo</label>
          <textarea
            name="body"
            value={form.body}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-3 py-2 border rounded dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
          />
          {errors.body && (
            <p className="text-red-600 text-sm mt-1">{errors.body}</p>
          )}
        </div>
        <div>
          <label className="block text-zinc-700 dark:text-zinc-200 mb-1">Tipo</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
          >
            <option value="correo">Correo</option>
            <option value="whatsapp">WhatsApp</option>
          </select>
          {errors.type && (
            <p className="text-red-600 text-sm mt-1">{errors.type}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-zinc-900 text-white py-2 rounded hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300 transition"
        >
          {loading ? "Guardando..." : "Guardar"}
        </button>
        {success && <p className="text-green-600 dark:text-green-400 mt-2">¡Guardado correctamente!</p>}
      </form>
    </div>
  );
}