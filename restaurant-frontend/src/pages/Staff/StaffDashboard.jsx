import React, { useEffect, useState } from "react";
import axios from "axios";

const StaffDashboard = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      console.log("DEBUG userId:", userId, "token:", token);

      if (!token || !userId) {
        alert("Bạn chưa đăng nhập.");
        return;
      }

      console.log("Gọi API lấy đơn hàng với userId:", userId);
      const res = await axios.get(`http://localhost:8080/api/orders/by-user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Dữ liệu đơn hàng trả về:", res.data);
      if (!Array.isArray(res.data)) {
        alert("API trả về không phải mảng!" + JSON.stringify(res.data));
      }
      setOrders(res.data);
    } catch (err) {
      if (err.response) {
        console.error("Lỗi API:", err.response.status, err.response.data);
        alert(`Lỗi khi tải đơn hàng: ${err.response.status} - ${JSON.stringify(err.response.data)}`);
      } else {
        console.error("Lỗi không xác định:", err);
        alert("Lỗi không xác định khi tải đơn hàng");
      }
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ Gom nhóm đơn hàng theo trạng thái
  const groupedOrders = orders.reduce((acc, order) => {
    const key = order.status || "Không xác định";
    if (!acc[key]) acc[key] = [];
    acc[key].push(order);
    return acc;
  }, {});

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">📦 Danh sách đơn hàng của bạn</h2>

        {orders.length === 0 ? (
          <p className="text-gray-600">Không có đơn hàng nào được tìm thấy.</p>
        ) : (
          Object.keys(groupedOrders).map(statusKey => (
            <div key={statusKey} className="mb-10">
              <h3 className="text-xl font-bold text-blue-600 mb-4">🗂 Trạng thái: {statusKey}</h3>
              <div className="space-y-4">
                {groupedOrders[statusKey].map(order => (
                  <div key={order.orderId} className="bg-white shadow rounded-lg p-4 border border-gray-200">
                    <h4 className="text-lg font-semibold mb-1">
                      Đơn #{order.orderId} - Bàn: {order.restaurantTable?.tableName || "?"}
                    </h4>
                    <p className="text-sm text-gray-700">🕒 Thời gian: {new Date(order.orderTime).toLocaleString()}</p>
                    <p className="text-sm text-gray-700">💰 Tổng tiền: {order.total?.toLocaleString()} VND</p>

                    {order.orderStatuses?.length > 0 && (
                      <div className="mt-3">
                        <h5 className="font-semibold text-sm mb-1">🍽 Món trong đơn:</h5>
                        <ul className="list-disc list-inside text-sm text-gray-800">
                          {order.orderStatuses.map(status => (
                            <li key={status.orderStatusId}>
                              {status.food?.foodName || "Món"} -{" "}
                              <span className="font-medium">{status.status}</span> (
                              {new Date(status.updatedAt).toLocaleTimeString("vi-VN")})
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
    </div>
  );
};

export default StaffDashboard;
