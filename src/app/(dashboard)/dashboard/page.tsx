/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, 
  BarChart, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from "recharts";
import { 
  ShoppingBag, 
  Store, 
  DollarSign, 
  Package,
  TrendingUp,
  TrendingDown,
  LucideIcon,
} from "lucide-react";
import { shopApi, productApi} from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface DashboardMetrics {
  totalShops: number;
  totalProducts: number;
  totalRevenue: number;
  lowStockProducts: number;
  recentSales: any[];
  productsByShop: any[];
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalShops: 0,
    totalProducts: 0,
    totalRevenue: 0,
    lowStockProducts: 0,
    recentSales: [],
    productsByShop: [],
  });
  const [setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
    // Refresh data every 5 minutes
    const interval = setInterval(loadDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      const [shopsRes, productsRes] = await Promise.all([
        shopApi.getAll(),
        productApi.getAll(),
      ]);

      const shops = shopsRes.data;
      const products = productsRes.data;

      // Calculate metrics
      const totalRevenue = products.reduce((sum, product) => sum + product.price, 0);
      const lowStockProducts = products.filter(p => p.stockLevel <= 5).length;

      // Group products by shop
      const productsByShop = shops.map(shop => ({
        name: shop.name,
        products: products.filter(p => p.shopId === shop.id).length,
      }));

      // Mock recent sales data (replace with real data)
      const recentSales = generateMockSalesData();

      setMetrics({
        totalShops: shops.length,
        totalProducts: products.length,
        totalRevenue,
        lowStockProducts,
        recentSales,
        productsByShop,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
      console.error(error);
    } finally {

    }
  };

  return (
    <div className="space-y-6 ">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Shops"
          value={metrics.totalShops}
          icon={Store}
          trend={10}
        />
        <MetricCard
          title="Total Products"
          value={metrics.totalProducts}
          icon={Package}
          trend={-5}
        />
        <MetricCard
          title="Total Revenue"
          value={`$${metrics.totalRevenue.toFixed(2)}`}
          icon={DollarSign}
          trend={15}
        />
        <MetricCard
          title="Low Stock Products"
          value={metrics.lowStockProducts}
          icon={ShoppingBag}
          trend={-20}
          trendColor="red"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metrics.recentSales}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#8884d8" 
                    name="Sales"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Products by Shop</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.productsByShop}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="products" 
                    fill="#82ca9d" 
                    name="Products"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Helper Components
interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend: number;
  trendColor?: 'green' | 'red';
}

function MetricCard({ title, value, icon: Icon, trend, trendColor = 'green' }: MetricCardProps) {
  const TrendIcon = trend > 0 ? TrendingUp : TrendingDown;
  const trendClass = trend > 0 ? 'text-green-500' : 'text-red-500';

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {title}
            </p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="mt-4 flex items-center gap-2">
          <TrendIcon className={`h-4 w-4 ${trendClass}`} />
          <span className={`text-sm ${trendClass}`}>
            {Math.abs(trend)}% from last month
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

// Mock data generator
function generateMockSalesData() {
  const days = 7;
  const today = new Date();
  return Array.from({ length: days }).map((_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (days - i - 1));
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short' }),
      sales: Math.floor(Math.random() * 1000) + 500,
    };
  });
}
