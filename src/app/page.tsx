'use client'

import { useEffect, useState } from "react";
import KeyMatricsCard from "@/components/main/keyMatricsCard";
import AnalysisComponent from "@/components/main/chart";
import React from "react";

// Define types for dashboard data
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

const data: ApiResponse = {
  "result": {
    "data": {
      "json": {
        "totalListingsSold": 32,
        "totalVolume": "1362.8",
        "totalMarketplaceFees": "77.024",
        "listingsGroupBy": [
          {
            "_count": { "_all": 2 },
            "_sum": { "buyNowPrice": "650", "marketplaceFee": "52" },
            "_max": { "buyNowPrice": "500", "marketplaceFee": "40" },
            "_min": { "buyNowPrice": "150", "marketplaceFee": "12" },
            "item": "cattle"
          },
          {
            "_count": { "_all": 2 },
            "_sum": { "buyNowPrice": "12", "marketplaceFee": "0.96" },
            "_max": { "buyNowPrice": "7", "marketplaceFee": "0.56" },
            "_min": { "buyNowPrice": "5", "marketplaceFee": "0.4" },
            "item": "hatched"
          },
          {
            "_count": { "_all": 28 },
            "_sum": { "buyNowPrice": "700.8", "marketplaceFee": "24.064" },
            "_max": { "buyNowPrice": "200", "marketplaceFee": "1.28" },
            "_min": { "buyNowPrice": "7", "marketplaceFee": "0.56" },
            "item": "hen"
          }
        ]
      }
    }
  }
};

export default function Home() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setDashboardData(data.result.data.json);
    setLoading(false);
  }, []);

  if (loading || !dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const { totalListingsSold, totalVolume, totalMarketplaceFees } = dashboardData;

  // Calculate additional metrics
  const avgOrderValue: number = parseFloat(totalVolume) / totalListingsSold;
  const feePercentage: number = (parseFloat(totalMarketplaceFees) / parseFloat(totalVolume)) * 100;

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white"> Dashboard </h1>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KeyMatricsCard
            title={"Total Sales"}
            subTitle={"Listings sold"}
            value={totalListingsSold}
            icon={"ShoppingCart"} />

          <KeyMatricsCard
            title={"Total Volume"}
            subTitle={"Revenue generated"}
            value={`${parseFloat(totalVolume).toLocaleString()}`}
            icon={"DollarSign"} />

          <KeyMatricsCard
            title={"Marketplace Fees"}
            subTitle={`${feePercentage.toFixed(1)}% of volume`}
            value={`${parseFloat(totalMarketplaceFees).toFixed(2)}`}
            icon={"Percent"} />

          <KeyMatricsCard
            title={"Avg Order Value"}
            subTitle={`Per transaction`}
            value={`${avgOrderValue.toFixed(2)}`}
            icon={"TrendingUp"} />

        </div>

        {/* Pass the correct ApiResponse shape */}
        <AnalysisComponent data={data} />

      </div>
    </div>
  );
}