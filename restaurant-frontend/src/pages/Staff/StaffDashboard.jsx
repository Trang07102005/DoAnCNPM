import React, { useEffect, useState } from "react";
import axios from "axios";
import { faCheckCircle, faClock, faUtensils } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const StaffDashboard = () => {
  const [servingTables, setServingTables] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedFoodId, setSelectedFoodId] = useState("");
  const [quantityToAdd, setQuantityToAdd] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredTableId, setHoveredTableId] = useState(null);
  const [hoveredOrderDetails, setHoveredOrderDetails] = useState([]);

  const token = localStorage.getItem("token");
  const handleHover = async (tableId) => {
    try {
      setHoveredTableId(tableId);
      const res = await axios.get(`http://localhost:8080/api/orders/by-table/${tableId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const order = res.data[0];
      if (order) {
        const detailRes = await axios.get(
          `http://localhost:8080/api/order-details/by-order/${order.orderId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setHoveredOrderDetails(detailRes.data);
      } else {
        setHoveredOrderDetails([]);
      }
    } catch (err) {
      console.error("Lỗi khi hover:", err);
    }
  };
  
  const clearHover = () => {
    setHoveredTableId(null);
    setHoveredOrderDetails([]);
  };
  
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
        setIsModalOpen(true);
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
    <>
  {/* Banner ở trên cùng */}
  <img
    src="https://as1.ftcdn.net/v2/jpg/06/11/73/66/1000_F_611736653_ducpoekHSmk9pdeZ2HxDp4cu1g8aq4np.jpg" // thay bằng đường dẫn ảnh của bạn
    alt="Banner Danh sách bàn đang phục vụ"
    className="w-full h-78 object-cover   shadow-md mb-4"
  />
    <div className="p-6 min-h-screen bg-white-100">
      <h2 className="text-2xl font-bold uppercase mb-6 text-red-700">
        🧾 Danh sách bàn đang phục vụ
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
  {servingTables.map((table) => (
    <div
      key={table.tableId}
      onMouseEnter={() => handleHover(table.tableId)}
      onMouseLeave={clearHover}
      className="relative bg-white hover:bg-red-200 border border-red-300 rounded-xl p-5 shadow-md cursor-pointer transition-transform transform hover:scale-105"
      onClick={() => fetchOrderByTable(table.tableId)}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-semibold text-red-700">
          Bàn {table.tableName}
        </h3>
        <span className="w-6 h-6 flex items-center justify-center rounded-full shadow"
          style={{
            backgroundColor:
              table.status === "Trống"
                ? "#34d399"
                : table.status === "Đã đặt"
                ? "#facc15"
                : "#ef4444",
            color: "#fff"
          }}
        >
          <FontAwesomeIcon
            icon={
              table.status === "Trống"
                ? faCheckCircle
                : table.status === "Đã đặt"
                ? faClock
                : faUtensils
            }
            className="text-xs"
          />
        </span>
      </div>
      <p className="text-sm text-gray-600">Mã bàn: {table.tableId}</p>

      {/* Danh sách món ăn khi hover */}
      {hoveredTableId === table.tableId && hoveredOrderDetails.length > 0 && (
        <div className="absolute top-full left-0 mt-2 z-20 w-72 bg-white border border-gray-300 rounded-xl shadow-xl p-4">
          <h4 className="font-bold text-red-700 text-lg mb-2">
            🍽 Món đang phục vụ
          </h4>
          <ul className="space-y-2 max-h-60 overflow-y-auto">
            {hoveredOrderDetails.map((item) => (
              <li
                key={item.orderDetailId}
                className="flex items-center gap-2 text-sm"
              >
                <img
                  src={item.imageUrl}
                  alt={item.foodName}
                  className="w-10 h-10 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{item.foodName}</p>
                  <p className="text-gray-500 text-xs">
                    SL: {item.quantity} • {item.price.toLocaleString()} đ
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  ))}
</div>


      {/* Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-6 text-gray-600 hover:text-black text-3xl font-bold"
            >
              &times;
            </button>

            <h3 className="text-3xl font-bold text-center text-red-800 mb-6">
              Đơn hàng - Bàn {selectedOrder.restaurantTable?.tableName}
            </h3>

            <ul className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
              {orderDetails.map((detail) => (
                <li
                  key={detail.orderDetailId}
                  className="flex items-center justify-between  border border-red-500 bg-red-100  font-semibold rounded-xl p-4 shadow"
                >
                  <img
                    src={detail.imageUrl}
                    alt={detail.foodName}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div className="flex-1 px-4">
                    <div className="font-semibold text-xl text-green-800">{detail.foodName}</div>
                    <div className="text-sm text-gray-600">
                      {detail.price.toLocaleString()} đ
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={1}
                      defaultValue={detail.quantity}
                      onBlur={(e) => {
                        const val = parseInt(e.target.value);
                        if (val > 0) updateQuantity(detail.orderDetailId, val);
                      }}
                      className="w-20 border border-red-300 rounded px-2 py-1 text-center"
                    />
                    <button
                      onClick={() => deleteDetail(detail.orderDetailId)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Xoá
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="text-right font-semibold text-xl text-green-900 mb-6">
              Tổng tiền:{" "}
              {orderDetails
                .reduce((sum, d) => sum + d.price * d.quantity, 0)
                .toLocaleString()}{" "}
              đ
            </div>

            <div className="border-t pt-4">
              <h4 className="text-xl font-semibold text-red-700 mb-3">➕ Gọi thêm món</h4>
              <div className="flex flex-wrap gap-4">
                <select
                  value={selectedFoodId}
                  onChange={(e) => setSelectedFoodId(e.target.value)}
                  className="border border-red-300 rounded-lg px-4 py-2 w-full sm:w-1/2"
                >
                  <option value="">Chọn món</option>
                  {menuItems.map((item) => (
                    <option key={item.foodId} value={item.foodId}>
                      {item.foodName} - {item.price.toLocaleString()} đ
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  min={1}
                  value={quantityToAdd}
                  onChange={(e) => setQuantityToAdd(Number(e.target.value))}
                  className="w-24 border border-red-300 rounded px-4 py-2 text-center"
                />

                <button
                  onClick={addFoodToOrder}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg shadow transition"
                >
                  Thêm món
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default StaffDashboard;
