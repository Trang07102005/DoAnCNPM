import React, { useEffect, useState } from "react";
import axios from "axios";
import CustomerInfoModal from "./CustomerInfoModal";
import { faCheckCircle, faClock, faUtensils } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const StaffOrderFlow = () => {
  const [step, setStep] = useState(1);
  const [tables, setTables] = useState([]);
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [note, setNote] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [orderDetails, setOrderDetails] = useState([]);
  const [showCustomerModal, setShowCustomerModal] = useState(false);

  const token = localStorage.getItem("token");
  const userId = parseInt(localStorage.getItem("userId"));
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchTables();
    fetchCategories(); // Lấy danh sách danh mục khi component mount
  }, []);

  useEffect(() => {
    if (step === 2) {
      fetchFoods();
    }
  }, [step, selectedCategory]); // Thêm selectedCategory để refetch khi thay đổi danh mục

  const fetchTables = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/tables/with-status");
      setTables(res.data);
      console.log(res.data);
    } catch (err) {
      alert("Lỗi tải danh sách bàn.");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/food-categories");
      setCategories(res.data);
    } catch (err) {
      console.log(err);
      alert("Lỗi tải danh sách danh mục.");
    }
  };

  const fetchFoods = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/food");
      let filteredFoods = res.data;
      if (selectedCategory) {
        filteredFoods = res.data.filter((food) => food.category?.categoryId === selectedCategory);
      }
      setFoods(filteredFoods);
    } catch (err) {
      console.log(err);
      alert("Lỗi tải danh sách món.");
    }
  };

  const handleAddFood = (food) => {
    const exist = orderDetails.find((d) => d.foodId === food.foodId);
    if (exist) {
      setOrderDetails(
        orderDetails.map((d) =>
          d.foodId === food.foodId ? { ...d, quantity: d.quantity + 1 } : d
        )
      );
    } else {
      setOrderDetails([
        ...orderDetails,
        {
          foodId: food.foodId,
          foodName: food.foodName,
          price: food.price,
          imageUrl: food.imageUrl,
          quantity: 1,
        },
      ]);
    }
  };

  const handleQuantityChange = (foodId, quantity) => {
    setOrderDetails(
      orderDetails.map((d) =>
        d.foodId === foodId ? { ...d, quantity } : d
      )
    );
  };

  const handleRemoveFood = (foodId) => {
    setOrderDetails(orderDetails.filter((d) => d.foodId !== foodId));
  };

  const handleSubmitOrder = async () => {
    if (orderDetails.length === 0) {
      alert("Chọn ít nhất 1 món.");
      return;
    }

    const data = {
      tableId: selectedTable.tableId,
      createdById: userId,
      orderDetails: orderDetails.map((d) => ({
        foodId: d.foodId,
        quantity: d.quantity,
        price: d.price,
      })),
    };

    try {
      await axios.post("http://localhost:8080/api/orders", data, {
        headers,
      });

      alert("Tạo đơn hàng thành công.");
      fetchTables();
      setStep(1);
      setSelectedTable(null);
      setCustomerName("");
      setNote("");
      setNumberOfGuests(1);
      setOrderDetails([]);
    } catch (err) {
      console.log(err);
      alert("Lỗi tạo đơn hàng.");
    }
  };

  const handleTableSelect = async (table) => {
    if (table.status === "Đã đặt") {
      // Kiểm tra thời gian đặt bàn
      const reservations = await axios.get(`http://localhost:8080/api/reservations`, { headers });
      const currentReservation = reservations.data.find(
        (r) => r.restaurantTable?.tableId === table.tableId && r.status === "Đã đặt"
      );
      if (currentReservation) {
        const now = new Date();
        const reservationTime = new Date(currentReservation.reservationTime);
        if (now >= reservationTime && now <= new Date(reservationTime.getTime() + 60 * 60 * 1000)) {
          // Cập nhật trạng thái đặt bàn thành "Khách đã đến" và bàn thành "Đang phục vụ"
          await axios.put(
            `http://localhost:8080/api/reservations/status/${currentReservation.reservationId}`,
            { status: "Khách đã đến" },
            { headers }
          );
          setSelectedTable(table);
          setStep(2); // Chuyển trực tiếp sang bước chọn món
          return;
        }
      }
    }
    // Nếu không phải "Đã đặt" hoặc thời gian chưa đến, mở modal thông tin khách hàng
    setSelectedTable(table);
    setShowCustomerModal(true);
  };

  return (
    <div className="space-y-10 p-6 bg-gray-200 min-h-screen rounded-2xl shadow-lg">
      {step === 1 && (
        <>
          <h2 className="text-3xl font-bold text-green-700 mb-6 tracking-wide drop-shadow-sm">
            Chọn bàn phục vụ
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {tables.map((table) => (
              <button
                key={table.tableId}
                onClick={() => handleTableSelect(table)}
                disabled={table.status === "Đang phục vụ"}
                className={`
                  relative w-full aspect-square flex flex-col items-center justify-center p-3 rounded-2xl shadow-inner transition-all duration-300
                  ${selectedTable?.tableId === table.tableId ? "ring-4 ring-blue-500 bg-white-50" : ""}
                  ${table.status === "Đang phục vụ" ? "bg-red-300 opacity-60 cursor-not-allowed" : ""}
                  ${table.status === "Đã đặt" ? "bg-yellow-100 hover:bg-yellow-200" : ""}
                  ${table.status === "Trống" ? "bg-white hover:bg-blue-50 hover:scale-[1.02]" : ""}
                `}
              >
                <div
                  className="text-base font-semibold text-white w-12 h-12 rounded-full flex items-center justify-center mb-2"
                  style={{
                    backgroundColor:
                      table.status === "Trống"
                        ? "#22c55e"
                        : table.status === "Đã đặt"
                        ? "#ffd412"
                        : "#ef4444",
                  }}
                >
                  {table.tableName}
                </div>
                <div
                  className={`
                    flex items-center gap-2 text-sm font-medium rounded-full px-3 py-2
                    ${table.status === "Trống" ? "bg-green-100 text-green-700" : ""}
                    ${table.status === "Đã đặt" ? "bg-yellow-200 text-yellow-800" : ""}
                    ${table.status === "Đang phục vụ" ? "bg-red-100 text-red-700" : ""}
                  `}
                >
                  <span
                    className={`
                      w-5 h-5 flex items-center justify-center rounded-full text-white
                      ${table.status === "Trống" ? "bg-green-500" : ""}
                      ${table.status === "Đã đặt" ? "bg-yellow-500" : ""}
                      ${table.status === "Đang phục vụ" ? "bg-red-500" : ""}
                    `}
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
                  {table.status}
                </div>
              </button>
            ))}
          </div>

          {showCustomerModal && (
            <CustomerInfoModal
              onClose={() => setShowCustomerModal(false)}
              onContinue={(name, guests, noteText) => {
                setCustomerName(name);
                setNumberOfGuests(guests);
                setNote(noteText);
                setShowCustomerModal(false);
                setStep(2);
              }}
            />
          )}
        </>
      )}

      {step === 2 && (
        <>
          <h2 className="text-3xl font-extrabold text-red-700 mb-6 tracking-wide drop-shadow-sm">
            Chọn món ăn
          </h2>

          {/* Thêm danh mục dưới dạng nút */}
          <div className="mb-6 flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                selectedCategory === null
                  ? "bg-red-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Tất cả
            </button>
            {categories.map((category) => (
              <button
                key={category.categoryId}
                onClick={() => setSelectedCategory(category.categoryId)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  selectedCategory === category.categoryId
                    ? "bg-red-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {category.categoryName}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Cột trái: Danh sách món ăn */}
            <div className="h-[500px] overflow-y-auto pr-2">
              <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                {foods.map((food) => (
                  <div
                    key={food.foodId}
                    className="rounded-2xl border border-red-300 p-4 shadow-md bg-white hover:shadow-xl transition duration-300 flex flex-col hover:scale-[1.02] transform"
                  >
                    <img
                      src={food.imageUrl}
                      alt={food.foodName}
                      className="w-full h-32 object-cover rounded-xl mb-4 border border-red-200"
                    />
                    <div className="mt-auto">
                      <div className="font-bold text-lg text-red-800">{food.foodName}</div>
                      <div className="text-sm text-gray-600 mb-3">
                        {food.price.toLocaleString()} VND
                      </div>
                      <button
                        className="w-full bg-red-600 text-white py-2 rounded-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 transition"
                        onClick={() => handleAddFood(food)}
                      >
                        ➕ Thêm món
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cột phải: Đơn hàng đã chọn */}
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-red-700 border-b border-red-300 pb-2">
                🧾 Chi tiết đơn hàng
              </h3>

              {orderDetails.length === 0 ? (
                <p className="text-gray-500 italic">Chưa chọn món nào.</p>
              ) : (
                <ul className="space-y-4 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-red-400 scrollbar-track-red-100">
                  {orderDetails.map((d) => (
                    <li
                      key={d.foodId}
                      className="flex items-center bg-white p-4 border border-red-200 rounded-xl shadow-md hover:shadow-lg transition"
                    >
                      <img
                        src={d.imageUrl}
                        alt={d.foodName}
                        className="w-20 h-20 object-cover rounded-lg mr-4 border border-red-200"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">{d.foodName}</div>
                        <div className="text-sm text-gray-500">
                          {d.price.toLocaleString()} VND
                        </div>
                      </div>
                      <input
                        type="number"
                        value={d.quantity}
                        min="1"
                        className="w-20 border border-gray-300 rounded-lg px-3 py-2 mr-3 text-center focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                        onChange={(e) =>
                          handleQuantityChange(d.foodId, parseInt(e.target.value))
                        }
                      />
                      <button
                        onClick={() => handleRemoveFood(d.foodId)}
                        className="text-red-600 hover:text-red-800 font-semibold transition"
                        aria-label={`Xoá ${d.foodName} khỏi đơn hàng`}
                      >
                        Xoá
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-6 text-xl font-bold text-right text-gray-900">
                Tạm tính:{" "}
                {orderDetails
                  .reduce((sum, item) => sum + item.price * item.quantity, 0)
                  .toLocaleString()}{" "}
                VND
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="bg-gray-400 text-white px-6 py-3 rounded-xl hover:bg-gray-500 transition focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
                >
                  Quay lại
                </button>
                <button
                  onClick={handleSubmitOrder}
                  className="bg-red-600 text-white px-8 py-3 rounded-xl hover:bg-red-700 transition focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                >
                  Tạo đơn hàng
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StaffOrderFlow;