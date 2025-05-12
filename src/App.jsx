import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Button } from './components/ui/button'
import { toggleTheme } from './lib/utils'
import { RiDashboardLine, RiLineChartLine, RiUserLine, RiMoonLine, RiSunLine } from 'react-icons/ri'
import { FiDollarSign } from 'react-icons/fi'
import { BsPeople, BsGraphUp } from 'react-icons/bs'
import { IoMdTrendingUp } from 'react-icons/io'
import { DocumentsTable } from './components/documents-table'
import { leadsService } from './services/leadsService'
import TableSkeleton from './components/ui/table-skeleton'
import { Toaster } from 'sonner'
import { Metrics } from './components/metrics'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card"
import LoginPage from "../App/Login/page"
import TemplateForm from './components/TemplateForm'

function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [metrics, setMetrics] = useState([]);

  const calculateMetrics = React.useCallback((leads) => {
    const now = new Date();
    const lastMonth = new Date(now.setMonth(now.getMonth() - 1));
    
    const totalLeads = leads.length;
    const newLeadsThisMonth = leads.filter(lead => new Date(lead.created_at) >= lastMonth).length;
    const activeLeads = leads.filter(lead => lead.status !== 'cerrado').length;
    const convertedLeads = leads.filter(lead => lead.status === 'cerrado').length;
    const conversionRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;

    const getTrend = (value) => {
      return value > 0 ? 'up' : value < 0 ? 'down' : 'up';
    };

    return [
      {
        title: "Total Leads",
        value: totalLeads.toString(),
        change: `+${newLeadsThisMonth}`,
        trend: getTrend(newLeadsThisMonth),
        description: "Crecimiento este mes",
        subtitle: "Leads en los últimos 6 meses",
        icon: <FiDollarSign className="w-4 h-4" />,
        trendIcon: <IoMdTrendingUp className="w-4 h-4" />
      },
      {
        title: "Nuevos Leads",
        value: newLeadsThisMonth.toString(),
        change: newLeadsThisMonth > 0 ? `+${newLeadsThisMonth}` : newLeadsThisMonth.toString(),
        trend: getTrend(newLeadsThisMonth),
        description: "Incremento en adquisición",
        subtitle: "Tasa de conversión mejorada",
        icon: <BsPeople className="w-4 h-4" />,
        trendIcon: <IoMdTrendingUp className="w-4 h-4" />
      },
      {
        title: "Leads Activos",
        value: activeLeads.toString(),
        change: `+${activeLeads - (totalLeads - activeLeads)}`,
        trend: getTrend(activeLeads - (totalLeads - activeLeads)),
        description: "Alta retención",
        subtitle: "Engagement superior al objetivo",
        icon: <RiUserLine className="w-4 h-4" />,
        trendIcon: <IoMdTrendingUp className="w-4 h-4" />
      },
      {
        title: "Tasa de Conversión",
        value: `${conversionRate}%`,
        change: `${conversionRate > 0 ? '+' : ''}${conversionRate}%`,
        trend: getTrend(conversionRate),
        description: "Rendimiento estable",
        subtitle: "Cumple proyecciones",
        icon: <BsGraphUp className="w-4 h-4" />,
        trendIcon: <IoMdTrendingUp className="w-4 h-4" />
      }
    ];
  }, []);

  const fetchLeads = React.useCallback(async () => {
    try {
      setLoading(true);
      const data = await leadsService.getAll();
      setLeads(data);
      setMetrics(calculateMetrics(data));
      setError(null);
    } catch (err) {
      console.error('Error al obtener leads:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [calculateMetrics]);

  const handleLeadUpdated = React.useCallback(async () => {
    try {
      const data = await leadsService.getAll();
      setMetrics(calculateMetrics(data));
    } catch (err) {
      console.error('Error al actualizar métricas:', err);
    }
  }, [calculateMetrics]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const menuItems = [
    { icon: <RiDashboardLine className="w-4 h-4" />, label: "Dashboard" },
    { icon: <RiLineChartLine className="w-4 h-4" />, label: "Leads" },
    { icon: <RiUserLine className="w-4 h-4" />, label: "Usuarios" }
  ]

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark')
    }
  }, [])

  return (
    <>
      <Toaster 
        position="top-right"
        expand={false}
        richColors 
        closeButton
      />
      <div className="min-h-screen bg-background text-foreground">
        <div className="flex min-h-screen">
          <div className="w-64 bg-card border-r border-border p-4">
            <div className="flex items-center gap-2 mb-8">
              <RiDashboardLine className="w-6 h-6" />
              <h1 className="text-xl font-semibold">Kuali CRM</h1>
            </div>
            <nav className="space-y-2">
              {menuItems.map((item, index) => (
                <Button 
                  key={index}
                  variant="ghost" 
                  className="w-full justify-start gap-2"
                >
                  {item.icon}
                  {item.label}
                </Button>
              ))}
            </nav>
          </div>

          <div className="flex-1 p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Gestión de Leads</h2>
              <Button 
                variant="outline"
                onClick={toggleTheme}
                className="gap-2"
              >
                <RiSunLine className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <RiMoonLine className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span>Cambiar Tema</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {metrics.map((metric, index) => (
                <Metrics key={index} metric={metric} />
              ))}
            </div>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Total de Leads por Fecha de Creación</CardTitle>
                <CardDescription>Historial de creación de leads del 3 al 10 de mayo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={(() => {
                        const dates = [];
                        for (let day = 3; day <= 10; day++) {
                          dates.push({
                            date: `2025-05-${String(day).padStart(2, '0')}`,
                            total: 0
                          });
                        }

                        leads.forEach(lead => {
                          const leadDate = new Date(lead.created_at);
                          const dateStr = leadDate.toISOString().split('T')[0];
                          const dateEntry = dates.find(d => d.date === dateStr);
                          if (dateEntry) {
                            dateEntry.total += 1;
                          }
                        });

                        return dates;
                      })()}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                          <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" opacity={0.2} />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(dateStr) => {
                          const day = dateStr.split('-')[2];
                          return `${parseInt(day)} may`;
                        }}
                        className="text-muted-foreground text-xs"
                        stroke="hsl(var(--muted-foreground))"
                        tickLine={false}
                        axisLine={false}
                        dy={10}
                      />
                      <YAxis
                        className="text-muted-foreground text-xs"
                        stroke="hsl(var(--muted-foreground))"
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => Math.floor(value)}
                        dx={-10}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="rounded-lg border bg-background p-2 shadow-xl">
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="flex flex-col">
                                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                                      Fecha
                                    </span>
                                    <span className="font-bold text-foreground">
                                      {new Date(payload[0].payload.date).toLocaleDateString('es-ES', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                      })}
                                    </span>
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                                      Total Leads
                                    </span>
                                    <span className="font-bold text-primary">
                                      {payload[0].value}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="total"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        fill="url(#colorTotal)"
                        fillOpacity={1}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="rounded-lg border bg-card p-6">
              {error ? (
                <div className="text-red-500 p-4 rounded-md bg-red-50 border border-red-200">
                  <h3 className="text-lg font-semibold mb-2">Error al cargar los leads</h3>
                  <p>{error}</p>
                  <Button
                    className="mt-4"
                    variant="outline"
                    onClick={fetchLeads}
                  >
                    Reintentar
                  </Button>
                </div>
              ) : loading ? (
                <TableSkeleton />
              ) : (
                <DocumentsTable 
                  data={leads} 
                  onLeadUpdated={handleLeadUpdated}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/api/users/login" element={<LoginPage />} />
        <Route path="/api/templates" element={<TemplateForm />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
