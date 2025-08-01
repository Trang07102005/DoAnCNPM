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
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8080/api/food-categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Không thể tải danh sách danh mục.");
    }
  };

  const handleSaveCategory = async () => {
    if (!categoryName.trim()) {
      toast.warn("Tên danh mục không được để trống!");
      return;
    }

    if (!imageUrl.trim()) {
      toast.warn("Vui lòng nhập URL hình ảnh!");
      return;
    }

    const token = localStorage.getItem("token");
    const payload = {
      categoryName: categoryName.trim(),
      imageUrl: imageUrl.trim(),
    };

    try {
      if (isEditing) {
        await axios.put(
          `http://localhost:8080/api/food-categories/${editingCategoryId}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Cập nhật danh mục thành công!");
      } else {
        await axios.post("http://localhost:8080/api/food-categories", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Thêm danh mục thành công!");
      }

      setCategoryName("");
      setImageUrl("");
      setShowModal(false);
      setIsEditing(false);
      setEditingCategoryId(null);
      fetchCategories();
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error("Tên danh mục đã tồn tại.");
      } else if (err.response?.status === 400) {
        toast.error("Dữ liệu gửi đi không hợp lệ.");
      } else {
        toast.error("Đã xảy ra lỗi khi lưu danh mục.");
      }
    }
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8080/api/food-categories/${categoryId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Xóa danh mục thành công!");
      fetchCategories();
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error("Không thể xóa: danh mục đang được sử dụng.");
      } else {
        toast.error("Xóa danh mục thất bại.");
      }
    }
  };

  const handleEdit = (cat) => {
    setCategoryName(cat.categoryName);
    setImageUrl(cat.imageUrl || "");
    setEditingCategoryId(cat.categoryId);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setCategoryName("");
    setImageUrl("");
    setIsEditing(false);
    setEditingCategoryId(null);
    setShowModal(false);
  };

  return (
    
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-r from-green-100 via-blue-100 to-purple-100 rounded-3xl shadow-xl space-y-8">
  {/* Header */}
  <div className="flex justify-between items-center">
    <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">
      📁 Danh Sách Danh Mục
    </h2>
    <button
      onClick={() => setShowModal(true)}
      className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-6 py-2.5 rounded-xl shadow-lg font-semibold transition"
    >
      + Thêm Danh Mục
    </button>
  </div>

  {/* Table */}
  <div className="overflow-x-auto rounded-xl">
    <table className="min-w-full text-md text-gray-800 bg-white rounded-xl shadow-lg overflow-hidden">
      <thead className="uppercase bg-gradient-to-r from-blue-200 to-green-200 text-gray-800 font-bold text-md">
        <tr>
          <th className="px-6 py-4 text-left">STT</th>
          <th className="px-6 py-4 text-left">Tên Danh Mục</th>
          <th className="px-6 py-4 text-left">Hình Ảnh</th>
          <th className="px-6 py-4 text-center">Thao Tác</th>
        </tr>
      </thead>
      <tbody>
        {categories.map((cat, index) => (
          <tr key={cat.categoryId} className="even:bg-green-50 hover:bg-blue-50 transition-all duration-200">
            <td className="px-6 py-4 text-lg font-semibold">{index + 1}</td>
            <td className="px-6 py-4 text-lg font-bold text-gray-900">{cat.categoryName}</td>
            <td className="px-6 py-4">
              {cat.imageUrl ? (
                <img
                  src={cat.imageUrl}
                  alt={cat.categoryName}
                  className="w-24 h-20 object-cover rounded-md border shadow-sm"
                />
              ) : (
                <span className="italic text-gray-400">Không có ảnh</span>
              )}
            </td>
            <td className="px-6 py-4 text-center space-x-2">
              <button
                onClick={() => handleEdit(cat)}
                className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-1.5 rounded-md font-medium shadow-md"
              >
                ✏️ Sửa
              </button>
              <button
                onClick={() => handleDelete(cat.categoryId)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-md font-medium shadow-md"
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
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white p-6 rounded-2xl w-full max-w-md space-y-4 shadow-xl border-[5px] border-green-200"
        >
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-2">
            {isEditing ? "✏️ Sửa Danh Mục" : "➕ Thêm Danh Mục Mới"}
          </h3>

          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Nhập tên danh mục"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-md focus:ring-2 focus:ring-green-400 outline-none"
          />

          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Nhập URL hình ảnh"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-md focus:ring-2 focus:ring-green-400 outline-none"
          />

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={handleCloseModal}
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-medium transition"
            >
              Hủy
            </button>
            <button
              onClick={handleSaveCategory}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition"
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

export default CategoryManagement;
