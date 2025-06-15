interface DataItem {
  id: string;
  title: string;
  image?: string;
  content?: string;
  createdAt?: string;
}
// TypeScript interfaces
interface ListingGroupBy {
  _count: {
    _all: number;
  };
  _sum: {
    buyNowPrice: string;
    marketplaceFee: string;
  };
  _max: {
    buyNowPrice: string;
    marketplaceFee: string;
  };
  _min: {
    buyNowPrice: string;
    marketplaceFee: string;
  };
  item: string;
}

interface DashboardData {
  totalListingsSold: number;
  totalVolume: string;
  totalMarketplaceFees: string;
  listingsGroupBy: ListingGroupBy[];
}

interface ApiResponse {
  result: {
    data: {
      json: DashboardData;
    };
  };
}


type IconType = "ShoppingCart" | "Percent" | "DollarSign" | "TrendingUp";

interface KeyMetricsCardProps {
  title: string;
  subTitle: string;
  value: string | number;
  icon: IconType;
  trend?: "up" | "down" | "neutral";
  className?: string;
}




// Type definitions for API data
interface ListingGroupBy {
  _count: { _all: number };
  _sum: { buyNowPrice: string; marketplaceFee: string };
  _max: { buyNowPrice: string; marketplaceFee: string };
  _min: { buyNowPrice: string; marketplaceFee: string };
  item: string;
}

interface ApiDataJson {
  totalListingsSold: number;
  totalVolume: string;
  totalMarketplaceFees: string;
  listingsGroupBy: ListingGroupBy[];
}

interface ApiData {
  data: {
    json: ApiDataJson;
  };
}

interface ApiResponse {
  result: ApiData;
}

// Processed data interfaces
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
