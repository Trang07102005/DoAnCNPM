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
    <div className="max-w-5xl mx-auto p-6 bg-white rounded shadow space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Thêm Bàn
        </button>
      </div>

      <h2 className="text-3xl font-semibold border-b pb-2">Danh Sách Bàn</h2>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">STT</th>
            <th className="p-2 text-left">Tên bàn</th>
            <th className="p-2 text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {tables.map((t, idx) => (
            <tr key={t.tableId} className="even:bg-gray-50">
              <td className="p-2">{idx + 1}</td>
              <td className="p-2">{t.tableName}</td>
              <td className="p-2 text-center space-x-2">
                <button
                  onClick={() => handleEdit(t)}
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(t.tableId)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 flex justify-center items-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-4 rounded shadow w-full max-w-md"
            >
              <h3 className="text-xl font-semibold mb-3">
                {isEditing ? "Sửa Bàn" : "Thêm Bàn"}
              </h3>
              <input
                type="text"
                className="w-full border p-2 mb-3"
                placeholder="Tên bàn"
                value={form.tableName}
                name="tableName"
                onChange={(e) => setForm({ ...form, tableName: e.target.value })}
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={closeModal}
                  className="bg-gray-400 text-white px-3 py-1 rounded"
                >
                  Đóng
                </button>
                <button
                  onClick={handleSubmit}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  {isEditing ? "Cập nhật" : "Tạo"}
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
