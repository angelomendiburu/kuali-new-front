import React from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

export function LeadFormDialog({ lead, isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    linkedin: '',
    job_role: '',
    work_area: '',
    company_id: 1,
    company_name: '', // Nuevo campo para el nombre de la empresa
    event_id: 1,
    event_name: '', // Nuevo campo para el nombre del evento
    user_id: 1
  });

  // Actualizar el formulario cuando se edita un lead existente
  React.useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name || '',
        email: lead.email || '',
        phone: lead.phone || '',
        linkedin: lead.linkedin || '',
        job_role: lead.job_role || '',
        work_area: lead.work_area || '',
        company_id: lead.company_id || 1,
        company_name: lead.company?.name || '', // Nombre de la empresa si existe
        event_id: lead.event_id || 1,
        event_name: lead.events?.name || '', // Nombre del evento si existe
        user_id: lead.user_id || 1
      });
    } else {
      // Restablecer el formulario cuando se crea un nuevo lead
      setFormData({
        name: '',
        email: '',
        phone: '',
        linkedin: '',
        job_role: '',
        work_area: '',
        company_id: 1,
        company_name: '',
        event_id: 1,
        event_name: '',
        user_id: 1
      });
    }
  }, [lead]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error en el envío del formulario:', error);
      toast.error(error.message || 'Error al procesar el formulario');
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{lead ? 'Editar Lead' : 'Nuevo Lead'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="name">Nombre</label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email">Email</label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone">Teléfono</label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="company_name">Nombre de Empresa</label>
              <Input
                id="company_name"
                value={formData.company_name}
                onChange={(e) => handleChange('company_name', e.target.value)}
                placeholder="Nombre de la empresa"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="event_name">Nombre del Evento</label>
              <Input
                id="event_name"
                value={formData.event_name}
                onChange={(e) => handleChange('event_name', e.target.value)}
                placeholder="Nombre del evento"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="linkedin">LinkedIn</label>
              <Input
                id="linkedin"
                value={formData.linkedin}
                onChange={(e) => handleChange('linkedin', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="job_role">Cargo</label>
              <Input
                id="job_role"
                value={formData.job_role}
                onChange={(e) => handleChange('job_role', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="work_area">Área</label>
              <Input
                id="work_area"
                value={formData.work_area}
                onChange={(e) => handleChange('work_area', e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {lead ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}