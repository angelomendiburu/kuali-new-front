// Ejemplo para tu Dashboard o página de leads
import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import DocumentsTable from "../components/documents-table";
import LeadCard from "../components/LeadCard";
import { leadsService } from "../services/leadsService";

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [showCards, setShowCards] = useState(false);

  const fetchLeads = async () => {
    const data = await leadsService.getAll();
    setLeads(data);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Leads</h1>
        <Button
          variant="outline"
          onClick={() => setShowCards((prev) => !prev)}
        >
          {showCards ? "Ver como tabla" : "Ver como tarjetas"}
        </Button>
      </div>
      {showCards ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </div>
      ) : (
        <DocumentsTable data={leads} onLeadUpdated={fetchLeads} />
      )}
    </div>
  );
}