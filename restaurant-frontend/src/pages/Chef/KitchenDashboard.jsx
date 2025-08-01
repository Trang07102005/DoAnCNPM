import React, { useEffect, useState } from "react";
import axios from "axios";

const KitchenDashboard = () => {
  const [dishes, setDishes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const fetchDishes = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/order-status/pending");
      setDishes(res.data);
    } catch (err) {
      console.error("Lỗi khi tải món cần chế biến:", err);
      alert("Lỗi khi tải món cần chế biến");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:8080/api/order-status/${id}?status=${status}`);
      fetchDishes();
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái:", err);
      alert("Lỗi cập nhật trạng thái");
    }
  };

  useEffect(() => {
    fetchDishes();
    const interval = setInterval(fetchDishes, 10000);
    return () => clearInterval(interval);
  }, []);

  // Phân trang
  const totalPages = Math.ceil(dishes.length / itemsPerPage);
  const displayedDishes = dishes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">🧑‍🍳 Món cần chế biến</h2>

      {dishes.length === 0 ? (
        <p className="text-gray-500 italic">Không có món đang chờ.</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg shadow-lg">
            <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-blue-100 text-blue-800 text-sm font-semibold">
  <tr>
    <th className="py-3 px-4 border">🖼️ Ảnh</th>
    <th className="py-3 px-4 border">🍽️ Món</th>
    <th className="py-3 px-4 border">📦 Đơn</th>
    <th className="py-3 px-4 border">🔄 Trạng thái</th>
    <th className="py-3 px-4 border">⚙️ Cập nhật</th>
  </tr>
</thead>
<tbody>
  {displayedDishes.map((d) => (
    <tr key={d.orderStatusId} className="hover:bg-blue-50 text-sm text-gray-700">
      <td className="py-2 px-4 border text-center">
        <img
          src={d.imageUrl}
          alt={d.foodName}
          className="w-30 h-30 object-cover rounded mx-auto"
        />
      </td>
      <td className="py-2 px-4 border">{d.foodName}</td>
      <td className="py-2 px-4 border font-semibold text-center">#{d.orderId}</td>
      <td
  className={`py-2 px-4 border text-center font-semibold 
    ${
      d.status === "CHỜ CHẾ BIẾN" ? "text-yellow-600" :
      d.status === "ĐANG LÀM" ? "text-blue-600" :
      d.status === "HOÀN TẤT" ? "text-green-600" :
      d.status === "ĐÃ HỦY" ? "text-red-600" :
      "text-gray-700"
    }`}
>
  {d.status}
</td>

      <td className="py-2 px-4 border text-center">
      <select
  value={d.status}
  onChange={(e) => updateStatus(d.orderStatusId, e.target.value)}
  className={`border px-2 py-1 text-sm rounded font-semibold text-white
    ${
      d.status === "Chưa chế biến"
        ? "bg-red-500"
        : d.status === "Đang chế biến"
        ? "bg-yellow-500"
        : "bg-green-600"
    }
  `}
>
  <option value="Chưa chế biến">Chưa chế biến</option>
  <option value="Đang chế biến">Đang chế biến</option>
  <option value="Đã hoàn thành">Đã hoàn thành</option>
</select>

      </td>
    </tr>
  ))}
</tbody>

            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-4 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded-full border ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-white text-blue-600 hover:bg-blue-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default KitchenDashboard;
