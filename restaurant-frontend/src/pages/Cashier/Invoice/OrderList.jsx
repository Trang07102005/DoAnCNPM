import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/orders");
      setOrders(res.data);
    } catch (err) {
      alert("Không thể tải đơn hàng");
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Danh sách đơn hàng</h2>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-3 py-2">Mã</th>
            <th className="border px-3 py-2">Bàn</th>
            <th className="border px-3 py-2">Tổng tiền</th>
            <th className="border px-3 py-2">Trạng thái</th>
            <th className="border px-3 py-2">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.orderId}>
              <td className="border px-3 py-1">{order.orderId}</td>
              <td className="border px-3 py-1">{order.restaurantTable?.tableName}</td>
              <td className="border px-3 py-1">{order.total?.toLocaleString()} VND</td>
              <td className="border px-3 py-1">{order.status}</td>
              <td className="border px-3 py-1">
                <button
                  className="text-blue-600 underline"
                  onClick={() => navigate(`/orders/${order.orderId}`)}
                >
                  Xem chi tiết
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderList;
