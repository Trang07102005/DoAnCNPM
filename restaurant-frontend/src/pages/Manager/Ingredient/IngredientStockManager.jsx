import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const IngredientStockManager = () => {
  const [ingredients, setIngredients] = useState([]);
  const token = localStorage.getItem("token");

  // Hàm lấy danh sách nguyên liệu
  const fetchIngredients = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/manager/ingredients", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIngredients(res.data);
    } catch (error) {
      console.error("Lỗi tải danh sách nguyên liệu:", error);
      toast.error("Lỗi tải danh sách nguyên liệu");
    }
  };

  // Tải dữ liệu lần đầu khi component mount
  useEffect(() => {
    fetchIngredients();
  }, []);

  return (
    <div className="p-6 bg-gradient-to-r from-green-200 to-blue-200 rounded-2xl shadow-lg max-w-6xl mx-auto mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3 flex items-center gap-2">
        📦 Quản lý tồn kho nguyên liệu
      </h2>

      <button
        onClick={fetchIngredients}
        className="mb-4 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition duration-200"
      >
        🔄 Tải lại
      </button>

      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-xl">
          <thead className="bg-blue-100 text-blue-900 text-md">
            <tr>
              <th className="py-3 px-4 border-b text-center">🆔 ID</th>
              <th className="py-3 px-4 border-b text-center">📷 Ảnh</th>
              <th className="py-3 px-4 border-b text-left">🏷️ Tên nguyên liệu</th>
              <th className="py-3 px-4 border-b text-center">📏 Đơn vị</th>
              <th className="py-3 px-4 border-b text-center">📦 Tồn kho</th>
            </tr>
          </thead>
          <tbody>
            {ingredients.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500 italic">
                  Chưa có nguyên liệu nào.
                </td>
              </tr>
            ) : (
              ingredients.map((ing, index) => (
                <tr
                  key={ing.ingredientId}
                  className={`transition duration-150 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-green-50`}
                >
                  <td className="py-3 px-4 border-b text-center font-medium text-gray-700">
                    {ing.ingredientId}
                  </td>
                  <td className="py-3 px-4 border-b text-center">
                    <img
                      src={ing.imageUrl}
                      alt={ing.ingredientName}
                      className="w-20 h-20 object-cover rounded mx-auto"
                    />
                  </td>
                  <td className="py-3 px-4 border-b text-gray-800">{ing.ingredientName}</td>
                  <td className="py-3 px-4 border-b text-center text-gray-700">{ing.unit}</td>
                  <td className="py-3 px-4 border-b text-center text-green-600 font-semibold">
                    {ing.quantityInStock ?? 0}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IngredientStockManager;
