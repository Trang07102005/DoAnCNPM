import React, { useEffect, useState } from "react";
import axios from "axios";

const KitchenDashboard = () => {
  const [dishes, setDishes] = useState([]);

  const fetchDishes = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/order-status/pending");
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
    const interval = setInterval(fetchDishes, 10000); // refresh mỗi 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Món cần chế biến</h2>
      {dishes.length === 0 ? (
        <p>Không có món đang chờ.</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr>
              <th>Món</th>
              <th>Đơn</th>
              <th>Trạng thái</th>
              <th>Cập nhật</th>
            </tr>
          </thead>
          <tbody>
            {dishes.map(d => (
                <tr key={d.orderStatusId} className="border">
                <td>{d.foodName}</td>
                <td>#{d.orderId}</td>
                <td>{d.status}</td>
                <td>
                <select
                    value={d.status}
                    onChange={(e) => updateStatus(d.orderStatusId, e.target.value)}
                    className="border rounded px-2 py-1"
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
      )}
    </div>
  );
};

export default KitchenDashboard;
