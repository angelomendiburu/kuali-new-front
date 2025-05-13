import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card } from "../components/ui/card";
// Suponiendo que tienes un servicio para companies:
import { companiesService } from "../services/companiesService";

export default function CompanyDetailPage() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);

  useEffect(() => {
    companiesService.getById(id).then(setCompany);
  }, [id]);

  if (!company) return <div>Cargando...</div>;

  return (
    <div className="max-w-xl mx-auto mt-8">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-2">{company.name}</h2>
        <div className="mb-2"><b>RUC:</b> {company.ruc}</div>
        <div className="mb-2"><b>Sector:</b> {company.sector}</div>
        <div className="mb-2"><b>País:</b> {company.country}</div>
        <div className="mb-2"><b>Número de empleados:</b> {company.employee_numbers}</div>
        <div className="mb-2"><b>Dirección:</b> {company.address}</div>
        <div className="mb-2"><b>Industria:</b> {company.industry}</div>
        {/* Agrega más campos según tu schema */}
      </Card>
    </div>
  );
}