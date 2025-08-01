import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const TableManager = () => {
  const [tables, setTables] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ tableName: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { fetchTables(); }, []);

  const fetchTables = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8080/api/tables", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTables(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải danh sách bàn.");
    }
  };

  const handleSubmit = async () => {
    if (!form.tableName.trim()) {
      toast.warn("Tên bàn không được để trống");
      return;
    }
    const token = localStorage.getItem("token");
    try {
      if (isEditing) {
        await axios.put(`http://localhost:8080/api/tables/${editingId}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Cập nhật bàn thành công");
      } else {
        await axios.post(`http://localhost:8080/api/tables`, { ...form, status: "Trống" }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Tạo bàn thành công");
      }
      fetchTables();
      closeModal();
    } catch (err) {
      console.error(err);
      if (err.response?.status === 409) {
        toast.error("Tên bàn đã tồn tại");
      } else {
        toast.error("Lỗi: " + (err.response?.data || "Không rõ lỗi"));
      }
    }
  };

  const handleEdit = (t) => {
    setForm({ tableName: t.tableName });
    setIsEditing(true);
    setEditingId(t.tableId);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xác nhận xóa bàn này?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8080/api/tables/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Xóa bàn thành công");
      fetchTables();
    } catch (err) {
      console.error(err);
      if (err.response?.status === 409) {
        toast.error("Không thể xóa: Bàn đã có lịch đặt");
      } else {
        toast.error("Xóa bàn thất bại");
      }
    }
  };

  const closeModal = () => {
    setForm({ tableName: "" });
    setIsEditing(false);
    setEditingId(null);
    setShowModal(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 rounded-3xl shadow-2xl space-y-6">
  <div className="flex justify-between items-center">
    <h2 className="text-4xl font-extrabold text-gray-800 tracking-tight">🍽️ Danh Sách Bàn</h2>
    <button
      onClick={() => setShowModal(true)}
      className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-6 py-2.5 rounded-xl shadow-lg transition font-semibold"
    >
      + Thêm Bàn
    </button>
  </div>

  <div className="overflow-x-auto rounded-xl">
    <table className="min-w-full divide-y divide-gray-300">
      <thead className="bg-gradient-to-r from-blue-300 to-green-300 text-gray-900 text-lg font-bold uppercase">
        <tr>
          <th className="px-6 py-3 text-left">STT</th>
          <th className="px-6 py-3 text-left">Tên Bàn</th>
          <th className="px-6 py-3 text-center">Thao Tác</th>
        </tr>
      </thead>
      <tbody className="bg-white">
        {tables.map((t, idx) => (
          <tr key={t.tableId} className="even:bg-green-50 hover:bg-blue-50 transition-all duration-200">
            <td className="px-6 py-4 text-lg font-bold text-gray-700">{idx + 1}</td>
            <td className="px-6 py-4 text-lg font-medium text-gray-900">☕ {t.tableName}</td>
            <td className="px-6 py-4 text-center space-x-3">
              <button
                onClick={() => handleEdit(t)}
                className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-1.5 rounded-md font-medium shadow-sm transition"
              >
                ✏️ Sửa
              </button>
              <button
                onClick={() => handleDelete(t.tableId)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-md font-medium shadow-sm transition"
              >
                🗑️ Xóa
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* Modal */}
  <AnimatePresence>
    {showModal && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white p-6 rounded-2xl w-full max-w-md shadow-xl border-[5px] border-green-200"
        >
          <h3 className="text-2xl font-bold mb-5 text-gray-800 text-center">
            {isEditing ? "✏️ Sửa Bàn" : "➕ Thêm Bàn Mới"}
          </h3>

          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-6 focus:ring-2 focus:ring-green-500 outline-none text-lg"
            placeholder="Nhập tên bàn..."
            value={form.tableName}
            name="tableName"
            onChange={(e) => setForm({ ...form, tableName: e.target.value })}
          />

          <div className="flex justify-end gap-3">
            <button
              onClick={closeModal}
              className="px-4 py-2 rounded-md bg-gray-400 hover:bg-gray-500 text-white transition font-medium"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 rounded-md bg-gradient-to-r from-green-400 to-blue-400 hover:from-green-500 hover:to-blue-500 text-white font-semibold transition"
            >
              {isEditing ? "Cập Nhật" : "Tạo"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
</div>


  );
};

export default TableManager;
