import { useEffect, useState } from "react";
import UserModal from "../components/UserModal";
import { FiTrash2 } from "react-icons/fi";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const userRole = localStorage.getItem('userRole'); // Obtener el rol del usuario actual

  const fetchUsers = async () => {
    setLoading(true);
    const res = await fetch("http://localhost:3003/api/users", {
      credentials: "include"
    });
    const data = await res.json();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Usuarios</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="px-5 py-2 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold shadow hover:bg-zinc-800 dark:hover:bg-zinc-200 transition"
        >
          + Nuevo Usuario
        </button>
      </div>
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg overflow-hidden">
        {loading ? (
          <p className="text-center py-10 text-zinc-600 dark:text-zinc-300">Cargando...</p>
        ) : users.length === 0 ? (
          <p className="text-center py-10 text-zinc-500 dark:text-zinc-400">No hay usuarios registrados.</p>
        ) : (
          <table className="min-w-full">
            <thead>
              <tr className="bg-zinc-100 dark:bg-zinc-800">
                <th className="py-3 px-6 text-left font-semibold text-zinc-700 dark:text-zinc-200">Nombre</th>
                <th className="py-3 px-6 text-left font-semibold text-zinc-700 dark:text-zinc-200">Correo</th>
                <th className="py-3 px-6 text-left font-semibold text-zinc-700 dark:text-zinc-200">Rol</th>
                {userRole === 'admin' && ( // Solo mostrar la columna de acciones si es admin
                  <th className="py-3 px-6 text-left font-semibold text-zinc-700 dark:text-zinc-200">Acciones</th>
                )}
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr
                  key={user.id}
                  className={`transition hover:bg-zinc-50 dark:hover:bg-zinc-800 ${
                    idx % 2 === 0 ? "bg-white dark:bg-zinc-900" : "bg-zinc-50 dark:bg-zinc-950"
                  }`}
                >
                  <td className="py-3 px-6 border-b border-zinc-100 dark:border-zinc-800">{user.name}</td>
                  <td className="py-3 px-6 border-b border-zinc-100 dark:border-zinc-800">{user.email}</td>
                  <td className="py-3 px-6 border-b border-zinc-100 dark:border-zinc-800">{user.role}</td>
                  {userRole === 'admin' && ( // Solo mostrar botón de eliminar si es admin
                    <td className="py-3 px-6 border-b border-zinc-100 dark:border-zinc-800">
                      <button
                        title="Borrar"
                        onClick={() => {
                          setUserToDelete(user);
                          setDeleteConfirmOpen(true);
                        }}
                        className="p-2 rounded-full bg-red-50 dark:bg-red-900 hover:bg-red-100 dark:hover:bg-red-800 text-red-600 dark:text-red-300 transition"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <UserModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={fetchUsers}
      />
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 w-full max-w-sm shadow-lg">
            <h2 className="text-lg font-bold mb-4 text-zinc-900 dark:text-zinc-100">
              ¿Eliminar usuario?
            </h2>
            <p className="mb-6 text-zinc-700 dark:text-zinc-300">
              ¿Estás seguro de que deseas eliminar el usuario <b>{userToDelete?.name}</b>? Esta acción no se puede deshacer.
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
                  await fetch(`http://localhost:3003/api/users/${userToDelete.id}`, {
                    method: "DELETE",
                    credentials: "include"
                  });
                  setDeleteConfirmOpen(false);
                  setUserToDelete(null);
                  fetchUsers();
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