import React, { useEffect, useState } from "react";
import axios from "axios";

const IngredientManager = () => {
  const [ingredients, setIngredients] = useState([]);
  // Thêm quantityInStock vào form state, khởi tạo bằng 0
  const [form, setForm] = useState({
    ingredientName: "",
    unit: "",
    quantityInStock: 0,
    imageUrl: ""
  });
  const [editId, setEditId] = useState(null);
  const token = localStorage.getItem("token");

  const fetchIngredients = async () => {
    const res = await axios.get("http://localhost:8080/api/manager/ingredients", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setIngredients(res.data);
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const headers = {
      Authorization: `Bearer ${token}`
    };

    // Chuyển quantityInStock từ string sang number (hoặc BigDecimal)
    const payload = {
      ...form,
      quantityInStock: Number(form.quantityInStock)
    };

    if (editId) {
      await axios.put(`http://localhost:8080/api/manager/ingredients/${editId}`, payload, { headers });
    } else {
      await axios.post("http://localhost:8080/api/manager/ingredients", payload, { headers });
    }
    setForm({ ingredientName: "", unit: "", quantityInStock: 0 });
    setEditId(null);
    fetchIngredients();
  };

  const handleEdit = (ingredient) => {
    setForm({
      ingredientName: ingredient.ingredientName,
      unit: ingredient.unit,
      quantityInStock: ingredient.quantityInStock || 0,
      imageUrl: ingredient.imageUrl || ""
    });
    setEditId(ingredient.ingredientId);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:8080/api/manager/ingredients/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchIngredients();
  };

  return (
    <div className="p-8 bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl shadow-xl max-w-6xl mx-auto mt-8">
  <h2 className="text-3xl font-bold text-green-700 mb-6 border-b-2 border-green-300 pb-3 flex items-center gap-2">
    🍽️ Quản lý nguyên liệu
  </h2>

  {/* Form */}
  <form
  onSubmit={handleSubmit}
  className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-white rounded-xl shadow-md mb-8"
>
  {/* Tên nguyên liệu */}
  <div className="flex flex-col">
    <label className="text-sm font-bold text-gray-700 mb-2">Tên nguyên liệu</label>
    <input
      type="text"
      placeholder="Nhập tên..."
      value={form.ingredientName}
      onChange={(e) => setForm({ ...form, ingredientName: e.target.value })}
      className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
      required
    />
  </div>

  {/* Đơn vị */}
  <div className="flex flex-col">
    <label className="text-sm font-bold text-gray-700 mb-2">Đơn vị</label>
    <input
      type="text"
      placeholder="(kg, g, ml...)"
      value={form.unit}
      onChange={(e) => setForm({ ...form, unit: e.target.value })}
      className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
      required
    />
  </div>

  {/* Tồn kho */}
  <div className="flex flex-col">
    <label className="text-sm font-bold text-gray-700 mb-2">Tồn kho</label>
    <input
      type="number"
      step="0.01"
      min="0"
      placeholder="Số lượng"
      value={form.quantityInStock}
      onChange={(e) => setForm({ ...form, quantityInStock: e.target.value })}
      className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
      required
    />
  </div>

  {/* Link hình ảnh */}
  <div className="flex flex-col md:col-span-2">
    <label className="text-sm font-bold text-gray-700 mb-2">Link hình ảnh</label>
    <input
      type="url"
      placeholder="https://example.com/image.png"
      value={form.imageUrl}
      onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
      className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
      required
    />
  </div>

  {/* Nút submit */}
  <div className="flex items-end">
    <button
      type="submit"
      className={`w-full h-[52px] px-4 py-3 rounded-lg font-semibold text-white transition duration-200 shadow-md
        ${editId ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-600 hover:bg-green-700"}`}
    >
      {editId ? "🔄 Cập nhật" : "➕ Thêm"}
    </button>
  </div>
</form>


  {/* Table */}
  <div className="overflow-x-auto rounded-xl shadow-md">
    <table className="min-w-full bg-gradient-to-tr from-white via-green-50 to-blue-50 border border-gray-200 rounded-xl">
      <thead className="bg-green-100 text-green-900 text-md">
        <tr>
          <th className="py-3 px-4 border-b">🆔</th>
          <th className="py-3 px-4 border-b">🖼️ Ảnh</th>
          <th className="py-3 px-4 border-b">📦 Tên nguyên liệu</th>
          <th className="py-3 px-4 border-b">📐 Đơn vị</th>
          <th className="py-3 px-4 border-b">📊 Số lượng</th>
          <th className="py-3 px-4 border-b text-center">⚙️ Hành động</th>
        </tr>
      </thead>
      <tbody>
        {ingredients.length === 0 ? (
          <tr>
            <td colSpan="5" className="text-center py-6 text-gray-500 italic">
              Không có nguyên liệu nào.
            </td>
          </tr>
        ) : (
          ingredients.map((ing) => (
            <tr key={ing.ingredientId} className="hover:bg-green-50 transition">
              <td className="py-3 px-4 border-b text-center font-semibold">{ing.ingredientId}</td>
              <td className="py-3 px-4 border-b">
                <div className="flex justify-center">
                  <img
                    src={ing.imageUrl}
                    alt={ing.ingredientName}
                    className="w-20 h-20 object-cover rounded"
                  />
                </div>
              </td>

              <td className="py-3 px-4 border-b text-center font-bold text-green-500">{ing.ingredientName}</td>
              <td className="py-3 px-4 border-b text-center font-bold">{ing.unit}</td>
              <td className="py-3 px-4 border-b text-center font-bold">{ing.quantityInStock}</td>
              <td className="py-3 px-4 border-b text-center space-x-2">
                <button
                  onClick={() => handleEdit(ing)}
                  className="text-yellow-600 hover:text-yellow-800 font-medium"
                >
                  ✏️ Sửa
                </button>
                <button
                  onClick={() => handleDelete(ing.ingredientId)}
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  🗑️ Xóa
                </button>
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

export default IngredientManager;
