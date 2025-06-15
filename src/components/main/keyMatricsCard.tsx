import { DollarSign, Percent, ShoppingCart, TrendingUp, LucideIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

const iconMap: Record<IconType, LucideIcon> = {
  ShoppingCart,
  Percent,
  DollarSign,
  TrendingUp,
};

const KeyMetricsCard = ({ 
  title, 
  subTitle, 
  value, 
  icon, 
  trend = "neutral",
  className = "" 
}: KeyMetricsCardProps) => {
  const IconComponent = iconMap[icon];
  
  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-green-400";
      case "down":
        return "text-red-400";
      default:
        return "text-blue-400";
    }
  };

  return (
    <Card className={`
      bg-gradient-to-br from-slate-900 to-slate-800 
      border-slate-700 
      hover:shadow-xl hover:shadow-blue-500/20 
      hover:border-blue-500/30
      transition-all duration-300 
      hover:scale-[1.02]
      ${className}
    `}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-300 tracking-wide">
          {title}
        </CardTitle>
        <div className={`
          p-2 rounded-lg bg-slate-800/50 
          ${getTrendColor()}
          transition-colors duration-200
        `}>
          <IconComponent className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white mb-1 tracking-tight">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        <p className="text-xs text-slate-400 font-medium">
          {subTitle}
        </p>
      </CardContent>
    </Card>
  );
};

export default KeyMetricsCard;