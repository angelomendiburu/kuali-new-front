export const companiesService = {
  async getById(id) {
    const res = await fetch(`/api/companies/${id}`);
    if (!res.ok) throw new Error("No se pudo obtener la empresa");
    return await res.json();
  },
  async getAll() {
    const res = await fetch(`/api/companies`);
    if (!res.ok) throw new Error("No se pudieron obtener las empresas");
    return await res.json();
  }
};