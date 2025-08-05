import React, { useEffect, useState } from "react";
import axios from "axios";
import { faCheckCircle, faClock, faUtensils } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


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
  const [pendingStatuses, setPendingStatuses] = useState([]);
  const [pendingItems, setPendingItems] = useState([]);
  const token = localStorage.getItem("token");

  
  
  // Hàm lấy trạng thái món ăn
  const fetchPendingStatuses = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/order-status/pending", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Pending statuses:", res.data);
      setPendingStatuses(res.data);
    } catch (err) {
      console.error("Lỗi khi tải trạng thái món ăn:", err);
    }
  };

  // Hàm ánh xạ trạng thái món ăn với order detail
  const getStatusForDetail = (orderId, foodId) => {
    const status = pendingStatuses.find(
      (s) => s.orderId === orderId && s.foodId === foodId
    );
    return status ? status.status : "Chưa xác định";
  };

  const handleHover = async (tableId) => {
    try {
      setHoveredTableId(tableId);
      const res = await axios.get(`http://localhost:8080/api/orders/by-table/${tableId}?t=${Date.now()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Orders for table (hover)", tableId, ":", res.data);
      const order = res.data[0];
      if (order) {
        const detailRes = await axios.get(
          `http://localhost:8080/api/order-details/by-order/${order.orderId}?t=${Date.now()}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Hovered order details:", detailRes.data);
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
    fetchPendingStatuses();
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
      const res = await axios.get(`http://localhost:8080/api/orders/by-table/${tableId}?t=${Date.now()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Orders for table", tableId, ":", res.data);
      const orderList = res.data;
      if (orderList.length > 0) {
        const order = orderList[0];
        console.log("Selected order:", order);
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
      const res = await axios.get(`http://localhost:8080/api/order-details/by-order/${orderId}?t=${Date.now()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Order details for order", orderId, ":", res.data);
      setOrderDetails(res.data);
      fetchPendingStatuses();
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
      fetchPendingStatuses();
    } catch (err) {
      console.error("Lỗi khi cập nhật số lượng:", err);
    }
  };

  const addFoodToOrder = async () => {
    if (!selectedOrder) return;
    if (!selectedFoodId || quantityToAdd < 1) {
      toast.warning("Vui lòng chọn món và số lượng hợp lệ");
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
      toast.error(" Không thể thêm món: " + (err.response?.data?.message || "Lỗi không xác định"));
    }
  };

  const deleteDetail = async (detailId) => {
    try {
      // Tìm trạng thái của món dựa trên orderDetailId
      const detail = orderDetails.find((d) => d.orderDetailId === detailId);
      if (!detail) {
        toast.error("Không tìm thấy món trong đơn hàng");
        return;
      }
      const status = getStatusForDetail(selectedOrder.orderId, detail.foodId);
      if (status === "Đang chế biến" || status === "Đã hoàn thành") {
        toast.warning("Không thể xóa món đang chế biến hoặc đã hoàn thành!");
        return;
      }

      await axios.delete(`http://localhost:8080/api/order-details/${detailId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrderDetails((prev) => prev.filter((d) => d.orderDetailId !== detailId));
      fetchPendingStatuses();
      toast.success("Đã xóa món thành công");
    } catch (err) {
      console.error("Lỗi khi xóa món:", err);
      toast.error(" Lỗi khi xóa món: " + (err.response?.data?.message || "Lỗi không xác định"));

    }
  };

  return (
    <>
    <ToastContainer position="top-right" autoClose={3000} />
      <img
        src="https://as1.ftcdn.net/v2/jpg/06/11/73/66/1000_F_611736653_ducpoekHSmk9pdeZ2HxDp4cu1g8aq4np.jpg"
        alt="Banner Danh sách bàn đang phục vụ"
        className="w-full h-78 object-cover shadow-md mb-4"
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
                <span
                  className="w-6 h-6 flex items-center justify-center rounded-full shadow"
                  style={{
                    backgroundColor:
                      table.status === "Trống"
                        ? "#34d399"
                        : table.status === "Đã đặt"
                        ? "#facc15"
                        : "#ef4444",
                    color: "#fff",
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
                          <p
                            className={`text-xs font-semibold ${
                              getStatusForDetail(item.orderId, item.foodId) === "Chưa chế biến"
                                ? "text-yellow-600"
                                : getStatusForDetail(item.orderId, item.foodId) === "Đang chế biến"
                                ? "text-blue-600"
                                : getStatusForDetail(item.orderId, item.foodId) === "Đã hoàn thành"
                                ? "text-green-600"
                                : "text-gray-700"
                            }`}
                          >
                            Trạng thái: {getStatusForDetail(item.orderId, item.foodId)}
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

        {isModalOpen && selectedOrder && (
  <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto p-8 relative">
      {/* Nút đóng */}
      <button
        onClick={() => setIsModalOpen(false)}
        className="absolute top-4 right-6 text-gray-600 hover:text-black text-3xl font-bold"
      >
        &times;
      </button>

      {/* Tiêu đề */}
      <h2 className="text-3xl font-bold text-center text-red-700 mb-6">
        🧾 Đơn hàng - Bàn {selectedOrder.restaurantTable?.tableName}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ======== CỘT TRÁI: Danh sách món ăn ======== */}
        <section className="bg-orange-50 border border-orange-300 rounded-2xl p-5 shadow-inner">
          <h3 className="text-xl font-bold text-orange-700 mb-4">🍽️ Danh sách món</h3>

          {/* Danh sách món có thể chọn */}
          <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
            {menuItems.map((item) => (
              <div
                key={item.foodId}
                className="flex items-center gap-4 bg-white border border-orange-200 p-3 rounded-xl shadow-sm"
              >
                <img src={item.imageUrl} alt={item.foodName} className="w-16 h-16 rounded-md object-cover" />
                <div className="flex-1">
                  <div className="font-semibold text-orange-800">{item.foodName}</div>
                  <div className="text-sm text-gray-600">{item.price.toLocaleString()} đ</div>
                </div>
                <button
                  onClick={() => {
                    const exist = pendingItems.find((p) => p.foodId === item.foodId);
                    if (!exist) {
                      setPendingItems([...pendingItems, { ...item, quantity: 1 }]);
                    }
                  }}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-lg text-sm"
                >
                  ➕ Thêm
                </button>
              </div>
            ))}
          </div>

          {/* Món chờ xác nhận */}
          {pendingItems.length > 0 && (
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-orange-700 mb-2">🕒 Món chờ xác nhận</h4>
              <ul className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {pendingItems.map((item) => (
                  <li
                    key={item.foodId}
                    className="flex items-center justify-between bg-white border border-orange-300 rounded-xl px-3 py-2 shadow-sm"
                  >
                    <div className="flex-1 font-medium text-gray-800">{item.foodName}</div>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => {
                        const qty = parseInt(e.target.value);
                        setPendingItems((prev) =>
                          prev.map((p) => (p.foodId === item.foodId ? { ...p, quantity: qty } : p))
                        );
                      }}
                      className="w-16 border rounded px-2 py-1 text-center mr-3"
                    />
                    <button
                      onClick={() =>
                        setPendingItems((prev) => prev.filter((p) => p.foodId !== item.foodId))
                      }
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Xoá
                    </button>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => {
                  pendingItems.forEach((item) => {
                    setSelectedFoodId(item.foodId);
                    setQuantityToAdd(item.quantity);
                    addFoodToOrder();
                  });
                  setPendingItems([]);
                }}
                className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl font-semibold shadow"
              >
                ✅ Xác nhận thêm món
              </button>
            </div>
          )}
        </section>

        {/* ======== CỘT PHẢI: Món đã gọi ======== */}
        <section className="bg-green-50 border border-green-300 rounded-2xl p-5 shadow-inner">
          <h3 className="text-xl font-bold text-green-700 mb-4">🧾 Món đã gọi</h3>

          {orderDetails.length === 0 ? (
            <p className="text-gray-500 italic">Chưa có món nào được gọi.</p>
          ) : (
            <ul className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {orderDetails.map((detail) => (
                <li
                  key={detail.orderDetailId}
                  className="flex items-center bg-white border border-green-200 p-3 rounded-xl shadow-sm"
                >
                  <img
                    src={detail.imageUrl}
                    alt={detail.foodName}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div className="flex-1 px-3">
                    <div className="font-semibold text-green-800">{detail.foodName}</div>
                    <div className="text-sm text-gray-600">{detail.price.toLocaleString()} đ</div>
                    <div
                      className={`text-sm font-semibold ${
                        getStatusForDetail(selectedOrder.orderId, detail.foodId) === "Chưa chế biến"
                          ? "text-yellow-600"
                          : getStatusForDetail(selectedOrder.orderId, detail.foodId) === "Đang chế biến"
                          ? "text-blue-600"
                          : "text-green-600"
                      }`}
                    >
                      Trạng thái: {getStatusForDetail(selectedOrder.orderId, detail.foodId)}
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      defaultValue={detail.quantity}
                      onBlur={(e) => {
                        const val = parseInt(e.target.value);
                        if (val > 0) updateQuantity(detail.orderDetailId, val);
                      }}
                      className="w-20 border border-green-300 rounded px-2 py-1 text-center"
                    />
                    {getStatusForDetail(selectedOrder.orderId, detail.foodId) === "Chưa chế biến" ? (
                      <button
                        onClick={() => deleteDetail(detail.orderDetailId)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Xoá
                      </button>
                    ) : (
                      <span className="text-gray-400 text-sm">Không thể xoá</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Tổng tiền */}
          <div className="text-right mt-6 font-bold text-xl text-green-900">
            Tổng tiền:{" "}
            {orderDetails.reduce((sum, d) => sum + d.price * d.quantity, 0).toLocaleString()} đ
          </div>
        </section>
      </div>
    </div>
  </div>
)}


      </div>
    </>
  );
};

export default StaffDashboard;