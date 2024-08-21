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
  LineChart,
  Line,
  PieChart,
  Pie,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  const [category, setCategory] = useState<string | null>(null);
  const [merchant, setMerchant] = useState<string | null>(null);
  const [ageRange, setAgeRange] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
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
      } catch (err) {
        setError("An error occurred while fetching data. Please try again.");
      }
    };
    fetchData();
  }, [category, merchant, ageRange]);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

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
            setAgeRange(null);
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
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="fraudCount" fill="#8884d8" />
                <Bar yAxisId="right" dataKey="fraudRate" fill="#82ca9d" />
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
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="totalAmount" fill="#8884d8" />
                <Bar yAxisId="right" dataKey="fraudRate" fill="#82ca9d" />
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
            <CardTitle>Customer Behavior</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart>
                <XAxis dataKey="_id.age" name="Age" type="number" />
                <YAxis dataKey="totalAmount" name="Total Amount" />
                <ZAxis dataKey="fraudCount" name="Fraud Count" />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                <Legend />
                <Scatter
                  name="Customer Behavior"
                  data={data.customerBehavior}
                  fill="#8884d8"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fraud Indicators</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.fraudIndicators}>
                <XAxis dataKey="_id.amount" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#8884d8"
                  name="Transaction Count"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Step Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.stepAnalysis}>
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="totalCount"
                  stroke="#8884d8"
                  name="Total Count"
                />
                <Line
                  type="monotone"
                  dataKey="fraudCount"
                  stroke="#82ca9d"
                  name="Fraud Count"
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
