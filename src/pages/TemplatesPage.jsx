import { useEffect, useState } from "react";
import TemplateModal from "../components/TemplateModal";
import { FiTrash2, FiEdit2 } from "react-icons/fi";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTemplate, setEditTemplate] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);

  const fetchTemplates = async () => {
    setLoading(true);
    const res = await fetch("http://localhost:3003/api/templates", {
      credentials: "include"
    });
    const data = await res.json();
    setTemplates(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleEdit = (tpl) => {
    setEditTemplate(tpl);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditTemplate(null);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Plantillas</h1>
        <button
          onClick={() => { setEditTemplate(null); setModalOpen(true); }}
          className="px-5 py-2 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold shadow hover:bg-zinc-800 dark:hover:bg-zinc-200 transition"
        >
          + Nueva Plantilla
        </button>
      </div>
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg overflow-hidden">
        {loading ? (
          <p className="text-center py-10 text-zinc-600 dark:text-zinc-300">Cargando...</p>
        ) : templates.length === 0 ? (
          <p className="text-center py-10 text-zinc-500 dark:text-zinc-400">No hay plantillas registradas.</p>
        ) : (
          <table className="min-w-full">
            <thead>
              <tr className="bg-zinc-100 dark:bg-zinc-800">
                <th className="py-3 px-6 text-left font-semibold text-zinc-700 dark:text-zinc-200">Nombre</th>
                <th className="py-3 px-6 text-left font-semibold text-zinc-700 dark:text-zinc-200">Tipo</th>
                <th className="py-3 px-6 text-left font-semibold text-zinc-700 dark:text-zinc-200">Cuerpo</th>
                <th className="py-3 px-6 text-left font-semibold text-zinc-700 dark:text-zinc-200">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((tpl, idx) => (
                <tr
                  key={tpl.id}
                  className={`transition hover:bg-zinc-50 dark:hover:bg-zinc-800 ${
                    idx % 2 === 0 ? "bg-white dark:bg-zinc-900" : "bg-zinc-50 dark:bg-zinc-950"
                  }`}
                >
                  <td className="py-3 px-6 border-b border-zinc-100 dark:border-zinc-800">{tpl.name}</td>
                  <td className="py-3 px-6 border-b border-zinc-100 dark:border-zinc-800 capitalize">{tpl.type}</td>
                  <td className="py-3 px-6 border-b border-zinc-100 dark:border-zinc-800 truncate max-w-xs" title={tpl.body}>{tpl.body}</td>
                  <td className="py-3 px-6 border-b border-zinc-100 dark:border-zinc-800">
                    <div className="flex gap-2">
                      <button
                        title="Editar"
                        onClick={() => handleEdit(tpl)}
                        className="p-2 rounded-full bg-blue-50 dark:bg-blue-900 hover:bg-blue-100 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-300 transition"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        title="Borrar"
                        onClick={() => {
                          setTemplateToDelete(tpl);
                          setDeleteConfirmOpen(true);
                        }}
                        className="p-2 rounded-full bg-red-50 dark:bg-red-900 hover:bg-red-100 dark:hover:bg-red-800 text-red-600 dark:text-red-300 transition"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <TemplateModal
        open={modalOpen}
        onClose={handleModalClose}
        onCreated={fetchTemplates}
        template={editTemplate}
      />
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 w-full max-w-sm shadow-lg">
            <h2 className="text-lg font-bold mb-4 text-zinc-900 dark:text-zinc-100">
              ¿Eliminar plantilla?
            </h2>
            <p className="mb-6 text-zinc-700 dark:text-zinc-300">
              ¿Estás seguro de que deseas eliminar la plantilla <b>{templateToDelete?.name}</b>? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteConfirmOpen(false)}
                className="px-4 py-2 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  await fetch(`http://localhost:3003/api/templates/${templateToDelete.id}`, {
                    method: "DELETE",
                    credentials: "include"
                  });
                  setDeleteConfirmOpen(false);
                  setTemplateToDelete(null);
                  fetchTemplates();
                }}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}