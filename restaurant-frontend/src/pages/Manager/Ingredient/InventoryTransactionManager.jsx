import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const InventoryTransactionManager = () => {
  const [transactions, setTransactions] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [form, setForm] = useState({
    ingredientId: "",
    quantity: "",
    transactionType: "Nhập kho", // hiển thị trên UI
    note: "",
    quantityInStock: 0,
  });

  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const fetchTransactions = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/manager/inventory/all", { headers });
      setTransactions(res.data);
    } catch (error) {
      toast.error("Lỗi tải danh sách giao dịch");
      console.error(error);
    }
  };

  const fetchIngredients = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/manager/ingredients", { headers });
      setIngredients(res.data);
    } catch (error) {
      toast.error("Lỗi tải danh sách nguyên liệu");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchIngredients();
  }, []);

  const transactionTypeMap = {
    "Nhập kho": "NHAP",
    "Xuất kho": "XUAT",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.ingredientId || !form.quantity) {
      toast.warn("Vui lòng chọn nguyên liệu và nhập số lượng");
      return;
    }
    const data = {
      ingredientId: parseInt(form.ingredientId),
      quantity: parseFloat(form.quantity),
      transactionType: transactionTypeMap[form.transactionType], // gửi đúng kiểu backend
      note: form.note,
    };

    try {
      await axios.post("http://localhost:8080/api/manager/inventory", data, { headers });
      toast.success("Tạo giao dịch thành công!");
      setForm({ ingredientId: "", quantity: "", transactionType: "Nhập kho", note: "", quantityInStock: 0 });
      await fetchTransactions(); // cập nhật danh sách giao dịch
      await fetchIngredients();  // cập nhật tồn kho mới
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi tạo giao dịch: " + (error.response?.data || error.message));
    }
  };

  const handleIngredientChange = (e) => {
    const selectedId = e.target.value;
    const selectedIngredient = ingredients.find(
      (i) => i.ingredientId.toString() === selectedId
    );
    setForm({
      ...form,
      ingredientId: selectedId,
      quantityInStock: selectedIngredient?.quantityInStock ?? 0,
    });
  };

  return (
    <div className="p-8 bg-gradient-to-br from-white via-green-50 to-blue-50 rounded-2xl shadow-xl max-w-6xl mx-auto mt-8">
      <h2 className="text-3xl font-bold text-green-700 mb-6 border-b-2 border-green-300 pb-3 uppercase flex items-center gap-2">
        ✉️ Quản lý giao dịch xuất/nhập kho
      </h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 items-end">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Nguyên liệu</label>
          <select
            value={form.ingredientId}
            onChange={handleIngredientChange}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          >
            <option value="">-- Chọn nguyên liệu --</option>
            {ingredients.map((i) => (
              <option key={i.ingredientId} value={i.ingredientId}>
                {i.ingredientName}
              </option>
            ))}
          </select>
          <small className="text-xs text-gray-500 mt-1">Tồn kho hiện tại: {form.quantityInStock}</small>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            {form.transactionType === "Nhập kho" ? "Số lượng nhập kho" : "Số lượng xuất kho"}
          </label>
          <input
            type="number"
            min="0"
            placeholder="Nhập số lượng"
            value={form.quantity ?? ""}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Loại giao dịch</label>
          <select
            value={form.transactionType}
            onChange={(e) => setForm({ ...form, transactionType: e.target.value })}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="Nhập kho">📥 Nhập kho</option>
            <option value="Xuất kho">📤 Xuất kho</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
          <input
            type="text"
            placeholder="(Tùy chọn)"
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <div className="md:col-span-4">
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition duration-200 shadow-md"
          >
            💾 Lưu giao dịch
          </button>
        </div>
      </form>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl shadow-md">
        <table className="min-w-full bg-white border border-gray-200 rounded-xl overflow-hidden">
          <thead className="bg-green-100 text-green-900 text-md">
            <tr>
              <th className="border p-3 text-left">🆔 ID</th>
              <th className="border p-3 text-left">📦 Nguyên liệu</th>
              <th className="border p-3 text-center">📊 Số lượng</th>
              <th className="border p-3 text-center">🔄 Giao dịch</th>
              <th className="border p-3 text-center">⏰ Thời gian</th>
              <th className="border p-3 text-left">📝 Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-5 text-gray-500 italic">
                  Không có giao dịch nào
                </td>
              </tr>
            ) : (
              transactions.map((t) => (
                <tr
                  key={t.transactionId}
                  className={`transition-all ${
                    t.transactionType === "NHAP"
                      ? "bg-green-50 hover:bg-green-100"
                      : "bg-red-50 hover:bg-red-100"
                  }`}
                >
                  <td className="border p-3">{t.transactionId}</td>
                  <td className="border p-3">{t.ingredientName}</td>
                  <td className="border p-3 text-center">{t.quantity}</td>
                  <td
                    className={`border p-3 text-center font-medium ${
                      t.transactionType === "NHAP" ? "text-green-700" : "text-red-600"
                    }`}
                  >
                    {t.transactionType === "NHAP" ? "📥 Nhập kho" : "📤 Xuất kho"}
                  </td>
                  <td className="border p-3 text-center">
                    {new Date(t.transactionDate).toLocaleString("vi-VN")}
                  </td>
                  <td className="border p-3">{t.note}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryTransactionManager;
