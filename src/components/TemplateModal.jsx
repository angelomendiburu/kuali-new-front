import { useState, useEffect } from "react";

export default function TemplateModal({ open, onClose, onCreated, template }) {
  const [form, setForm] = useState({ name: "", body: "", type: "correo" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (template) {
      setForm({
        name: template.name || "",
        body: template.body || "",
        type: template.type || "correo",
      });
    } else {
      setForm({ name: "", body: "", type: "correo" });
    }
    setErrors({});
  }, [template, open]);

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
    setErrors((prev) => ({
      ...prev,
      [name]: validate(name, value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {
      name: validate("name", form.name),
      body: validate("body", form.body),
      type: validate("type", form.type),
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some((err) => err)) return;

    setLoading(true);
    try {
      let res;
      if (template) {
        // PUT para actualizar
        res = await fetch(`http://localhost:3003/api/templates/${template.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(form),
        });
      } else {
        // POST para crear
        res = await fetch("http://localhost:3003/api/templates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(form),
        });
      }
      if (!res.ok) throw new Error("Error al guardar la plantilla");
      onCreated();
      onClose();
    } catch (err) {
      setErrors({ general: "No se pudo guardar la plantilla" });
    }
    setLoading(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">
          {template ? "Editar Plantilla" : "Nueva Plantilla"}
        </h2>
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
              rows={3}
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
          {errors.general && (
            <p className="text-red-600 text-sm">{errors.general}</p>
          )}
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
              {loading ? "Guardando..." : template ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}