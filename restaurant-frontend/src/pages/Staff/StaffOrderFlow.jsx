import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StaffOrderFlow = () => {
  const navigate = useNavigate(); // ✅ Di chuyển vào bên trong component này
  const [step, setStep] = useState(1);
  const [tables, setTables] = useState([]);
  const [foods, setFoods] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [note, setNote] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [orderDetails, setOrderDetails] = useState([]);

  const fetchTables = async () => {
    try {
    const res = await axios.get("http://localhost:8080/api/tables/with-status");
      setTables(res.data);
    } catch (err) {
      console.error("Lỗi API bàn:", err);
      alert("Không thể tải danh sách bàn.");
    }
  };

  const fetchFoods = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/food");
      setFoods(res.data);
    } catch (err) {
      console.error("Lỗi API food:", err);
      alert("Không thể tải danh sách món.");
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  useEffect(() => {
    if (step === 2) {
      fetchFoods();
    }
  }, [step]);

  const handleAddFood = (food) => {
    const exist = orderDetails.find(d => d.foodId === food.foodId);
    if (exist) {
      setOrderDetails(orderDetails.map(d =>
        d.foodId === food.foodId
          ? { ...d, quantity: d.quantity + 1 }
          : d
      ));
    } else {
      setOrderDetails([...orderDetails, {
        foodId: food.foodId,
        foodName: food.foodName,
        price: food.price,
        imageUrl: food.imageUrl,
        quantity: 1
      }]);
    }
  };

  const handleQuantityChange = (foodId, quantity) => {
    setOrderDetails(orderDetails.map(d =>
      d.foodId === foodId ? { ...d, quantity } : d
    ));
  };

  const handleRemoveFood = (foodId) => {
    setOrderDetails(orderDetails.filter(d => d.foodId !== foodId));
  };

  const handleContinue = () => {
    if (!selectedTable || selectedTable.status !== "Trống") {
      alert("Vui lòng chọn bàn đang trống");
      return;
    }
    if (!customerName.trim()) {
      alert("Vui lòng nhập tên khách hàng");
      return;
    }
    if (numberOfGuests < 1) {
      alert("Số khách phải >= 1");
      return;
    }
    setStep(2);
  };

  const handleSubmitOrder = async () => {
  if (orderDetails.length === 0) {
    alert("Vui lòng chọn ít nhất 1 món");
    return;
  }
const rawUserId = localStorage.getItem("userId");

if (!rawUserId || isNaN(parseInt(rawUserId))) {
  alert("Lỗi: Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
  return;
}
  const data = {
    tableId: selectedTable.tableId,
    createdById: parseInt(localStorage.getItem("userId")),
    orderDetails: orderDetails.map(d => ({
      foodId: d.foodId,
      quantity: d.quantity,
      price: d.price
    }))
  };

  console.log("DATA GỬI:", data); 

  try {
    await axios.post("http://localhost:8080/api/orders", data);
    alert("Tạo đơn hàng thành công");
    navigate("/chef/kitchen");
  } catch (err) {
    console.error("Lỗi tạo đơn hàng:", err);
    alert("Lỗi: " + (err.response?.data || "Không rõ lỗi"));
  }
};


  const getStatusColor = (status) => {
    if (!status) return 'text-gray-500';
    const s = status.toLowerCase();
    if (s === 'trống') return 'text-green-600';
    if (s === 'đang phục vụ') return 'text-yellow-600';
    if (s === 'đã đặt') return 'text-red-600';
    return 'text-gray-500';
  };

  return (
    <div className="space-y-8">
      {step === 1 && (
        <>
          <h2 className="text-xl font-bold">Chọn bàn</h2>
          <div className="flex flex-wrap gap-3">
            {tables.map(table => (
              <button
                key={table.tableId}
                onClick={() => setSelectedTable(table)}
                disabled={table.status !== "Trống"}
                className={`border rounded p-2 w-32 h-20 flex flex-col items-center justify-center ${
                  selectedTable?.tableId === table.tableId ? 'bg-blue-100' : 'bg-white'
                } ${table.status !== "Trống" ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="font-medium">{table.tableName}</div>
                <div className={`text-sm ${getStatusColor(table.status)}`}>{table.status}</div>
              </button>
            ))}
          </div>

          <div className="mt-4">
            <label className="block">Tên khách hàng *</label>
            <input
              type="text"
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
              className="border rounded p-2 w-full"
            />
          </div>

          <div>
            <label className="block mt-4">Số khách</label>
            <input
              type="number"
              min="1"
              value={numberOfGuests}
              onChange={e => setNumberOfGuests(parseInt(e.target.value))}
              className="border rounded p-2"
            />
          </div>

          <div>
            <label className="block mt-4">Ghi chú</label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              className="border rounded p-2 w-full"
            />
          </div>

          <button
            onClick={handleContinue}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          >
            Tiếp tục
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <h2 className="text-xl font-bold">Chọn món ăn</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {foods.map(food => (
              <div key={food.foodId} className="border rounded p-2">
                {food.imageUrl && <img src={food.imageUrl} alt={food.foodName} className="w-full h-32 object-cover rounded" />}
                <div className="font-medium mt-2">{food.foodName}</div>
                <div>Giá: {food.price.toLocaleString()} VND</div>
                <button
                  className="mt-2 bg-green-500 text-white rounded px-2 py-1"
                  onClick={() => handleAddFood(food)}
                >
                  Thêm
                </button>
              </div>
            ))}
          </div>

          <h3 className="text-lg font-semibold mt-4">Chi tiết đơn hàng</h3>
          {orderDetails.length === 0 ? (
            <div>Chưa chọn món nào</div>
          ) : (
            <ul className="space-y-2">
              {orderDetails.map(d => (
                <li key={d.foodId} className="flex items-center justify-between border p-2 rounded">
                  <div className="flex-1">
                    {d.foodName} - Giá: {d.price.toLocaleString()} VND
                  </div>
                  <input
                    type="number"
                    value={d.quantity}
                    min="1"
                    className="w-16 border rounded px-2"
                    onChange={e => handleQuantityChange(d.foodId, parseInt(e.target.value))}
                  />
                  <button
                    onClick={() => handleRemoveFood(d.foodId)}
                    className="ml-2 bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Xoá
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-4 font-bold">
            Tạm tính: {orderDetails.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString()} VND
          </div>

          <button
            onClick={handleSubmitOrder}
            className="bg-green-600 text-white px-4 py-2 rounded mt-4"
          >
            Tạo đơn hàng
          </button>
        </>
      )}
    </div>
  );
};

export default StaffOrderFlow;
