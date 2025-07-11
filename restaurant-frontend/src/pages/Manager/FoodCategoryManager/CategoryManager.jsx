import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8080/api/food-categories", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải danh sách danh mục.");
    }
  };

  const handleSaveCategory = async () => {
    if (!categoryName.trim()) {
      toast.warn("Tên danh mục không được để trống!");
      return;
    }
    const token = localStorage.getItem("token");
    try {
      if (isEditing) {
        await axios.put(
          `http://localhost:8080/api/food-categories/${editingCategoryId}`,
          { categoryName: categoryName.trim() },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Cập nhật danh mục thành công!");
      } else {
        await axios.post(
          "http://localhost:8080/api/food-categories",
          { categoryName: categoryName.trim() },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Thêm danh mục thành công!");
      }

      setCategoryName("");
      setShowModal(false);
      setIsEditing(false);
      setEditingCategoryId(null);
      fetchCategories();
    } catch (err) {
      console.error("Lỗi khi lưu danh mục:", err);
      if (err.response) {
        if (err.response.status === 409) {
          toast.error("Tên danh mục đã tồn tại.");
        } else if (err.response.status === 400) {
          toast.error("Dữ liệu gửi đi không hợp lệ.");
        } else if (err.response.status === 401) {
          toast.error("Token không hợp lệ hoặc hết hạn.");
        } else {
          toast.error("Lỗi server: " + (err.response.data || "Không rõ lỗi"));
        }
      } else {
        toast.error("Không kết nối được tới server.");
      }
    }
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8080/api/food-categories/${categoryId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Xóa danh mục thành công!");
      fetchCategories();
    } catch (err) {
      console.error(err);
      if (err.response?.status === 409) {
        toast.error("Không thể xóa: danh mục đang được sử dụng.");
      } else {
        toast.error("Xóa danh mục thất bại.");
      }
    }
  };

  const handleEdit = (cat) => {
    setCategoryName(cat.categoryName);
    setEditingCategoryId(cat.categoryId);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setCategoryName("");
    setIsEditing(false);
    setEditingCategoryId(null);
    setShowModal(false);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow-sm"
        >
          Thêm Danh Mục
        </button>
      </div>

      <h2 className="text-3xl font-semibold text-gray-800 border-b pb-3">Danh Sách Danh Mục</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-md shadow-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-5 text-left">STT</th>
              <th className="py-3 px-5 text-left">Tên danh mục</th>
              <th className="py-3 px-5 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, index) => (
              <tr key={cat.categoryId} className="even:bg-gray-50 hover:bg-gray-100">
                <td className="py-3 px-5">{index + 1}</td>
                <td className="py-3 px-5">{cat.categoryName}</td>
                <td className="py-3 px-5 text-center space-x-2">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(cat.categoryId)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white p-6 rounded-md shadow-md w-full max-w-md"
            >
              <h3 className="text-xl font-semibold mb-4">
                {isEditing ? "Sửa Danh Mục" : "Thêm Danh Mục Mới"}
              </h3>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Tên danh mục"
                className="w-full border rounded-md px-4 py-2 mb-4"
              />
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleCloseModal}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md"
                >
                  Đóng
                </button>
                <button
                  onClick={handleSaveCategory}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
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

export default CategoryManagement;
