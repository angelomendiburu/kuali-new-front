import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { MeetForm } from '../components/MeetForm';
import { toast } from 'sonner';

export default function MeetsPage() {
  const [meets, setMeets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMeets = async () => {
    try {
      const response = await fetch('http://localhost:3003/api/meets', {
        credentials: 'include'
      });
      const data = await response.json();
      setMeets(data);
    } catch (error) {
      toast.error('Error al cargar las reuniones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeets();
  }, []);

  return (
    <div className="space-y-6">
      <MeetForm onSuccess={fetchMeets} />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p>Cargando reuniones...</p>
        ) : (
          meets.map((meet) => (
            <Card key={meet.id}>
              <CardHeader>
                <CardTitle>{meet.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p><strong>Fecha:</strong> {new Date(meet.date).toLocaleString()}</p>
                <p><strong>Duración:</strong> {meet.duration} minutos</p>
                <p><strong>Lead:</strong> {meet.lead?.name || 'No asignado'}</p>
                {meet.meetUrl && (
                  <a 
                    href={meet.meetUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline mt-2 block"
                  >
                    Unirse a la reunión
                  </a>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
