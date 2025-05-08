import { useEffect } from 'react'
import { Button } from './components/ui/button'
import { toggleTheme } from './lib/utils'
import { RiDashboardLine, RiLineChartLine, RiUserLine, RiMoonLine, RiSunLine } from 'react-icons/ri'
import { FiDollarSign } from 'react-icons/fi'
import { BsPeople, BsGraphUp } from 'react-icons/bs'
import { IoMdTrendingUp, IoMdTrendingDown } from 'react-icons/io'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function App() {
  const chartData = [
    { date: 'Jun 23', visits: 400, extraVisits: 240 },
    { date: 'Jun 24', visits: 300, extraVisits: 139 },
    { date: 'Jun 25', visits: 600, extraVisits: 380 },
    { date: 'Jun 26', visits: 500, extraVisits: 430 },
    { date: 'Jun 27', visits: 700, extraVisits: 340 },
    { date: 'Jun 28', visits: 400, extraVisits: 200 },
    { date: 'Jun 29', visits: 800, extraVisits: 520 }
  ];

  const metrics = [
    {
      title: "Total Revenue",
      value: "$1,250.00",
      change: "+12.5%",
      description: "Trending up this month",
      subtitle: "Visitors for the last 6 months",
      icon: <FiDollarSign className="w-4 h-4" />,
      trendIcon: <IoMdTrendingUp className="w-4 h-4" />
    },
    {
      title: "New Customers",
      value: "1,234",
      change: "-20%",
      description: "Down 20% this period",
      subtitle: "Acquisition needs attention",
      icon: <BsPeople className="w-4 h-4" />,
      trendIcon: <IoMdTrendingDown className="w-4 h-4" />
    },
    {
      title: "Active Accounts",
      value: "45,678",
      change: "+12.5%",
      description: "Strong user retention",
      subtitle: "Engagement exceed targets",
      icon: <RiUserLine className="w-4 h-4" />,
      trendIcon: <IoMdTrendingUp className="w-4 h-4" />
    },
    {
      title: "Growth Rate",
      value: "4.5%",
      change: "+4.5%",
      description: "Steady performance",
      subtitle: "Meets growth projections",
      icon: <BsGraphUp className="w-4 h-4" />,
      trendIcon: <IoMdTrendingUp className="w-4 h-4" />
    }
  ]

  const menuItems = [
    { icon: <RiDashboardLine className="w-4 h-4" />, label: "Dashboard" },
    { icon: <RiLineChartLine className="w-4 h-4" />, label: "Analytics" },
    { icon: <RiUserLine className="w-4 h-4" />, label: "Customers" }
  ]

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark')
    }
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-card border-r border-border p-4">
          <div className="flex items-center gap-2 mb-8">
            <RiDashboardLine className="w-6 h-6" />
            <h1 className="text-xl font-semibold">Acme Inc.</h1>
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

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Dashboard</h2>
            <Button 
              variant="outline"
              onClick={toggleTheme}
              className="gap-2"
            >
              <RiSunLine className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <RiMoonLine className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span>Toggle Theme</span>
            </Button>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric, index) => (
              <div key={index} className="p-6 bg-card rounded-lg border border-border">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {metric.icon}
                      <p className="text-sm text-muted-foreground">{metric.title}</p>
                    </div>
                    <h3 className="text-2xl font-bold">{metric.value}</h3>
                  </div>
                  <span className={`text-sm flex items-center gap-1 ${
                    metric.change.startsWith('+') ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {metric.trendIcon}
                    {metric.change}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{metric.description}</p>
                <p className="text-xs text-muted-foreground mt-2">{metric.subtitle}</p>
              </div>
            ))}
          </div>

          {/* Chart Area */}
          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center gap-2 mb-4">
              <RiLineChartLine className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Total Visitors</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Total for the last 3 months</p>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted/20" />
                  <XAxis 
                    dataKey="date" 
                    className="text-muted-foreground text-xs"
                  />
                  <YAxis 
                    className="text-muted-foreground text-xs"
                  />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="extraVisits"
                    stackId="1"
                    stroke="hsl(var(--chart-1))"
                    fill="hsl(var(--chart-1))"
                    fillOpacity={0.2}
                  />
                  <Area
                    type="monotone"
                    dataKey="visits"
                    stackId="1"
                    stroke="hsl(var(--chart-2))"
                    fill="hsl(var(--chart-2))"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
