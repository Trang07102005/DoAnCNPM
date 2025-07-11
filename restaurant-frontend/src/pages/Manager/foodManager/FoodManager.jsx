import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const FoodManager = () => {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingFoodId, setEditingFoodId] = useState(null);
  const [formFood, setFormFood] = useState({
    foodName: "",
    price: "",
    imageUrl: "",
    status: "",
    categoryId: ""
  });

  useEffect(() => {
    fetchFoods();
    fetchCategories();
  }, []);

  const fetchFoods = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8080/api/food", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFoods(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Lấy danh sách món ăn thất bại.");
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8080/api/food-categories", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Lấy danh sách danh mục thất bại.");
    }
  };

  const handleInputChange = (e) => {
    setFormFood({ ...formFood, [e.target.name]: e.target.value });
  };

  const handleSubmitFood = async () => {
    if (!formFood.foodName || !formFood.price || !formFood.status || !formFood.categoryId) {
      toast.warn("Vui lòng nhập đầy đủ thông tin món ăn!");
      return;
    }
    if (parseFloat(formFood.price) < 10000) {
      toast.warn("Giá món ăn phải >= 10,000");
      return;
    }
    const token = localStorage.getItem("token");
    const data = {
      foodName: formFood.foodName.trim(),
      price: parseFloat(formFood.price),
      imageUrl: formFood.imageUrl,
      status: formFood.status,
      categoryId: parseInt(formFood.categoryId)
    };

    try {
      if (isEditing) {
        await axios.put(`http://localhost:8080/api/food/${editingFoodId}`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Cập nhật món ăn thành công!");
      } else {
        await axios.post("http://localhost:8080/api/food", data, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Thêm món ăn thành công!");
      }

      resetForm();
      fetchFoods();
    } catch (err) {
      console.error(err);
      if (err.response) {
        if (err.response.status === 409) {
          toast.error("Tên món ăn đã tồn tại.");
        } else if (err.response.status === 400) {
          toast.error("Dữ liệu không hợp lệ.");
        } else {
          toast.error("Lỗi: " + (err.response.data || "Không rõ lỗi"));
        }
      } else {
        toast.error("Không kết nối được tới server.");
      }
    }
  };

  const handleEdit = (food) => {
    setFormFood({
      foodName: food.foodName,
      price: food.price,
      imageUrl: food.imageUrl || "",
      status: food.status,
      categoryId: food.category?.categoryId || ""
    });
    setEditingFoodId(food.foodId);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (foodId) => {
    if (!window.confirm("Bạn có chắc muốn xóa món ăn này?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8080/api/food/${foodId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Xóa món ăn thành công!");
      fetchFoods();
    } catch (err) {
      console.error(err);
      toast.error("Xóa món ăn thất bại.");
    }
  };

  const resetForm = () => {
    setFormFood({
      foodName: "",
      price: "",
      imageUrl: "",
      status: "",
      categoryId: ""
    });
    setIsEditing(false);
    setEditingFoodId(null);
    setShowModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10 bg-white rounded-lg shadow-md">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow-sm"
        >
          Thêm Món Ăn
        </button>
      </div>

      <h2 className="text-3xl font-semibold text-gray-800 border-b pb-4">Danh Sách Món Ăn</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-md shadow-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-5 text-left">STT</th>
              <th className="py-3 px-5 text-left">Tên món</th>
              <th className="py-3 px-5 text-left">Giá</th>
              <th className="py-3 px-5 text-left">Danh mục</th>
              <th className="py-3 px-5 text-left">Trạng thái</th>
              <th className="py-3 px-5 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {foods.map((f, index) => (
              <tr key={f.foodId} className="even:bg-gray-50 hover:bg-gray-100">
                <td className="py-3 px-5">{index + 1}</td>
                <td className="py-3 px-5">{f.foodName}</td>
                <td className="py-3 px-5">{Number(f.price).toLocaleString()} đ</td>
                <td className="py-3 px-5">{f.category?.categoryName}</td>
                <td className="py-3 px-5">{f.status}</td>
                <td className="py-3 px-5 text-center space-x-3">
                  <button
                    onClick={() => handleEdit(f)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(f.foodId)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-md"
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-md shadow-lg w-full max-w-xl mx-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <h3 className="text-2xl font-semibold mb-6 border-b pb-3">
                {isEditing ? "Sửa Món Ăn" : "Thêm Món Ăn Mới"}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <input
                  type="text"
                  name="foodName"
                  value={formFood.foodName}
                  onChange={handleInputChange}
                  placeholder="Tên món ăn"
                  className="border rounded-md px-4 py-2"
                />
                <input
                  type="number"
                  name="price"
                  min="10000"
                  value={formFood.price}
                  onChange={handleInputChange}
                  placeholder="Giá"
                  className="border rounded-md px-4 py-2"
                />
                <input
                  type="text"
                  name="imageUrl"
                  value={formFood.imageUrl}
                  onChange={handleInputChange}
                  placeholder="Image URL"
                  className="border rounded-md px-4 py-2"
                />
                <select
                  name="status"
                  value={formFood.status}
                  onChange={handleInputChange}
                  className="border rounded-md px-4 py-2"
                >
                  <option value="">Chọn trạng thái</option>
                  <option value="Đang bán">Đang bán</option>
                  <option value="Tạm ngưng">Tạm ngưng</option>
                  <option value="Ngưng bán">Ngưng bán</option>
                </select>
                <select
                  name="categoryId"
                  value={formFood.categoryId}
                  onChange={handleInputChange}
                  className="border rounded-md px-4 py-2"
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map((cat) => (
                    <option key={cat.categoryId} value={cat.categoryId}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end mt-6 space-x-3">
                <button
                  onClick={resetForm}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md"
                >
                  Đóng
                </button>
                <button
                  onClick={handleSubmitFood}
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

export default FoodManager;
