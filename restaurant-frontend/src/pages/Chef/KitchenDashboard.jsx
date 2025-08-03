import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const KitchenDashboard = () => {
  const [dishes, setDishes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const [selectedRecipe, setSelectedRecipe] = useState(null); // Trạng thái để lưu công thức
  const itemsPerPage = 10;

  const token = localStorage.getItem("token"); // Lấy token từ localStorage
  const headers = { Authorization: `Bearer ${token}` }; // Thêm header cho mọi yêu cầu

  const fetchDishes = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/order-status/pending", { headers });
      setDishes(res.data);
    } catch (err) {
      console.error("Lỗi khi tải món cần chế biến:", err);
      toast.error("Lỗi khi tải món cần chế biến: " + (err.response?.data?.message || err.message));
    }
  };

  const fetchRecipe = async (foodId) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/manager/recipes/by-food/${foodId}`, { headers });
      setSelectedRecipe(res.data);
    } catch (err) {
      console.error("Lỗi khi tải công thức - URL:", err.config.url, err);
      toast.error("Lỗi khi tải công thức: " + (err.response?.data?.message || err.message));
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const response = await axios.put(`http://localhost:8080/api/order-status/${id}?status=${status}`, null, { headers });
      fetchDishes();
      toast.success(response.data || "Cập nhật trạng thái thành công");
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái:", err);
      toast.error("Lỗi cập nhật trạng thái: " + (err.response?.data?.message || err.message));
    }
  };

  useEffect(() => {
    fetchDishes();
    const interval = setInterval(fetchDishes, 10000);
    return () => clearInterval(interval);
  }, []);

  // Lọc món ăn theo trạng thái
  const filteredDishes = statusFilter === "Tất cả"
    ? dishes
    : dishes.filter((d) => d.status === statusFilter);

  // Phân trang
  const totalPages = Math.ceil(filteredDishes.length / itemsPerPage);
  const displayedDishes = filteredDishes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">🧑‍🍳 Món cần chế biến</h2>

      {/* Thanh lọc trạng thái */}
      <div className="mb-4">
        <label className="mr-2 font-semibold text-blue-700">Lọc theo trạng thái:</label>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-blue-300 rounded px-4 py-2 text-sm"
        >
          <option value="Tất cả">Tất cả</option>
          <option value="Chưa chế biến">Chưa chế biến</option>
          <option value="Đang chế biến">Đang chế biến</option>
          <option value="Đã hoàn thành">Đã hoàn thành</option>
          <option value="Đã hủy">Đã hủy</option>
        </select>
      </div>

      {filteredDishes.length === 0 ? (
        <p className="text-gray-500 italic">Không có món phù hợp với bộ lọc.</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg shadow-lg">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-blue-100 text-blue-800 text-sm font-semibold">
                <tr>
                  <th className="py-3 px-4 border">🖼️ Ảnh</th>
                  <th className="py-3 px-4 border">🍽️ Món</th>
                  <th className="py-3 px-4 border">📦 Đơn</th>
                  <th className="py-3 px-4 border">🪑 Bàn</th>
                  <th className="py-3 px-4 border">🔄 Trạng thái</th>
                  <th className="py-3 px-4 border">⚙️ Cập nhật</th>
                  <th className="py-3 px-4 border">📝 Công thức</th>
                </tr>
              </thead>
              <tbody>
                {displayedDishes.map((d) => (
                  <tr key={d.orderStatusId} className="hover:bg-blue-50 text-sm text-gray-700">
                    <td className="py-2 px-4 border text-center">
                      <img
                        src={d.imageUrl}
                        alt={d.foodName}
                        className="w-10 h-10 object-cover rounded mx-auto"
                      />
                    </td>
                    <td className="py-2 px-4 border">{d.foodName}</td>
                    <td className="py-2 px-4 border font-semibold text-center">#{d.orderId}</td>
                    <td className="py-2 px-4 border text-center">{d.tableName}</td>
                    <td
                      className={`py-2 px-4 border text-center font-semibold ${
                        d.status === "Chưa chế biến" ? "text-yellow-600" :
                        d.status === "Đang chế biến" ? "text-blue-600" :
                        d.status === "Đã hoàn thành" ? "text-green-600" :
                        d.status === "Đã hủy" ? "text-red-600" :
                        "text-gray-700"
                      }`}
                    >
                      {d.status}
                    </td>
                    <td className="py-2 px-4 border text-center">
                      {(d.status === "Chưa chế biến" || d.status === "Đang chế biến") ? (
                        <select
                          value={d.status}
                          onChange={(e) => updateStatus(d.orderStatusId, e.target.value)}
                          className={`border px-2 py-1 text-sm rounded font-semibold text-white ${
                            d.status === "Chưa chế biến"
                              ? "bg-red-500"
                              : d.status === "Đang chế biến"
                              ? "bg-yellow-500"
                              : "bg-green-600"
                          }`}
                        >
                          {d.status === "Chưa chế biến" && (
                            <>
                              <option value="Chưa chế biến">Chưa chế biến</option>
                              <option value="Đang chế biến">Đang chế biến</option>
                              <option value="Đã hoàn thành">Đã hoàn thành</option>
                            </>
                          )}
                          {d.status === "Đang chế biến" && (
                            <>
                              <option value="Đang chế biến">Đang chế biến</option>
                              <option value="Đã hoàn thành">Đã hoàn thành</option>
                            </>
                          )}
                        </select>
                      ) : (
                        <span className={`text-white px-2 py-1 rounded font-semibold ${
                          d.status === "Đã hoàn thành" ? "bg-green-600" : "bg-red-600"
                        }`}>
                          {d.status}
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-4 border text-center">
                      <button
                        onClick={() => fetchRecipe(d.foodId)}
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                      >
                        Xem công thức
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modal hiển thị công thức với nền mờ */}
          {selectedRecipe && (
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
                <h3 className="text-xl font-bold mb-4 text-green-700">📝 Công thức: {selectedRecipe.food?.foodName}</h3>
                <p className="mb-4 text-gray-700"><strong>Mô tả:</strong> {selectedRecipe.description || "Chưa có mô tả"}</p>
                <h4 className="font-semibold mb-2 text-gray-900">Nguyên liệu:</h4>
                <ul className="list-disc pl-5 space-y-2 max-h-60 overflow-y-auto pr-2 text-gray-800">
                  {selectedRecipe.recipeDetails?.length > 0 ? (
                    selectedRecipe.recipeDetails.map((detail, index) => (
                      <li key={index} className="hover:text-green-600 transition">
                        {detail.ingredient?.ingredientName}: {detail.quantity} {detail.ingredient?.unit}
                      </li>
                    ))
                  ) : (
                    <li className="italic text-gray-500">Chưa có nguyên liệu.</li>
                  )}
                </ul>
                <button
                  onClick={() => setSelectedRecipe(null)}
                  className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                >
                  Đóng
                </button>
              </div>
            </div>
          )}

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