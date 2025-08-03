import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AddRecipe = () => {
  const [foods, setFoods] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [selectedFoodId, setSelectedFoodId] = useState("");
  const [description, setDescription] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([{ ingredientId: "", quantity: "" }]);
  const [showRecipeList, setShowRecipeList] = useState(false);
  const [editingRecipeId, setEditingRecipeId] = useState(null);
  const [viewRecipeDetail, setViewRecipeDetail] = useState(null);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [recipeRes, foodRes, ingredientRes] = await Promise.all([
        axios.get("/api/manager/recipes/all", { headers }),
        axios.get("/api/food", { headers }),
        axios.get("/api/manager/ingredients", { headers }),
      ]);
      setRecipes(recipeRes.data);
      setFoods(foodRes.data);
      setIngredients(ingredientRes.data);
    } catch (error) {
      toast.error("Lỗi tải dữ liệu, vui lòng thử lại.");
      console.error(error);
    }
  };

  const handleIngredientChange = (index, field, value) => {
    const newList = [...selectedIngredients];
    newList[index][field] = value;
    setSelectedIngredients(newList);
  };

  const addIngredientRow = () => {
    setSelectedIngredients([...selectedIngredients, { ingredientId: "", quantity: "" }]);
  };

  const removeIngredientRow = (index) => {
    if (selectedIngredients.length === 1) {
      toast.warn("Phải có ít nhất một nguyên liệu trong công thức.");
      return;
    }
    const newList = [...selectedIngredients];
    newList.splice(index, 1);
    setSelectedIngredients(newList);
  };

  const handleEdit = async (recipe) => {
    try {
      const res = await axios.get(`/api/manager/recipes/${recipe.recipeId}`, { headers });
      const data = res.data;
      setSelectedFoodId(data.foodId.toString());
      setDescription(data.description || "");
      setSelectedIngredients(
        (data.ingredients || []).map((ing) => ({
          ingredientId: ing.ingredientId.toString(),
          quantity: ing.quantity.toString(),
        }))
      );
      setEditingRecipeId(data.recipeId);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      toast.error("Không thể tải dữ liệu để chỉnh sửa");
      console.error(error);
    }
  };

  const handleDeleteRecipe = async (recipeId) => {
    if (!window.confirm("Bạn có chắc muốn xóa công thức này không?")) return;
    try {
      await axios.delete(`/api/manager/recipes/${recipeId}`, { headers });
      toast.success("Đã xóa công thức");
      setRecipes((prev) => prev.filter((r) => r.recipeId !== recipeId));
    } catch (error) {
      toast.error("Lỗi khi xóa công thức");
      console.error(error);
    }
  };

  const handleViewDetail = async (recipeId) => {
    try {
      const res = await axios.get(`/api/manager/recipes/${recipeId}`, { headers });
      setViewRecipeDetail(res.data);
    } catch (error) {
      toast.error("Không thể xem chi tiết công thức");
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFoodId) {
      toast.warn("Vui lòng chọn món ăn");
      return;
    }

    // Validate ingredients
    for (const item of selectedIngredients) {
      if (!item.ingredientId || !item.quantity || parseFloat(item.quantity) <= 0) {
        toast.warn("Vui lòng nhập đầy đủ và đúng số lượng nguyên liệu");
        return;
      }
    }

    const mappedIngredients = selectedIngredients.map((item) => ({
      ingredientId: parseInt(item.ingredientId),
      quantity: parseFloat(item.quantity),
    }));

    try {
      if (editingRecipeId) {
        await axios.put(
          `/api/manager/recipes/${editingRecipeId}`,
          { foodId: parseInt(selectedFoodId), description, ingredients: mappedIngredients },
          { headers }
        );
        toast.success("Cập nhật công thức thành công");
      } else {
        await axios.post(
          "/api/manager/recipes/add",
          { foodId: parseInt(selectedFoodId), description, ingredients: mappedIngredients },
          { headers }
        );
        toast.success("Thêm công thức thành công");
      }

      // Reset form
      setSelectedFoodId("");
      setDescription("");
      setSelectedIngredients([{ ingredientId: "", quantity: "" }]);
      setEditingRecipeId(null);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi khi xử lý công thức");
      console.error(err);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto bg-gradient-to-r from-green-200 to-blue-200 shadow-2xl rounded-2xl">
      <h2 className="text-3xl font-extrabold mb-10 text-green-700">
        {editingRecipeId ? "✏️ Chỉnh sửa công thức" : "➕ Thêm công thức"}
      </h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8 p-6 bg-white rounded-xl shadow-md border border-gray-200">
        {/* Chọn món ăn */}
        <div>
          <label htmlFor="selectedFoodId" className="block mb-2 text-lg font-semibold text-gray-700">
            🍽️ Chọn món ăn
          </label>
          <select
            id="selectedFoodId"
            value={selectedFoodId}
            onChange={(e) => setSelectedFoodId(e.target.value)}
            className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all duration-200"
            required
          >
            <option value="" disabled hidden>
              -- Chọn món ăn --
            </option>
            {foods.map((food) => (
              <option key={food.foodId} value={food.foodId}>
                {food.foodName}
              </option>
            ))}
          </select>
        </div>

        {/* Mô tả */}
        <div>
          <label htmlFor="description" className="block mb-2 text-lg font-semibold text-gray-700">
            📝 Mô tả
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={1000}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all duration-200"
            placeholder="Nhập mô tả công thức..."
            rows={3}
            required
          />
        </div>

        {/* Nguyên liệu */}
        <div>
          <label className="block mb-4 text-lg font-semibold text-gray-800">Nguyên liệu:</label>
          {selectedIngredients.map((item, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row md:items-center md:gap-4 gap-2 bg-green-50 p-4 rounded-xl shadow-sm mb-4 border border-green-200"
            >
              {/* Select nguyên liệu */}
              <select
                value={item.ingredientId}
                onChange={(e) => handleIngredientChange(index, "ingredientId", e.target.value)}
                className="flex-1 p-3 rounded-lg border border-green-300 focus:ring-2 focus:ring-green-400 focus:outline-none bg-white"
                required
              >
                <option value="">-- Chọn nguyên liệu --</option>
                {ingredients.map((ing) => (
                  <option key={ing.ingredientId} value={ing.ingredientId}>
                    {ing.ingredientName} ({ing.unit})
                  </option>
                ))}
              </select>

              {/* Input số lượng */}
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Số lượng"
                value={item.quantity}
                onChange={(e) => handleIngredientChange(index, "quantity", e.target.value)}
                className="flex-1 p-3 rounded-lg border border-green-300 focus:ring-2 focus:ring-green-400 focus:outline-none"
                required
              />

              {/* Nút xóa dòng */}
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeIngredientRow(index)}
                  className="text-red-500 hover:text-red-700 text-lg font-bold px-3"
                  title="Xóa dòng"
                >
                  ✖
                </button>
              )}
            </div>
          ))}

          {/* Nút thêm nguyên liệu */}
          <button
            type="button"
            onClick={addIngredientRow}
            className="mt-2 inline-block text-green-600 hover:text-green-800 font-medium"
          >
            + Thêm nguyên liệu
          </button>
        </div>

        {/* Nút submit */}
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-lg transition"
        >
          {editingRecipeId ? "💾 Lưu thay đổi" : "➕ Thêm công thức"}
        </button>
      </form>

      {/* Danh sách công thức */}
      <div className="mt-12">
        <button
          onClick={() => setShowRecipeList(!showRecipeList)}
          className="text-white bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md"
        >
          {showRecipeList ? "🔽 Ẩn công thức" : "📋 XEM CÔNG THỨC"}
        </button>

        {showRecipeList && (
          <div className="mt-8">
            <h3 className="text-2xl font-bold text-green-700 mb-4 flex items-center gap-2">
              📦 Danh sách công thức
            </h3>

            <div className="overflow-x-auto rounded-xl shadow-md">
              <table className="min-w-full table-auto border border-gray-200 bg-white">
                <thead className="bg-green-100 text-green-800">
                  <tr>
                    <th className="px-4 py-3 border text-left">#</th>
                    <th className="px-4 py-3 border text-left">🍽️ Tên món</th>
                    <th className="px-4 py-3 border text-left">📝 Mô tả</th>
                    <th className="px-4 py-3 border text-center">⚙️ Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {recipes.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center text-gray-500 py-6 italic">
                        ❗ Chưa có công thức nào được thêm.
                      </td>
                    </tr>
                  ) : (
                    recipes.map((recipe, index) => (
                      <tr key={recipe.recipeId} className="hover:bg-gray-50 transition-all">
                        <td className="px-4 py-2 border text-center font-semibold text-gray-700">
                          {index + 1}
                        </td>
                        <td className="px-4 py-2 border text-gray-800">{recipe.foodName}</td>
                        <td className="px-4 py-2 border text-gray-700">{recipe.description}</td>
                        <td className="px-4 py-2 border text-center space-x-2">
                          <button
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg shadow-sm"
                            onClick={() => handleEdit(recipe)}
                          >
                            ✏️ Sửa
                          </button>
                          <button
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg shadow-sm"
                            onClick={() => handleViewDetail(recipe.recipeId)}
                          >
                            👁️ Xem
                          </button>
                          <button
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg shadow-sm"
                            onClick={() => handleDeleteRecipe(recipe.recipeId)}
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
        )}
      </div>

      {/* Modal xem chi tiết */}
      {viewRecipeDetail && (
        <div className="fixed inset-0 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-xl relative shadow-xl border-[5px] border-green-300">
            <h3 className="text-2xl font-extrabold mb-6 text-green-700 tracking-wide drop-shadow-md">
              👁️ Chi tiết công thức
            </h3>
            <p className="mb-3 text-gray-800 text-lg">
              <span className="font-semibold">Món:</span>{" "}
              <span className="text-green-600">{viewRecipeDetail.foodName}</span>
            </p>
            <p className="mb-6 text-gray-700 italic leading-relaxed">
              <span className="font-semibold">Mô tả:</span> {viewRecipeDetail.description}
            </p>
            <h4 className="font-semibold mb-3 text-gray-900 border-b border-green-200 pb-2">
              Nguyên liệu:
            </h4>
            <ul className="list-disc list-inside space-y-2 max-h-56 overflow-y-auto pr-3 text-gray-700">
              {viewRecipeDetail.ingredients?.length > 0 ? (
                viewRecipeDetail.ingredients.map((ing, idx) => (
                  <li key={idx} className="hover:text-green-600 transition">
                    <span className="font-medium">{ing.ingredientName}</span> -{" "}
                    <span className="font-semibold">{ing.quantity}</span> {ing.unit}
                  </li>
                ))
              ) : (
                <li className="italic text-gray-400">Chưa có nguyên liệu.</li>
              )}
            </ul>
            <button
              onClick={() => setViewRecipeDetail(null)}
              className="absolute top-4 right-4 text-red-600 hover:text-red-800 transition-colors duration-300 text-3xl font-extrabold leading-none select-none"
              aria-label="Đóng modal"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddRecipe;
