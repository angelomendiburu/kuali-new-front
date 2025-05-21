import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { RiDeleteBinLine } from 'react-icons/ri';
import { toast } from 'sonner';
import { ImportExportButtons } from '../components/ImportExportButtons';
import { formatDateTime, formatDateAsISO } from '../lib/format';
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
  
  // Estados para los filtros
  const [dateFilter, setDateFilter] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [filteredLogs, setFilteredLogs] = useState([]);

  // Efecto para obtener los registros
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/registros');
        if (Array.isArray(res.data)) {
          const parsedLogs = res.data.map(log => {
            if (typeof log.details === 'string') {
              try {
                const trimmedDetails = log.details.trim();
                if (trimmedDetails.startsWith('{') || trimmedDetails.startsWith('[')) {
                  return { ...log, details: JSON.parse(log.details) };
                } else {
                  return { ...log, details: { raw: log.details, isString: true } };
                }
              } catch (e) {
                console.error('Error parsing log details:', e);
                return { ...log, details: { raw: log.details, isString: true, error: 'Parse Error' } };
              }
            }
            return log;
          });
          setLogs(parsedLogs);
        } else {
          setLogs([]);
          setError('Formato de datos inválido');
        }
      } catch (err) {
        setError(err.response?.data?.error || 'Error al cargar registros');
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);  // Efecto para aplicar los filtros
  useEffect(() => {
    let result = [...logs];
    
    if (dateFilter) {
      const selectedDate = new Date(dateFilter + 'T00:00:00');
      if (!isNaN(selectedDate.getTime())) {
        const formattedDate = formatDateAsISO(selectedDate);
        if (formattedDate) {
          result = result.filter(log => {
            const logDate = formatDateAsISO(log.createdAt);
            return logDate === formattedDate;
          });
        }
      } else {
        console.error('Fecha de filtro inválida:', dateFilter);
      }
    }
    
    if (nameFilter) {
      const searchTerm = nameFilter.toLowerCase();
      result = result.filter(log => 
        (log.lead?.name || '').toLowerCase().includes(searchTerm)
      );
    }
    
    if (userFilter) {
      const searchTerm = userFilter.toLowerCase();
      result = result.filter(log => 
        (log.user?.name || '').toLowerCase().includes(searchTerm)
      );
    }
    
    setFilteredLogs(result);
  }, [logs, dateFilter, nameFilter, userFilter]);

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

  // Función para limpiar todos los registros
  const handleClearAllLogs = async () => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar TODOS los registros? Esta acción no se puede deshacer.')) {
      return;
    }
    
    try {
      await axios.delete('/registros');
      setLogs([]);
      toast.success('Todos los registros han sido eliminados');
    } catch (error) {
      console.error('Error al eliminar todos los registros:', error);
      toast.error('Error al eliminar los registros');
    }
  };

  // Función para renderizar los detalles según la acción
  const renderDetails = (log) => {
    if (!log.details) return '-';

    if (log.details.isString) {
      return log.details.raw;
    }

    switch (log.action) {
      case 'send_whatsapp':
      case 'send_mail':
      case 'create_lead':
      case 'update_lead':
      case 'delete_lead':
      case 'create_user':
      case 'update_user':
      case 'delete_user':
        // Renderizar detalles existentes
        return JSON.stringify(log.details);
      default:
        return JSON.stringify(log.details);
    }
  };

  const prepareLogsForExport = (logs) => {
    return logs.map(log => ({
      Fecha: formatDateTime(log.createdAt) || 'Fecha inválida',
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
          onImport={() => {}}
          data={prepareLogsForExport(filteredLogs)}
          filename={`registros_${new Date().toISOString().split('T')[0]}`}
        />
      </CardHeader>
      <CardContent>
        {/* Barra de filtros */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Fecha</label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Nombre de Lead</label>
            <input
              type="text"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              placeholder="Buscar por nombre..."
              className="w-full px-3 py-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Usuario</label>
            <input
              type="text"
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              placeholder="Buscar por usuario..."
              className="w-full px-3 py-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700"
            />
          </div>
          <div className="flex items-end">
            <Button
              variant="destructive"
              onClick={handleClearAllLogs}
              className="w-full"
            >
              Limpiar Registros
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-zinc-500 dark:text-zinc-400">
            <div className="animate-spin w-6 h-6 border-2 border-zinc-500 border-t-transparent rounded-full mx-auto mb-2"></div>
            Cargando registros...
          </div>
        ) : error ? (
          <div className="p-6 text-center bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
            {error}
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 dark:text-zinc-400">
            No hay registros que coincidan con los filtros.
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
                {filteredLogs.map((log, idx) => (
                  <TableRow 
                    key={log.id}
                    className={`transition hover:bg-zinc-50 dark:hover:bg-zinc-800/50 ${
                      idx % 2 === 0 ? "bg-white dark:bg-zinc-900" : "bg-zinc-50/50 dark:bg-zinc-900/50"
                    }`}
                  >
                    <TableCell className="whitespace-nowrap">
                      {formatDateTime(log.createdAt)}
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
