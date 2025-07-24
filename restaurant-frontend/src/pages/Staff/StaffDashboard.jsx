import React, { useEffect, useState } from "react";
import axios from "axios";

const StaffDashboard = () => {
  const [servingTables, setServingTables] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedFoodId, setSelectedFoodId] = useState("");
  const [quantityToAdd, setQuantityToAdd] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchServingTables();
  }, []);

  const fetchServingTables = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/tables/serving", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServingTables(res.data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách bàn:", err);
    }
  };

  const fetchOrderByTable = async (tableId) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/orders/by-table/${tableId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const orderList = res.data;
      if (orderList.length > 0) {
        const order = orderList[0];
        setSelectedOrder(order);
        fetchOrderDetails(order.orderId);
        fetchMenuItems();
        setIsModalOpen(true); // 👉 mở modal
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
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrderDetails(res.data);
    } catch (err) {
      console.error("Lỗi khi tải chi tiết món:", err);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/food", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMenuItems(res.data);
    } catch (err) {
      console.error("Lỗi khi tải menu:", err);
    }
  };

  const updateQuantity = async (detailId, quantity) => {
    try {
      setOrderDetails((prev) =>
        prev.map((d) =>
          d.orderDetailId === detailId ? { ...d, quantity: parseInt(quantity) } : d
        )
      );

      await axios.put(
        `http://localhost:8080/api/order-details/${detailId}/quantity?quantity=${quantity}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      console.error("Lỗi khi cập nhật số lượng:", err);
    }
  };

  const addFoodToOrder = async () => {
    if (!selectedOrder) return;
    if (!selectedFoodId || quantityToAdd < 1) {
      alert("Vui lòng chọn món và số lượng hợp lệ");
      return;
    }

    try {
      const existingDetail = orderDetails.find((d) => d.foodId === parseInt(selectedFoodId));
      if (existingDetail) {
        const newQuantity = existingDetail.quantity + quantityToAdd;
        await updateQuantity(existingDetail.orderDetailId, newQuantity);
      } else {
        await axios.post(
          "http://localhost:8080/api/order-details",
          {
            orderId: selectedOrder.orderId,
            foodId: selectedFoodId,
            quantity: quantityToAdd,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      fetchOrderDetails(selectedOrder.orderId);
      setSelectedFoodId("");
      setQuantityToAdd(1);
    } catch (err) {
      console.error("Lỗi khi thêm món:", err);
      alert("Không thể thêm món: " + (err.response?.data?.message || "Lỗi không xác định"));
    }
  };

  const deleteDetail = async (detailId) => {
    try {
      await axios.delete(`http://localhost:8080/api/order-details/${detailId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrderDetails((prev) => prev.filter((d) => d.orderDetailId !== detailId));
      alert("Đã xoá món thành công");
    } catch (err) {
      console.error("Lỗi khi xoá món:", err);
    }
  };

  return (
    <div className="p-4 relative">
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

      {/* Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-3 text-gray-600 hover:text-black text-xl"
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold mb-4">
              Đơn hàng của bàn {selectedOrder.restaurantTable?.tableName}
            </h3>

            <ul className="space-y-2 mb-4 max-h-60 overflow-y-auto pr-2">
  {orderDetails.map((detail) => (
    <li
      key={detail.orderDetailId}
      className="flex items-center justify-between border-b pb-2 gap-2"
    >
      {/* Ảnh món ăn */}
      <img
        src={detail.imageUrl}
        alt={detail.foodName}
        className="w-14 h-14 object-cover rounded"
      />

      {/* Tên và giá */}
      <div className="flex-1">
        <div className="font-medium">{detail.foodName}</div>
        <div className="text-sm text-gray-600">
          Giá: {detail.price?.toLocaleString()}đ
        </div>
      </div>

      {/* Số lượng và xóa */}
      <div className="flex items-center">
        <input
          type="number"
          min={1}
          defaultValue={detail.quantity}
          onBlur={(e) => {
            const value = parseInt(e.target.value, 10);
            if (!isNaN(value) && value > 0) {
              updateQuantity(detail.orderDetailId, value);
            }
          }}
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

            <div className="text-right font-bold text-lg mb-4">
              Tổng tiền món:{" "}
              {orderDetails
                .reduce((sum, detail) => sum + detail.price * detail.quantity, 0)
                .toLocaleString()}
              đ
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2">Gọi thêm món</h4>
              <div className="flex items-center gap-2">
                <select
                  value={selectedFoodId}
                  onChange={(e) => setSelectedFoodId(e.target.value)}
                  className="border rounded px-2 py-1"
                >
                  <option value="">Chọn món</option>
                  {menuItems.map((item) => (
                    <option key={item.foodId} value={item.foodId}>
                      {item.foodName} - {item.price.toLocaleString()}đ
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min={1}
                  value={quantityToAdd}
                  onChange={(e) => setQuantityToAdd(Number(e.target.value))}
                  className="w-16 border px-2 py-1 rounded"
                />
                <button
                  onClick={addFoodToOrder}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Thêm món
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;
