import React, { useEffect, useState } from "react";
import axios from "axios";

const statusColorMap = {
  "Chưa chế biến": "bg-red-100 text-red-800",
  "Đang chế biến": "bg-yellow-100 text-yellow-800",
  "Hoàn thành": "bg-green-100 text-green-800",
};

const KitchenDashboard = () => {
  const [dishes, setDishes] = useState([]);

  const fetchDishes = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/order-status/all");
      setDishes(res.data);
    } catch (err) {
      alert("Lỗi khi tải món cần chế biến");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:8080/api/order-status/${id}?status=${status}`);
      fetchDishes();
    } catch (err) {
      alert("Lỗi cập nhật trạng thái");
    }
  };

  useEffect(() => {
    fetchDishes();
    const interval = setInterval(fetchDishes, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">🍽️ Món cần chế biến</h2>

        {dishes.length === 0 ? (
          <p className="text-gray-600">Không có món nào đang chờ chế biến.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="p-3 text-left">Món</th>
                  <th className="p-3 text-left">Đơn hàng</th>
                  <th className="p-3 text-left">Trạng thái</th>
                  <th className="p-3 text-left">Cập nhật</th>
                </tr>
              </thead>
              <tbody>
                {dishes.map((d) => (
                  <tr key={d.orderStatusId} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-3 font-medium text-gray-800">{d.foodName}</td>
                    <td className="p-3 text-gray-600">#{d.orderId}</td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColorMap[d.status] || "bg-gray-100 text-gray-700"}`}
                      >
                        {d.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <select
                        value={d.status}
                        onChange={(e) => updateStatus(d.orderStatusId, e.target.value)}
                        className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring focus:ring-blue-200"
                      >
                        <option value="Chưa chế biến">Chưa chế biến</option>
                        <option value="Đang chế biến">Đang chế biến</option>
                        <option value="Hoàn thành">Hoàn thành</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default KitchenDashboard;
