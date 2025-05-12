import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

export function Metrics({ metric }) {
  return (
    <Card>
      <CardHeader className="relative">
        <CardDescription>{metric.title}</CardDescription>
        <CardTitle className="text-2xl font-semibold">
          {metric.value}
        </CardTitle>
        <div className="absolute right-4 top-4">
          <Badge 
            variant="outline" 
            className={`flex gap-1 rounded-lg text-xs ${
              metric.trend === 'up' ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {metric.trend === 'up' ? (
              <TrendingUpIcon className="h-3 w-3" />
            ) : (
              <TrendingDownIcon className="h-3 w-3" />
            )}
            {metric.change}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{metric.description}</span>
            {metric.trend === 'up' ? (
              <TrendingUpIcon className="h-4 w-4" />
            ) : (
              <TrendingDownIcon className="h-4 w-4" />
            )}
          </div>
          <p className="text-sm text-muted-foreground">{metric.subtitle}</p>
        </div>
      </CardContent>
    </Card>
  );
}