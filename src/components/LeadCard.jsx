import { Card } from "./ui/card";
import { RiUserLine, RiBuildingLine, RiMailLine, RiPhoneLine } from "react-icons/ri";
import { FiMail } from "react-icons/fi";
import { RiWhatsappLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function LeadCard({ lead }) {
  const navigate = useNavigate();

  return (
    <Card className="mb-6 p-6 rounded-xl shadow-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
      {/* Encabezado */}
      <div className="flex items-center gap-4 mb-4">
        <RiUserLine className="w-10 h-10 text-primary" />
        <div>
          <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{lead.name}</h3>
          <span className={`inline-block mt-1 px-2 py-1 rounded text-xs font-semibold ${lead.status === "cerrado" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"}`}>
            {lead.status}
          </span>
        </div>
      </div>

      {/* Información de contacto */}
      <div className="mb-4">
        <h4 className="font-semibold text-zinc-800 dark:text-zinc-200 mb-2">Contacto</h4>
        <div className="flex items-center gap-2 mb-1">
          <RiMailLine className="w-4 h-4 text-zinc-500" />
          <span className="text-zinc-700 dark:text-zinc-300">{lead.email}</span>
          {lead.email && (
            <a
              href={`mailto:${lead.email}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Enviar correo"
              className="text-blue-600 hover:text-blue-800"
            >
              <FiMail />
            </a>
          )}
        </div>
        <div className="flex items-center gap-2 mb-1">
          <RiPhoneLine className="w-4 h-4 text-zinc-500" />
          <span className="text-zinc-700 dark:text-zinc-300">{lead.phone}</span>
          {lead.phone && (
            <a
              href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Enviar WhatsApp"
              className="text-green-600 hover:text-green-800"
            >
              <RiWhatsappLine />
            </a>
          )}
        </div>
        {lead.linkedin && (
          <div className="flex items-center gap-2 mb-1">
            <span className="text-zinc-700 dark:text-zinc-300">LinkedIn:</span>
            <a
              href={lead.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {lead.linkedin}
            </a>
          </div>
        )}
      </div>

      {/* Información de empresa */}
      <div className="mb-4">
        <h4 className="font-semibold text-zinc-800 dark:text-zinc-200 mb-2">Empresa</h4>
        <div className="flex items-center gap-2 mb-1">
          <RiBuildingLine className="w-4 h-4 text-zinc-500" />
          <span className="text-zinc-700 dark:text-zinc-300 font-semibold">{lead.company?.name || "Sin empresa"}</span>
          {lead.company?.id && (
            <button
              onClick={() => navigate(`/companies/${lead.company.id}`)}
              className="ml-2 px-2 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs"
              title="Ver empresa"
            >
              Ver empresa
            </button>
          )}
        </div>
        {lead.company && (
          <div className="pl-6 text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
            {lead.company.industry && <div><b>Industria:</b> {lead.company.industry}</div>}
            {lead.company.address && <div><b>Dirección:</b> {lead.company.address}</div>}
            {lead.company.sector && <div><b>Sector:</b> {lead.company.sector}</div>}
            {lead.company.country && <div><b>País:</b> {lead.company.country}</div>}
            {lead.company.employee_numbers && <div><b>Empleados:</b> {lead.company.employee_numbers}</div>}
          </div>
        )}
      </div>

      {/* Otros datos */}
      <div className="mb-2 text-zinc-600 dark:text-zinc-400 text-sm">
        <b>Creado:</b> {new Date(lead.created_at).toLocaleString("es-PE", {
          timeZone: 'America/Lima',
          dateStyle: 'medium',
          timeStyle: 'short'
        })}
      </div>
      {lead.notes && (
        <div className="mb-2 text-zinc-700 dark:text-zinc-200">
          <b>Notas:</b> {lead.notes}
        </div>
      )}
      {lead.job_role && (
        <div className="mb-2 text-zinc-700 dark:text-zinc-200">
          <b>Cargo:</b> {lead.job_role}
        </div>
      )}
      {lead.work_area && (
        <div className="mb-2 text-zinc-700 dark:text-zinc-200">
          <b>Área:</b> {lead.work_area}
        </div>
      )}
    </Card>
  );
}