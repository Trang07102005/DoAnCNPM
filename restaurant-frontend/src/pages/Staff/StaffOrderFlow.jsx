import React, { useEffect, useState } from "react";
import axios from "axios";
import CustomerInfoModal from "./CustomerInfoModal";
import { faCheckCircle, faClock, faUtensils } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

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
    } catch (err) {
      console.log(err);
      toast.error("❌ Lỗi tải danh sách bàn.");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/food-categories");
      setCategories(res.data);
    } catch (err) {
      console.log(err);
      toast.error("❌ Lỗi tải danh sách danh mục.");
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
      toast.error("❌ Lỗi tải danh sách món ăn.");
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
      toast.warning("⚠️ Chọn ít nhất 1 món!");
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

      toast.success("Tạo đơn hàng thành công!");
      fetchTables();
      setStep(1);
      setSelectedTable(null);
      setCustomerName("");
      setNote("");
      setNumberOfGuests(1);
      setOrderDetails([]);
    } catch (err) {
      console.log(err);
      toast.error("❌ Lỗi tạo đơn hàng.");
    }
  };

  const handleTableSelect = async (table) => {
    if (table.status === "Đã đặt") {
      try {
        const reservations = await axios.get(`http://localhost:8080/api/reservations`, { headers });
        const currentReservation = reservations.data.find(
          (r) => r.restaurantTable?.tableId === table.tableId && r.status === "Đã đặt"
        );
        if (currentReservation) {
          const now = new Date();
          const reservationTime = new Date(currentReservation.reservationTime);
          if (now >= reservationTime && now <= new Date(reservationTime.getTime() + 60 * 60 * 1000)) {
            await axios.put(
              `http://localhost:8080/api/reservations/status/${currentReservation.reservationId}`,
              { status: "Khách đã đến" },
              { headers }
            );
            setSelectedTable(table);
            setStep(2);
            toast.info("👋 Khách đã đến. Bắt đầu phục vụ!");
            return;
          }
        }
      } catch (error) {
        console.log(error);
        toast.error("❌ Lỗi xử lý trạng thái đặt bàn.");
        return;
      }
    }
    setSelectedTable(table);
    setShowCustomerModal(true);
  };

  return (
    <div className="space-y-10 p-6 bg-gray-200 min-h-screen rounded-2xl shadow-lg">
     <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop />
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

          {/* DANH MỤC (CATEGORY) NÚT */}
        <div className="mb-8 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-5 py-2 rounded-full font-semibold shadow-md transition-all duration-200 border ${
              selectedCategory === null
                ? "bg-red-600 text-white border-red-600"
                : "bg-white text-gray-700 hover:bg-red-100 border-gray-300"
            }`}
          >
            Tất cả
          </button>

          {categories.map((category) => (
            <button
              key={category.categoryId}
              onClick={() => setSelectedCategory(category.categoryId)}
              className={`px-5 py-2 rounded-full font-thin shadow-md transition-all duration-200 border ${
                selectedCategory === category.categoryId
                  ? "bg-orange-600 text-white border-orange-600"
                  : "bg-white text-gray-700 hover:bg-red-100 border-gray-300"
              }`}
            >
              {category.categoryName}
            </button>
          ))}
        </div>


          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 rounded-2xl shadow-inner bg-white">
  {/* Cột trái: Danh sách món ăn */}
  <div className="h-[500px] overflow-y-auto pr-2 custom-scroll">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
    {foods.map((food) => (
      <div
        key={food.foodId}
        className="bg-white rounded-2xl border border-orange-300 shadow-md p-4 transition-transform transform hover:scale-[1.02] hover:shadow-lg flex flex-col justify-between"
      >
        <img
          src={food.imageUrl}
          alt={food.foodName}
          className="w-full h-40 object-cover rounded-xl mb-4 border border-orange-200"
        />
        <div className="flex flex-col flex-grow">
          <h3 className="text-xl font-semibold text-orange-700 mb-1 line-clamp-1">
            {food.foodName}
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            {food.price.toLocaleString()} <span className="text-xs">VND</span>
          </p>
          <button
            className="mt-auto bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2 rounded-xl hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50 transition font-medium"
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
  <div className="bg-white rounded-2xl p-6 shadow-md border border-orange-200">
  <h3 className="text-2xl font-bold mb-4 text-orange-700 border-b border-orange-300 pb-2 flex items-center gap-2">
    🧾 <span>Chi tiết đơn hàng</span>
  </h3>

  {orderDetails.length === 0 ? (
    <p className="text-gray-500 italic">Chưa chọn món nào.</p>
  ) : (
    <ul className="space-y-4 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-orange-400 scrollbar-track-orange-100">
      {orderDetails.map((d) => (
        <li
          key={d.foodId}
          className="flex items-center bg-orange-50 p-4 border border-orange-200 rounded-xl shadow-sm hover:shadow-md transition"
        >
          <img
            src={d.imageUrl}
            alt={d.foodName}
            className="w-20 h-20 object-cover rounded-lg mr-4 border border-orange-200"
          />
          <div className="flex-1">
            <div className="font-semibold text-gray-800 text-base line-clamp-1">{d.foodName}</div>
            <div className="text-sm text-gray-600">
              {d.price.toLocaleString()} <span className="text-xs">VND</span>
            </div>
          </div>
          <input
            type="number"
            value={d.quantity}
            min="1"
            className="w-20 border border-gray-300 rounded-lg px-3 py-2 mr-3 text-center focus:outline-none focus:ring-2 focus:ring-orange-400 transition text-gray-800"
            onChange={(e) =>
              handleQuantityChange(d.foodId, parseInt(e.target.value))
            }
          />
          <button
            onClick={() => handleRemoveFood(d.foodId)}
            className="text-orange-600 hover:text-orange-800 font-medium transition"
            aria-label={`Xoá ${d.foodName} khỏi đơn hàng`}
          >
            ✖
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
      ◀ Quay lại
    </button>
    <button
      onClick={handleSubmitOrder}
      className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 active:scale-95 transition focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 font-semibold"
    >
      ✅ Tạo đơn hàng
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