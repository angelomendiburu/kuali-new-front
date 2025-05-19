import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { RiDeleteBinLine } from 'react-icons/ri';
import { toast } from 'sonner';
import { ImportExportButtons } from '../components/ImportExportButtons';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

function RegistrosPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/registros');
        // Asegurarse de que res.data sea un array
        if (Array.isArray(res.data)) {
          // Parsear el campo 'details' si es una cadena JSON, o mantenerlo si es una cadena simple
          const parsedLogs = res.data.map(log => {
            if (typeof log.details === 'string') {
              try {
                // Intentar parsear si parece JSON (empieza con { o [)
                const trimmedDetails = log.details.trim();
                if (trimmedDetails.startsWith('{') || trimmedDetails.startsWith('[')) {
                   return {
                    ...log,
                    details: JSON.parse(log.details)
                  };
                } else {
                  // Si no parece JSON, mantener como cadena simple con un indicador
                  return { ...log, details: { raw: log.details, isString: true } };
                }
              } catch (e) {
                console.error('Error parsing log details (likely old format):', log.details, e);
                // Si falla el parseo, mantener como cadena simple con indicador de error
                return { ...log, details: { raw: log.details, isString: true, error: 'Parse Error' } };
              }
            } else {
              // Si no es cadena (ej. ya es objeto o nulo), mantener tal cual
              return log;
            }
          });
          setLogs(parsedLogs);
        } else {
          // Si no es un array, establecer un array vacío y registrar un error
          setLogs([]);
          console.error('La respuesta de la API /registros no es un array:', res.data);
          setError('Formato de datos de registros inválido.');
        }
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || 'Error al cargar registros');
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  // Función para eliminar un registro
  const handleDeleteLog = async (logId) => {
    try {
      await axios.delete(`/registros/${logId}`);
      setLogs(prevLogs => prevLogs.filter(log => log.id !== logId));
      toast.success('Registro eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar registro:', error);
      toast.error('Error al eliminar registro');
    }
  };

  // Función para renderizar los detalles según la acción
  const renderDetails = (log) => {
    if (!log.details) return '-';

    // Si es una cadena simple (formato antiguo o error de parseo)
    if (log.details.isString) {
      return log.details.raw; // Mostrar la cadena tal cual
    }

    // Si es un objeto (formato JSON parseado)
    switch (log.action) {
      case 'send_whatsapp': {
        return (
          <div>
            WhatsApp enviado a <strong>{log.details.leadName}</strong> ({log.details.phone}) con plantilla <strong>{log.details.templateName}</strong>.
          </div>
        );
      }
      case 'send_mail': {
        return (
          <div>
            Correo enviado a <strong>{log.details.leadName}</strong> ({log.details.to}) con asunto <strong>{log.details.subject}</strong> y plantilla <strong>{log.details.templateName}</strong>.
          </div>
        );
      }
      case 'create_lead': {
         // Detalles para lead creado (ahora en JSON)
         return (
           <div>
             Lead creado: <strong>{log.details.name}</strong> ({log.details.email}). Creado por: {log.details.created_by}.
           </div>
         );
      }
      case 'delete_lead': {
        return (
          <div>
            Lead eliminado: <strong>{log.details.name}</strong> ({log.details.email}). Eliminado por: {log.details.deleted_by}.
          </div>
        );
      }
      case 'create_user': {
        return (
          <div>
            Usuario creado: <strong>{log.details.name}</strong> ({log.details.email}). Creado por: {log.details.created_by}.
          </div>
        );
      }
      case 'update_user': {
        // Mostrar solo los cambios si existen
        const changes = log.details.changes;
        const changeEntries = Object.entries(changes).filter(([key, value]) => value !== undefined);
        if (changeEntries.length === 0) return 'Usuario actualizado (sin cambios detectados)';

        return (
          <div>
            Usuario <strong>{log.details.user_name}</strong> actualizado por {log.details.updated_by}. Cambios:
            <ul>
              {changeEntries.map(([key, value], index) => (
                <li key={index}>
                  <strong>{key}:</strong> {value.from !== undefined && value.to !== undefined ? `${value.from} -> ${value.to}` : JSON.stringify(value)}
                </li>
              ))}
            </ul>
          </div>
        );
      }
      case 'delete_user': {
        return (
          <div>
            Usuario eliminado: <strong>{log.details.user_name}</strong> ({log.details.user_email}). Eliminado por: {log.details.deleted_by}.
          </div>
        );
      }
      case 'create_company': {
        return (
          <div>
            Empresa creada: <strong>{log.details.company_name}</strong> (ID: {log.details.company_id}). Creado por: {log.details.created_by}.
          </div>
        );
      }
      case 'update_company': {
         const companyChanges = log.details.changes;
         const companyChangeEntries = Object.entries(companyChanges).filter(([key, value]) => value !== undefined);
         if (companyChangeEntries.length === 0) return 'Empresa actualizada (sin cambios detectados)';

         return (
           <div>
             Empresa <strong>{log.details.company_name}</strong> (ID: {log.details.company_id}) actualizada por {log.details.updated_by}. Cambios:
             <ul>
               {companyChangeEntries.map(([key, value], index) => (
                 <li key={index}>
                   <strong>{key}:</strong> {value.from !== undefined && value.to !== undefined ? `${value.from} -> ${value.to}` : JSON.stringify(value)}
                 </li>
               ))}
             </ul>
           </div>
         );
      }
      case 'delete_company': {
        return (
          <div>
            Empresa eliminada: <strong>{log.details.company_name}</strong> (ID: {log.details.company_id}). Eliminado por: {log.details.deleted_by}.
          </div>
        );
      }
      case 'create_event': {
        return (
          <div>
            Evento creado: <strong>{log.details.event_name}</strong> (Tipo: {log.details.event_type}). Creado por: {log.details.created_by}.
          </div>
        );
      }
      case 'update_event': {
        const eventChanges = log.details.changes;
        const eventChangeEntries = Object.entries(eventChanges).filter(([key, value]) => value !== undefined);
        if (eventChangeEntries.length === 0) return 'Evento actualizado (sin cambios detectados)';

        return (
          <div>
            Evento <strong>{log.details.event_name}</strong> (ID: {log.details.event_id}) actualizado por {log.details.updated_by}. Cambios:
            <ul>
              {eventChangeEntries.map(([key, value], index) => (
                <li key={index}>
                  <strong>{key}:</strong> {value.from !== undefined && value.to !== undefined ? `${value.from} -> ${value.to}` : JSON.stringify(value)}
                </li>
              ))}
            </ul>
          </div>
        );
      }
      case 'delete_event': {
        return (
          <div>
            Evento eliminado: <strong>{log.details.event_name}</strong> (Tipo: {log.details.event_type}). Eliminado por: {log.details.deleted_by}.
          </div>
        );
      }
      // Añadir más casos para otros tipos de acciones si es necesario
      default:
        // Mostrar detalles genéricos si no hay un caso específico
        return JSON.stringify(log.details);
    }
  };

  const prepareLogsForExport = (logs) => {
    return logs.map(log => ({
      Fecha: new Date(log.createdAt).toLocaleString('es-ES'),
      Usuario: log.user?.name || log.userId,
      Acción: log.action.replace(/_/g, ' '),
      Lead: log.lead?.name || '-',
      Plantilla: log.template?.name || '-',
      Detalles: typeof log.details === 'object' ? JSON.stringify(log.details) : log.details
    }));
  };

  return (
    <Card className="max-w-[95%] mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold">Registros de Actividad</CardTitle>
        <ImportExportButtons
          onImport={() => {}} // La importación está deshabilitada para registros
          data={prepareLogsForExport(logs)}
          filename={`registros_${new Date().toISOString().split('T')[0]}`}
        />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="p-8 text-center text-zinc-500 dark:text-zinc-400">
            <div className="animate-spin w-6 h-6 border-2 border-zinc-500 border-t-transparent rounded-full mx-auto mb-2"></div>
            Cargando registros...
          </div>
        ) : error ? (
          <div className="p-6 text-center bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
            {error}
          </div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 dark:text-zinc-400">
            No hay registros disponibles.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-zinc-100 dark:bg-zinc-800">
                  <TableHead className="font-semibold text-zinc-700 dark:text-zinc-300">Fecha</TableHead>
                  <TableHead className="font-semibold text-zinc-700 dark:text-zinc-300">Usuario</TableHead>
                  <TableHead className="font-semibold text-zinc-700 dark:text-zinc-300">Acción</TableHead>
                  <TableHead className="font-semibold text-zinc-700 dark:text-zinc-300">Lead</TableHead>
                  <TableHead className="font-semibold text-zinc-700 dark:text-zinc-300">Plantilla</TableHead>
                  <TableHead className="font-semibold text-zinc-700 dark:text-zinc-300">Detalles</TableHead>
                  <TableHead className="font-semibold text-zinc-700 dark:text-zinc-300">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.isArray(logs) && logs.map((log, idx) => (
                  <TableRow 
                    key={log.id}
                    className={`transition hover:bg-zinc-50 dark:hover:bg-zinc-800/50 ${
                      idx % 2 === 0 ? "bg-white dark:bg-zinc-900" : "bg-zinc-50/50 dark:bg-zinc-900/50"
                    }`}
                  >
                    <TableCell className="whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString('es-ES', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </TableCell>
                    <TableCell>{log.user?.name || log.userId}</TableCell>
                    <TableCell className="capitalize">{log.action.replace(/_/g, ' ')}</TableCell>
                    <TableCell>{log.lead?.name || '-'}</TableCell>
                    <TableCell>{log.template?.name || '-'}</TableCell>
                    <TableCell className="max-w-lg">{renderDetails(log)}</TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteLog(log.id)}
                        title="Eliminar registro"
                        className="w-8 h-8 p-0"
                      >
                        <RiDeleteBinLine className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default RegistrosPage;
