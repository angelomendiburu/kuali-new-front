import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner';
import { VoiceInputForMeet } from './VoiceInputForMeet'; // Importar el nuevo componente


export function MeetForm({ onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fecha: '',
    duration: '30', // Mantener como string para el input, convertir a número al enviar
    leadId: '',
    recordatorio: ''
  });

  const [transcribedText, setTranscribedText] = useState('');

  const handleMeetingDetailsExtracted = (details) => {
    console.log("Detalles extraídos por voz:", details);
    // Formatear fecha y hora para el input datetime-local
    let formattedDateTime = '';
    if (details.date && details.time) {
      // Asumimos que details.date es YYYY-MM-DD y details.time es HH:MM (o necesita parseo)
      // Esto es una simplificación. Necesitarás una lógica robusta para convertir time (e.g., "2 PM") a HH:mm
      // Por ahora, si GPT devuelve YYYY-MM-DD y HH:MM, podemos combinarlos.
      // Ejemplo: details.date = "2023-10-28", details.time = "14:30"
      formattedDateTime = `${details.date}T${details.time}`;
    }

    setFormData(prev => ({
      ...prev,
      title: details.title || prev.title,
      description: details.description || prev.description,
      fecha: formattedDateTime || prev.fecha, // Usar fecha y hora combinadas
      duration: details.duration?.toString() || prev.duration, // Convertir a string para el input
      // leadId y recordatorio no suelen venir de un comando de voz simple, pero podrían añadirse al prompt de GPT
    }));
    toast.success("Formulario pre-rellenado con detalles de voz.");
  };

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
          body: JSON.stringify({
          ...formData,
          duration: parseInt(formData.duration, 10), // Asegurar que la duración sea un número
          leadId: formData.leadId ? parseInt(formData.leadId, 10) : null, // Convertir a número o null
        }),
      });

      if (!response.ok) {
      const errorData = await response.json();
        // Intenta obtener el mensaje de error específico del backend
        const message = errorData.errors?.[0]?.message || errorData.message || 'Error al crear la reunión';
        throw new Error(message);
      }

      const data = await response.json();
      toast.success('Reunión creada exitosamente');
      onSuccess?.();
      
      setFormData({
        title: '',
        description: '',
        fecha: '',
        duration: '30',
        leadId: '',
        recordatorio: ''
      });
  setTranscribedText(''); // Limpiar transcripción

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
         <VoiceInputForMeet
          onMeetingDetailsExtracted={handleMeetingDetailsExtracted}
          onTranscription={setTranscribedText}
        />
        {transcribedText && (
          <p className="mb-4 text-sm text-muted-foreground"><i>Texto reconocido: "{transcribedText}"</i></p>
        )}
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
              value={formData.duration.toString()} // Asegurar que el valor sea string para el input
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block mb-1">Lead ID (opcional)</label>
            <Input
              
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
