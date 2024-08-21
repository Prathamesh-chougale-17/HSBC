// app/dashboard/page.tsx

"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface FinancialData {
  transactionsByCategory: { _id: string; count: number; totalAmount: number }[];
  transactionsByMerchant: { _id: string; count: number; totalAmount: number }[];
  fraudOverTime: { _id: number; fraudCount: number; totalCount: number }[];
  ageDistribution: { _id: number; count: number }[];
  genderDistribution: { _id: string; count: number }[];
  topMerchants: { _id: string; totalAmount: number }[];
  averageTransactionAmount: { averageAmount: number }[];
  fraudByZipcode: { zipcode: string; fraudRate: number }[];
  categoryTrends: {
    _id: { category: string; step: number };
    totalAmount: number;
  }[];
  customerSegmentation: {
    _id: { age: number; gender: string };
    count: number;
    totalAmount: number;
    avgAmount: number;
  }[];
}

const Dashboard = () => {
  const [data, setData] = useState<FinancialData | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [category, setCategory] = useState("");
  const [merchant, setMerchant] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const params = new URLSearchParams({
        startDate,
        endDate,
        category,
        merchant,
      });
      const response = await fetch(`/api/financial-data?${params}`);
      const jsonData = await response.json();
      setData(jsonData);
    };
    fetchData();
  }, [startDate, endDate, category, merchant]);

  if (!data) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Financial Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">
            Transactions by Category
          </h2>
          <BarChart width={500} height={300} data={data.transactionsByCategory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalAmount" fill="#8884d8" />
          </BarChart>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Fraud Over Time</h2>
          <LineChart width={500} height={300} data={data.fraudOverTime}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="fraudCount" stroke="#8884d8" />
            <Line type="monotone" dataKey="totalCount" stroke="#82ca9d" />
          </LineChart>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Age Distribution</h2>
          <BarChart width={500} height={300} data={data.ageDistribution}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#82ca9d" />
          </BarChart>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Gender Distribution</h2>
          <PieChart width={500} height={300}>
            <Pie
              data={data.genderDistribution}
              dataKey="count"
              nameKey="_id"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {data.genderDistribution.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === 0 ? "#8884d8" : "#82ca9d"}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">
          Average Transaction Amount
        </h2>
        <p className="text-2xl font-bold">
          ${data.averageTransactionAmount[0]?.averageAmount.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
