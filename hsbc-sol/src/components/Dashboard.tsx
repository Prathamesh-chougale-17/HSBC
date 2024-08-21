"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface FinancialData {
  fraudByCategory: {
    category: string;
    fraudCount: number;
    fraudRate: number;
  }[];
  amountByMerchant: {
    merchant: string;
    totalAmount: number;
    fraudAmount: number;
    fraudRate: number;
  }[];
  ageDistribution: { _id: string; count: number }[];
  genderDistribution: { _id: string; count: number }[];
  fraudByZipcode: { zipcode: string; fraudRate: number }[];
  topMerchants: { _id: string; totalAmount: number }[];
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
];

export function Dashboard() {
  const [data, setData] = useState<FinancialData | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [merchant, setMerchant] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const params = new URLSearchParams({
        ...(category && { category }),
        ...(merchant && { merchant }),
      });

      const response = await fetch(`/api/financialData?${params}`);
      const data = await response.json();
      setData(data);
    };
    fetchData();
  }, [category, merchant]);

  if (!data) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <Select onValueChange={(value) => setCategory(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            {data.fraudByCategory.map(({ category }) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={(value) => setMerchant(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Merchant" />
          </SelectTrigger>
          <SelectContent>
            {data.topMerchants.map(({ _id }) => (
              <SelectItem key={_id} value={_id}>
                {_id}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          onClick={() => {
            setCategory(null);
            setMerchant(null);
          }}
        >
          Reset Filters
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Fraud by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.fraudByCategory}>
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="fraudCount" fill="#8884d8" />
                <Bar dataKey="fraudRate" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Amount by Merchant</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.amountByMerchant.slice(0, 10)}>
                <XAxis dataKey="merchant" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalAmount" fill="#8884d8" />
                <Bar dataKey="fraudAmount" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Age Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.ageDistribution}>
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gender Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.genderDistribution}
                  dataKey="count"
                  nameKey="_id"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {data.genderDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top 10 Fraud Rate by Zipcode</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.fraudByZipcode}>
                <XAxis dataKey="zipcode" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="fraudRate" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top 10 Merchants by Transaction Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.topMerchants}
                  dataKey="totalAmount"
                  nameKey="_id"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {data.topMerchants.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
