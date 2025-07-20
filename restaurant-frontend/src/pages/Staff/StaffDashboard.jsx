import React, { useEffect, useState } from "react";
import axios from "axios";

const StaffDashboard = () => {
  const [servingTables, setServingTables] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const token = localStorage.getItem("token");
  console.log("token", token);

  useEffect(() => {
    fetchServingTables();
  }, []);

  const fetchServingTables = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/tables/serving", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setServingTables(res.data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách bàn:", err);
    }
  };

  const fetchOrderByTable = async (tableId) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/orders/by-table/${tableId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const orderList = res.data;
  
      if (orderList.length > 0) {
        const order = orderList[0]; // ✅ Lấy đơn đầu tiên
        setSelectedOrder(order);
        fetchOrderDetails(order.orderId); // ✅ Đảm bảo orderId có tồn tại
        
      } else {
        setSelectedOrder(null);
        setOrderDetails([]);
      }
    } catch (err) {
      console.error("Lỗi khi tải đơn hàng:", err);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
    const res = await axios.get(`http://localhost:8080/api/order-details/by-order/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
      setOrderDetails(res.data);
    } catch (err) {
      console.error("Lỗi khi tải chi tiết món:", err);
    }
  };

  const updateQuantity = async (detailId, quantity) => {
    try {
      await axios.put(
        `http://localhost:8080/api/order-details/${detailId}/quantity?quantity=${quantity}`,
        {}, // body rỗng
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchOrderByTable(selectedOrder.restaurantTable.tableId);
    } catch (err) {
      console.error("Lỗi khi cập nhật số lượng:", err);
    }
  };

  const deleteDetail = async (detailId) => {
    try {
      await axios.delete(`http://localhost:8080/api/order-details/${detailId}`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchOrderByTable(selectedOrder.restaurantTable.tableId);
    } catch (err) {
      console.error("Lỗi khi xoá món:", err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Bàn đang phục vụ</h2>
      <div className="grid grid-cols-4 gap-4">
        {servingTables.map((table) => (
          <div
            key={table.tableId}
            className="bg-green-200 rounded-lg shadow-md p-4 cursor-pointer hover:bg-green-300 transition"
            onClick={() => fetchOrderByTable(table.tableId)}
          >
            <h3 className="text-lg font-semibold">Bàn {table.tableName}</h3>
            <p>Mã bàn: {table.tableId}</p>
          </div>
        ))}
      </div>

      {selectedOrder && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">
            Đơn hàng của bàn {selectedOrder.restaurantTable?.tableName}
          </h3>

          <ul className="space-y-2 mb-4">
            {orderDetails.map((detail) => (
              <li
                key={detail.orderDetailId}
                className="flex items-center justify-between border-b pb-1"
              >
                <div>
                <span className="font-medium">
                  {detail.foodName}
                </span>
                - Giá: {detail.price?.toLocaleString()}đ
                </div>
                <div className="flex items-center">
                  <input
                    type="number"
                    min={1}
                    defaultValue={detail.quantity}
                    onBlur={(e) =>
                      updateQuantity(detail.orderDetailId, e.target.value)
                    }
                    className="w-16 border rounded px-2 py-1 mr-2"
                  />
                  <button
                    onClick={() => deleteDetail(detail.orderDetailId)}
                    className="text-red-600 hover:underline"
                  >
                    Xoá
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="text-right font-bold text-lg">
  Tổng tiền món:{" "}
  {orderDetails
    .reduce((sum, detail) => sum + detail.price * detail.quantity, 0)
    .toLocaleString()}
  đ
</div>
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;
