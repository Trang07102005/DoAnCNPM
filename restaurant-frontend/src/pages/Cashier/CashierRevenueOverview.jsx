import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
} from "recharts";

const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#A78BFA"];

const CashierRevenueOverview = () => {
  const [data, setData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      console.error("Không tìm thấy access token. Vui lòng đăng nhập lại.");
      console.log("accessToken", localStorage.getItem("token"));
      return;
    }
  
    axios.get("http://localhost:8080/api/cashier/revenue-summary", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        setData(res.data.details);
        setTotalRevenue(res.data.total);
      })
      .catch(err => {
        console.error("Lỗi khi tải dữ liệu:", err);
      });
  }, []);
  
  

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl space-y-6 w-full max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-bold text-rose-600">📊 Thống kê doanh thu</h2>

      <div className="text-lg">
        <span className="font-semibold">Tổng doanh thu:</span>{" "}
        <span className="text-green-600 font-bold">
          {totalRevenue.toLocaleString()}₫
        </span>
      </div>

      <div className="flex justify-center">
        <PieChart width={400} height={300}>
          <Pie
            data={data}
            dataKey="amount"
            nameKey="method"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={({ method, percent }) => `${method} (${(percent * 100).toFixed(0)}%)`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value.toLocaleString()}₫`} />
          <Legend />
        </PieChart>
      </div>
    </div>
  );
};

export default CashierRevenueOverview;
