// Ejemplo para tu Dashboard o página de leads
import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import DocumentsTable from "../components/documents-table";
import LeadCard from "../components/LeadCard";
import { leadsService } from "../services/leadsService";
import { ImportExportButtons } from "../components/ImportExportButtons";
import { formatDateAsISO } from "../lib/format";
import { toast } from 'sonner';

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [showCards, setShowCards] = useState(false);
  const [importing, setImporting] = useState(false);
  const [dateFilter, setDateFilter] = useState('');

  const fetchLeads = async () => {
    try {
      const data = await leadsService.getAll();
      setLeads(data);
      setFilteredLeads(data);
    } catch (error) {
      console.error('Error al obtener leads:', error);
      toast.error('Error al cargar los leads');
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Aplicar filtros cuando cambie la fecha o los leads
  useEffect(() => {
    if (!leads) return;

    let filtered = [...leads];
    
    if (dateFilter) {
      const selectedDate = new Date(dateFilter + 'T00:00:00');
      if (!isNaN(selectedDate.getTime())) {
        const formattedDate = formatDateAsISO(selectedDate);
        if (formattedDate) {
          filtered = filtered.filter(lead => {
            const leadDate = formatDateAsISO(lead.createdAt || lead.created_at);
            return leadDate === formattedDate;
          });
        }
      }
    }

    setFilteredLeads(filtered);
  }, [leads, dateFilter]);

  const handleImport = async (importedData) => {
    if (!importedData || importedData.length === 0) {
      toast.error('No hay datos válidos para importar');
      return;
    }

    setImporting(true);
    const total = importedData.length;
    let imported = 0;
    let errors = 0;

    try {
      toast.info(`Iniciando importación de ${total} registros...`);

      for (const lead of importedData) {
        try {
          await leadsService.create(lead);
          imported++;
          // Actualizar progreso cada 5 registros o al final
          if (imported === total || imported % 5 === 0) {
            toast.success(`Progreso: ${imported}/${total} leads importados`);
          }
        } catch (error) {
          console.error('Error al importar lead:', lead, error);
          errors++;
          toast.error(`Error al importar lead: ${lead.name || 'Sin nombre'}`);
        }
      }

      await fetchLeads(); // Recargar la lista después de importar

      if (errors > 0) {
        toast.warning(
          `Importación completada con ${errors} errores. ${imported} de ${total} leads importados correctamente.`
        );
      } else {
        toast.success(`Importación completada. ${imported} leads importados correctamente.`);
      }
    } catch (error) {
      console.error('Error general al importar:', error);
      toast.error('Error al importar los datos');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Leads</h1>
          <div className="flex items-center gap-2">
            {/* 
            <div className="mr-4">
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700"
                placeholder="Filtrar por fecha"
              />
            </div>
            */}
            <ImportExportButtons
              onImport={handleImport}
              data={filteredLeads}
              filename="leads"
              disabled={importing}
            />
            <Button
              variant="outline"
              onClick={() => setShowCards((prev) => !prev)}
            >
              {showCards ? "Ver como tabla" : "Ver como tarjetas"}
            </Button>
          </div>
        </div>
      </div>
      {showCards ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filteredLeads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </div>
      ) : (
        <DocumentsTable data={filteredLeads} onLeadUpdated={fetchLeads} />
      )}
    </div>
  );
}
