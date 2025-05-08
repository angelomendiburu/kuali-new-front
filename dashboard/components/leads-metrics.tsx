import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"
import { Area, AreaChart, CartesianGrid } from "recharts"

import { Badge } from "@/components/ui/badge"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const metricsData = [
  {
    title: "Total Revenue",
    value: "$1,250.00",
    change: "+12.5%",
    trend: "up",
    description: "Trending up this month",
    subtitle: "Visitors for the last 6 months"
  },
  {
    title: "New Customers",
    value: "1,234",
    change: "-20%",
    trend: "down",
    description: "Down 20% this period",
    subtitle: "Acquisition needs attention"
  },
  {
    title: "Active Accounts",
    value: "45,678",
    change: "+12.5%",
    trend: "up",
    description: "Strong user retention",
    subtitle: "Engagement exceed targets"
  },
  {
    title: "Growth Rate",
    value: "4.5%",
    change: "+4.5%",
    trend: "up",
    description: "Steady performance",
    subtitle: "Meets growth projections"
  }
]

export function LeadsMetrics() {
  return (
    <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
      {metricsData.map((metric) => (
        <Card key={metric.title} className="@container/card">
          <CardHeader className="relative">
            <CardDescription>{metric.title}</CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
              {metric.value}
            </CardTitle>
            <div className="absolute right-4 top-4">
              <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
                {metric.trend === "up" ? (
                  <TrendingUpIcon className="size-3" />
                ) : (
                  <TrendingDownIcon className="size-3" />
                )}
                {metric.change}
              </Badge>
            </div>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {metric.description}
              {metric.trend === "up" ? (
                <TrendingUpIcon className="size-4" />
              ) : (
                <TrendingDownIcon className="size-4" />
              )}
            </div>
            <div className="text-muted-foreground">{metric.subtitle}</div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
