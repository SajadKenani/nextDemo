import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, LineChart, Line } from 'recharts';

// Function to process API data into chart format
const processApiData = (apiData: ApiResponse): ChartDataItem[] => {
  const listings = apiData.result.data.json.listingsGroupBy;
  
  return listings.map((listing) => {
    const volume = parseFloat(listing._sum.buyNowPrice);
    const count = listing._count._all;
    const avgPrice = volume / count;
    const minPrice = parseFloat(listing._min.buyNowPrice);
    const maxPrice = parseFloat(listing._max.buyNowPrice);
    
    return {
      name: listing.item.charAt(0).toUpperCase() + listing.item.slice(1),
      count: count,
      volume: volume,
      avgPrice: avgPrice,
      minPrice: minPrice,
      maxPrice: maxPrice
    };
  });
};

// Function to generate price trends data
const generatePriceTrendsData = (chartData: ChartDataItem[]): PriceTrendsData[] => {
  return chartData.map((item) => ({
    category: item.name,
    minPrice: item.minPrice,
    avgPrice: Math.round(item.avgPrice * 100) / 100,
    maxPrice: item.maxPrice
  }));
};

// Function to generate volume over time data (simulated)
const generateVolumeOverTimeData = (chartData: ChartDataItem[]): VolumeOverTimeData[] => {
  return chartData.map((item) => {
    const baseVolume = item.volume / 4;
    return {
      category: item.name,
      week1: Math.round(baseVolume * (0.8 + Math.random() * 0.4)),
      week2: Math.round(baseVolume * (0.8 + Math.random() * 0.4)),
      week3: Math.round(baseVolume * (0.8 + Math.random() * 0.4)),
      week4: Math.round(baseVolume * (0.8 + Math.random() * 0.4))
    };
  });
};

// Card components
const Card: React.FC<CardProps> = ({ children, className = "" }) => (
  <div className={`rounded-lg border ${className}`}>
    {children}
  </div>
);

const CardHeader: React.FC<CardHeaderProps> = ({ children }) => (
  <div className="p-6 pb-4">
    {children}
  </div>
);

const CardTitle: React.FC<CardTitleProps> = ({ children, className = "" }) => (
  <h3 className={`text-lg font-semibold ${className}`}>
    {children}
  </h3>
);

const CardDescription: React.FC<CardDescriptionProps> = ({ children, className = "" }) => (
  <p className={`text-sm mt-1 ${className}`}>
    {children}
  </p>
);

const CardContent: React.FC<CardContentProps> = ({ children }) => (
  <div className="p-6 pt-0">
    {children}
  </div>
);

// Main component
const AnalysisComponent: React.FC<AnalysisComponentProps> = ({ data }) => {
  const chartData: ChartDataItem[] = processApiData(data);
  const priceTrendsData: PriceTrendsData[] = generatePriceTrendsData(chartData);
  const volumeOverTimeData: VolumeOverTimeData[] = generateVolumeOverTimeData(chartData);

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="space-y-6">
    
        {/* Price Trends Curves */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Price Range Analysis</CardTitle>
              <CardDescription className="text-slate-400">Min, Average, and Max prices by category</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={priceTrendsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis 
                    dataKey="category" 
                    stroke="#94a3b8"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#94a3b8"
                    fontSize={12}
                    tickFormatter={(value: number) => `$${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      color: '#f1f5f9'
                    }}
                    formatter={(value: number, name: string) => [`$${value}`, name]}
                  />
                  <Bar dataKey="minPrice" fill="#ef4444" name="Min Price" />
                  <Bar dataKey="avgPrice" fill="#3b82f6" name="Avg Price" />
                  <Bar dataKey="maxPrice" fill="#22c55e" name="Max Price" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Volume Trends</CardTitle>
              <CardDescription className="text-slate-400">Revenue distribution over time periods (simulated)</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={volumeOverTimeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis 
                    dataKey="category" 
                    stroke="#94a3b8"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#94a3b8"
                    fontSize={12}
                    tickFormatter={(value: number) => `$${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      color: '#f1f5f9'
                    }}
                    formatter={(value: number, name: string) => [`$${value}`, name]}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="week1" 
                    stackId="1" 
                    stroke="#8b5cf6" 
                    fill="#8b5cf6" 
                    fillOpacity={0.6}
                    name="Week 1"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="week2" 
                    stackId="1" 
                    stroke="#06b6d4" 
                    fill="#06b6d4" 
                    fillOpacity={0.6}
                    name="Week 2"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="week3" 
                    stackId="1" 
                    stroke="#10b981" 
                    fill="#10b981" 
                    fillOpacity={0.6}
                    name="Week 3"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="week4" 
                    stackId="1" 
                    stroke="#f59e0b" 
                    fill="#f59e0b" 
                    fillOpacity={0.6}
                    name="Week 4"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

      
      </div>
    </div>
  );
};



export default AnalysisComponent;