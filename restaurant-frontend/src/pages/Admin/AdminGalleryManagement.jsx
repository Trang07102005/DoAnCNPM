import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AdminGalleryManagement = () => {
  const [images, setImages] = useState([]);
  const [form, setForm] = useState({ imageUrl: "", caption: "" });
  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem("token");

  const fetchImages = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/admin/gallery", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setImages(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Lỗi tải ảnh");
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.imageUrl) {
      toast.warning("Vui lòng nhập URL ảnh!");
      return;
    }

    try {
      if (editId) {
        await axios.put(
          `http://localhost:8080/api/admin/gallery/${editId}`,
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Cập nhật ảnh thành công!");
      } else {
        await axios.post("http://localhost:8080/api/admin/gallery", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Thêm ảnh mới thành công!");
      }

      setForm({ imageUrl: "", caption: "" });
      setEditId(null);
      fetchImages();
    } catch (err) {
      console.log(err);
      toast.error("Lỗi xử lý ảnh!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa ảnh này?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/admin/gallery/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Xóa ảnh thành công!");
      fetchImages();
    } catch (err) {
      console.log(err);
      toast.error("Lỗi khi xóa ảnh!");
    }
  };

  const handleEdit = (img) => {
    setForm({ imageUrl: img.imageUrl, caption: img.caption || "" });
    setEditId(img.id);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <h2 className="text-3xl font-bold text-green-700">📷 Quản lý Thư viện Ảnh</h2>

      {/* Form thêm/sửa ảnh */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-2xl shadow-md border"
      >
        <input
          type="text"
          placeholder="Link ảnh (image URL)"
          value={form.imageUrl}
          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="text"
          placeholder="Chú thích (nếu có)"
          value={form.caption}
          onChange={(e) => setForm({ ...form, caption: e.target.value })}
          className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <div className="flex items-center space-x-4">
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition"
          >
            {editId ? "Cập nhật ảnh" : "Thêm ảnh"}
          </button>
          {editId && (
            <button
              type="button"
              onClick={() => {
                setForm({ imageUrl: "", caption: "" });
                setEditId(null);
              }}
              className="text-gray-500 hover:text-red-600 transition"
            >
              Hủy
            </button>
          )}
        </div>
      </form>

      {/* Danh sách ảnh */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((img) => (
          <div
            key={img.id}
            className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden border"
          >
            <img
              src={img.imageUrl}
              alt={img.caption}
              className="w-full h-52 object-cover rounded-t-2xl"
            />
            <div className="p-4 space-y-2">
              <p className="text-gray-700 text-sm font-medium">
                {img.caption || "Không có chú thích"}
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => handleEdit(img)}
                  className="text-blue-600 hover:underline"
                >
                  ✏️ Sửa
                </button>
                <button
                  onClick={() => handleDelete(img.id)}
                  className="text-red-600 hover:underline"
                >
                  🗑️ Xóa
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminGalleryManagement;
