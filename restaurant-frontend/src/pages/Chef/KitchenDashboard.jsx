import React, { useEffect, useState } from "react";
import axios from "axios";

const KitchenDashboard = () => {
  const [dishes, setDishes] = useState([]);

  const fetchDishes = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/order-status/pending");
      setDishes(res.data);
    } catch (err) {
      console.error("Lỗi khi tải món cần chế biến:", err);
      alert("Lỗi khi tải món cần chế biến");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:8080/api/order-status/${id}?status=${status}`);
      // Sau khi cập nhật xong, làm mới danh sách để ẩn món đã hoàn thành
      fetchDishes();
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái:", err);
      alert("Lỗi cập nhật trạng thái");
    }
  };

  useEffect(() => {
    fetchDishes();
    const interval = setInterval(fetchDishes, 10000); // refresh mỗi 10 giây
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Món cần chế biến</h2>
      {dishes.length === 0 ? (
        <p className="text-gray-500">Không có món đang chờ.</p>
      ) : (
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border">Món</th>
              <th className="py-2 px-4 border">Đơn</th>
              <th className="py-2 px-4 border">Trạng thái</th>
              <th className="py-2 px-4 border">Cập nhật</th>
            </tr>
          </thead>
          <tbody>
            {dishes.map(d => (
              <tr key={d.orderStatusId} className="border-t hover:bg-gray-50">
                <td className="py-2 px-4 border">{d.foodName}</td>
                <td className="py-2 px-4 border">#{d.orderId}</td>
                <td className="py-2 px-4 border">{d.status}</td>
                <td className="py-2 px-4 border">
                  <select
                    value={d.status}
                    onChange={(e) => updateStatus(d.orderStatusId, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="Chưa chế biến">Chưa chế biến</option>
                    <option value="Đang chế biến">Đang chế biến</option>
                    <option value="Đã hoàn thành">Đã hoàn thành</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default KitchenDashboard;
