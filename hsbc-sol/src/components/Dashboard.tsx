// components/Dashboard.tsx
"use client";
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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
  customerBehavior: {
    _id: { age: string; gender: string; category: string };
    count: number;
    fraudCount: number;
    totalAmount: number;
  }[];
  fraudIndicators: { _id: { amount: number; fraud: number }; count: number }[];
  geographicalAnalysis: {
    _id: { customerZip: string; merchantZip: string; fraud: number };
    count: number;
    totalAmount: number;
  }[];
  stepAnalysis: {
    _id: number;
    fraudCount: number;
    totalCount: number;
    totalAmount: number;
  }[];
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
];

const Dashboard = () => {
  const [data, setData] = useState<FinancialData | null>(null);
  const [category, setCategory] = useState<string>("");
  const [merchant, setMerchant] = useState<string>("");
  const [ageRange, setAgeRange] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = new URLSearchParams({
          ...(category && { category }),
          ...(merchant && { merchant }),
          ...(ageRange && { ageRange }),
        });

        const response = await fetch(`/api/financialData?${params}`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setData(data);
        setLoading(false);
      } catch (err) {
        setError("An error occurred while fetching data. Please try again.");
      }
    };
    fetchData();
  }, [category, merchant, ageRange]);

  if (error) {
    return (
      <Alert variant="destructive" className="mb-8">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!data || loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );

  return (
    <div className="container mx-auto py-8 px-4 md:px-8">
      <div className="flex flex-wrap gap-4 mb-8">
        <Select value={category} onValueChange={(value) => setCategory(value)}>
          <SelectTrigger className="bg-gray-100 hover:bg-gray-200 rounded-md px-4 py-2 w-full">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent className="bg-white shadow-lg rounded-md">
            {data.fraudByCategory.map(({ category }) => (
              <SelectItem
                key={category}
                value={category}
                className="hover:bg-gray-100 px-4 py-2"
              >
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={merchant} onValueChange={(value) => setMerchant(value)}>
          <SelectTrigger className="bg-gray-100 hover:bg-gray-200 rounded-md px-4 py-2 w-full">
            <SelectValue placeholder="Select Merchant" />
          </SelectTrigger>
          <SelectContent className="bg-white shadow-lg rounded-md">
            {data.topMerchants.map(({ _id }) => (
              <SelectItem
                key={_id}
                value={_id}
                className="hover:bg-gray-100 px-4 py-2"
              >
                {_id}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          onClick={() => {
            setCategory("");
            setMerchant("");
            setAgeRange("");
          }}
          className="bg-red-500 hover:bg-red-600 text-white rounded-md px-4 py-2"
        >
          Reset Filters
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Fraud by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.fraudByCategory}>
                <XAxis
                  dataKey="category"
                  tickFormatter={(value) => value.slice(0, 10)}
                />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    color: "#333",
                    border: "none",
                    borderRadius: "4px",
                    padding: "12px",
                    boxShadow:
                      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  }}
                  itemStyle={{ color: "#333" }}
                />
                <Legend
                  iconType="circle"
                  iconSize={10}
                  wrapperStyle={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "#333",
                  }}
                />
                <Bar yAxisId="left" dataKey="fraudCount" fill="#8884d8" />
                <Bar yAxisId="right" dataKey="fraudRate" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Amount by Merchant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.amountByMerchant.slice(0, 10)}>
                <XAxis
                  dataKey="merchant"
                  tickFormatter={(value) => value.slice(0, 10)}
                />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    color: "#333",
                    border: "none",
                    borderRadius: "4px",
                    padding: "12px",
                    boxShadow:
                      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  }}
                  itemStyle={{ color: "#333" }}
                />
                <Legend
                  iconType="circle"
                  iconSize={10}
                  wrapperStyle={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "#333",
                  }}
                />
                <Bar yAxisId="left" dataKey="totalAmount" fill="#8884d8" />
                <Bar yAxisId="right" dataKey="fraudRate" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Age Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.ageDistribution}>
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    color: "#333",
                    border: "none",
                    borderRadius: "4px",
                    padding: "12px",
                    boxShadow:
                      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  }}
                  itemStyle={{ color: "#333" }}
                />
                <Legend
                  iconType="circle"
                  iconSize={10}
                  wrapperStyle={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "#333",
                  }}
                />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Gender Distribution
            </CardTitle>
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
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    color: "#333",
                    border: "none",
                    borderRadius: "4px",
                    padding: "12px",
                    boxShadow:
                      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  }}
                  itemStyle={{ color: "#333" }}
                />
                <Legend
                  iconType="circle"
                  iconSize={10}
                  wrapperStyle={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "#333",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Fraud Indicators
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.fraudIndicators}>
                <XAxis dataKey="_id.amount" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    color: "#333",
                    border: "none",
                    borderRadius: "4px",
                    padding: "12px",
                    boxShadow:
                      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  }}
                  itemStyle={{ color: "#333" }}
                />
                <Legend
                  iconType="circle"
                  iconSize={10}
                  wrapperStyle={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "#333",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#8884d8"
                  name="Transaction Count"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Step Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.stepAnalysis}>
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    color: "#333",
                    border: "none",
                    borderRadius: "4px",
                    padding: "12px",
                    boxShadow:
                      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  }}
                  itemStyle={{ color: "#333" }}
                />
                <Legend
                  iconType="circle"
                  iconSize={10}
                  wrapperStyle={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "#333",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="totalCount"
                  stroke="#8884d8"
                  name="Total Count"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="fraudCount"
                  stroke="#82ca9d"
                  name="Fraud Count"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
