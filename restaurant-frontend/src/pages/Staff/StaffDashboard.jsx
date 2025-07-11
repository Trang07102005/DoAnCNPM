import React, { useEffect, useState } from "react";
import axios from "axios";

const StaffDashboard = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        alert("Bạn chưa đăng nhập.");
        return;
      }

      const res = await axios.get(`http://localhost:8080/api/orders/by-user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Chi tiết lỗi đơn hàng:", err.response?.status, err.response?.data);
      alert("Lỗi khi tải đơn hàng");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const groupedOrders = orders.reduce((acc, order) => {
    const key = order.status || "Không xác định";
    if (!acc[key]) acc[key] = [];
    acc[key].push(order);
    return acc;
  }, {});

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">📦 Danh sách đơn hàng theo trạng thái</h2>

      {orders.length === 0 ? (
        <p>Không có đơn hàng nào.</p>
      ) : (
        Object.keys(groupedOrders).map(statusKey => (
          <div key={statusKey} className="mb-8">
            <h3 className="text-xl font-bold mb-3 text-blue-600">🗂 Trạng thái: {statusKey}</h3>
            <div className="space-y-4">
              {groupedOrders[statusKey].map(order => (
                <div key={order.orderId} className="border border-gray-300 rounded-lg p-4 shadow bg-white">
                  <h4 className="text-lg font-semibold mb-1">
                    Đơn #{order.orderId} - Bàn {order.restaurantTable?.tableName || "?"}
                  </h4>
                  <p className="text-sm">🕒 Thời gian: {new Date(order.orderTime).toLocaleString()}</p>
                  <p className="text-sm">💰 Tổng tiền: {order.total?.toLocaleString()} VND</p>

                  {order.orderStatuses?.length > 0 && (
                    <div className="mt-3">
                      <h5 className="font-semibold">🍽 Trạng thái món ăn:</h5>
                      <ul className="list-disc list-inside text-sm">
                        {order.orderStatuses.map(status => (
                          <li key={status.orderStatusId}>
                            {status.food?.foodName || "Món"} -{" "}
                            <span className="font-medium">{status.status}</span> (
                            {new Date(status.updatedAt).toLocaleTimeString()})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default StaffDashboard;
