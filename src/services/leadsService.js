import axios from 'axios';

const API_URL = 'http://localhost:3003/api';

// Configurar axios para incluir credenciales
axios.defaults.withCredentials = true;

export const leadsService = {  getAll: async () => {
    try {
      const response = await axios.get(`${API_URL}/leads`);
      // Mapear las fechas a un formato consistente
      return response.data.map(lead => ({
        ...lead,
        createdAt: lead.created_at
      }));
    } catch (error) {
      console.error('Error al obtener leads:', error);
      throw error.response?.data?.error || error.message;
    }
  },

  create: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/leads`, data);
      // Obtener el lead completo con sus relaciones después de crearlo
      const newLead = await axios.get(`${API_URL}/leads/${response.data.id}`);
      return newLead.data;
    } catch (error) {
      console.error('Error al crear lead:', error);
      throw error.response?.data?.error || error.message;
    }
  },

  update: async (id, data) => {
    try {
      const cleanData = {
        ...data,
        company_id: data.company_id ? Number(data.company_id) : undefined,
        event_id: data.event_id ? Number(data.event_id) : undefined,
        user_id: data.user_id ? Number(data.user_id) : undefined
      };

      // Remover campos undefined
      Object.keys(cleanData).forEach(key => 
        cleanData[key] === undefined && delete cleanData[key]
      );

      console.log('Enviando datos limpios:', { id, data: cleanData });
      
      const response = await axios.put(`${API_URL}/leads/${id}`, cleanData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar lead:', error);
      throw error.response?.data?.error || error.message;
    }
  },

  delete: async (id) => {
    try {
      await axios.delete(`${API_URL}/leads/${id}`);
    } catch (error) {
      console.error('Error al eliminar lead:', error);
      throw error.response?.data?.error || error.message;
    }
  },

  sendBulkWhatsAppMessages: async (message, leadIds) => {
    try {
      const response = await axios.post(`${API_URL}/leads/bulk-whatsapp`, { message, leadIds });
      return response.data; // Assuming the backend returns some confirmation or details
    } catch (error) {
      console.error('Error al enviar mensajes de WhatsApp en lote:', error);
      throw error.response?.data?.error || error.message || 'Error en el servidor al enviar mensajes masivos';
    }
  }
};