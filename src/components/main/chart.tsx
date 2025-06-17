import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, LineChart, Line } from 'recharts';

// Type definitions
interface ListingGroup {
  _count: { _all: number };
  _sum: { buyNowPrice: string; marketplaceFee: string };
  _max: { buyNowPrice: string; marketplaceFee: string };
  _min: { buyNowPrice: string; marketplaceFee: string };
  item: string;
}

interface DashboardData {
  totalListingsSold: number;
  totalVolume: string;
  totalMarketplaceFees: string;
  listingsGroupBy: ListingGroup[];
}

interface ApiResponse {
  result: {
    data: {
      json: DashboardData;
    };
  };
}

interface ChartDataItem {
  name: string;
  count: number;
  volume: number;
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
}

interface PriceTrendsData {
  category: string;
  minPrice: number;
  avgPrice: number;
  maxPrice: number;
}

interface VolumeOverTimeData {
  category: string;
  week1: number;
  week2: number;
  week3: number;
  week4: number;
}

interface DistributionData {
  price: number;
  frequency: number;
  cumulative: number;
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
}
interface CardHeaderProps {
  children: React.ReactNode;
}
interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}
interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}
interface CardContentProps {
  children: React.ReactNode;
}
interface AnalysisComponentProps {
  data: ApiResponse;
}

// Constants
const COLORS: string[] = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-red-500'];

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

// Function to generate price distribution data
const generatePriceDistributionData = (item: ChartDataItem): DistributionData[] => {
  const data: DistributionData[] = [];
  const range = item.maxPrice - item.minPrice;
  const steps = 20;
  const stepSize = range / steps;

  for (let i = 0; i <= steps; i++) {
    const price = item.minPrice + (i * stepSize);
    // Simulate normal distribution around average price
    const distanceFromAvg = Math.abs(price - item.avgPrice);
    const normalizedDistance = distanceFromAvg / (range / 2);
    const frequency = Math.exp(-Math.pow(normalizedDistance * 2, 2)) * item.count * 0.1;
    const cumulative = (i / steps) * item.count;

    data.push({
      price: price,
      frequency: frequency,
      cumulative: cumulative
    });
  }

  return data;
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

// Custom tooltip formatters with proper typing
const formatCurrency = (value: number): string => `$${value}`;
const formatTooltipValue = (value: number, name: string): [string, string] => {
  if (name === 'frequency') {
    return [`${value.toFixed(2)} items`, 'Frequency'];
  }
  if (name === 'cumulative') {
    return [`${value.toFixed(2)}`, 'Cumulative'];
  }
  return [`$${value}`, name];
};

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
                    tickFormatter={formatCurrency}
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
                    tickFormatter={formatCurrency}
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

        {/* Individual Item Price Distribution Curves */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-white">Price Distribution Curves</h3>
          {chartData.map((item, index) => {
            const distributionData: DistributionData[] = generatePriceDistributionData(item);

            return (
              <Card key={item.name} className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${COLORS[index % COLORS.length]}`}></div>
                    <div>
                      <CardTitle className="text-white">{item.name} - Price Distribution</CardTitle>
                      <CardDescription className="text-slate-400">
                        Distribution curve showing price frequency (simulated normal distribution)
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Distribution Curve */}
                    <div className="lg:col-span-2">
                      <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={distributionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                          <XAxis 
                            dataKey="price" 
                            stroke="#94a3b8"
                            fontSize={12}
                            tickFormatter={(value: number) => `$${value.toFixed(0)}`}
                          />
                          <YAxis 
                            stroke="#94a3b8"
                            fontSize={12}
                            tickFormatter={(value: number) => value.toFixed(1)}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1e293b', 
                              border: '1px solid #475569',
                              borderRadius: '8px',
                              color: '#f1f5f9'
                            }}
                            formatter={formatTooltipValue}
                            labelFormatter={(value: number) => `Price: $${value.toFixed(2)}`}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="frequency" 
                            stroke={index === 0 ? '#3b82f6' : index === 1 ? '#10b981' : '#f59e0b'} 
                            strokeWidth={3}
                            dot={false}
                            name="frequency"
                          />
                          <Line 
                            type="monotone" 
                            dataKey="cumulative" 
                            stroke={index === 0 ? '#93c5fd' : index === 1 ? '#86efac' : '#fcd34d'} 
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            dot={false}
                            name="cumulative"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    
                    {/* Stats Panel */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-3">
                        <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                          <div className="text-sm text-slate-400">Items Sold</div>
                          <div className="text-2xl font-bold text-white">{item.count}</div>
                        </div>
                        <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                          <div className="text-sm text-slate-400">Total Volume</div>
                          <div className="text-2xl font-bold text-green-400">${item.volume.toLocaleString()}</div>
                        </div>
                        <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                          <div className="text-sm text-slate-400">Average Price</div>
                          <div className="text-2xl font-bold text-blue-400">${item.avgPrice.toFixed(2)}</div>
                        </div>
                        <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                          <div className="text-sm text-slate-400">Price Range</div>
                          <div className="text-lg font-bold text-white">
                            ${item.minPrice} - ${item.maxPrice}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AnalysisComponent;