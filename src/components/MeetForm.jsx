import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner';

export function MeetForm({ onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fecha: '',
    duration: 30,
    leadId: '',
    recordatorio: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3003/api/meets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al crear la reunión');
      }

      const data = await response.json();
      toast.success('Reunión creada exitosamente');
      onSuccess?.();
      
      setFormData({
        title: '',
        description: '',
        fecha: '',
        duration: 30,
        leadId: '',
        recordatorio: ''
      });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nueva Reunión</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Título</label>
            <Input
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block mb-1">Descripción</label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block mb-1">Fecha y hora</label>
            <Input
              type="datetime-local"
              required
              value={formData.fecha}
              onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block mb-1">Duración (minutos)</label>
            <Input
              type="number"
              min="15"
              step="15"
              required
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
            />
          </div>
          
          <div>
            <label className="block mb-1">Lead ID (opcional)</label>
            <Input
              type="number"
              value={formData.leadId}
              onChange={(e) => setFormData({ ...formData, leadId: Number(e.target.value) || null })}
            />
          </div>

          <div>
            <label className="block mb-1">Recordatorio</label>
            <Input
              value={formData.recordatorio}
              onChange={(e) => setFormData({ ...formData, recordatorio: e.target.value })}
              placeholder="Notas o recordatorio para la reunión"
            />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? 'Creando...' : 'Crear Reunión'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
