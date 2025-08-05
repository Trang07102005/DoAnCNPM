import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FoodList = () => {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  useEffect(() => {
    fetchFoods();
    fetchCategories();
  }, []);

  const fetchFoods = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/food');
      setFoods(res.data);
    } catch (error) {
      console.error('Lỗi khi tải danh sách món ăn:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/food-categories');
      setCategories(res.data);
    } catch (error) {
      console.error('Lỗi khi tải danh mục:', error);
    }
  };

  const filteredFoods = selectedCategoryId
    ? foods.filter(food => food.category?.categoryId === selectedCategoryId)
    : foods;

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">🍽️ Danh sách món ăn</h2>

      {/* Danh mục dạng liệt kê */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button
          onClick={() => setSelectedCategoryId(null)}
          className={`px-4 py-2 rounded-full border transition-all duration-200 ${
            selectedCategoryId === null
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-800 border-gray-300'
          } hover:bg-blue-100`}
        >
          Tất cả
        </button>
        {categories.map((category) => (
          <button
            key={category.categoryId}
            onClick={() => setSelectedCategoryId(category.categoryId)}
            className={`px-4 py-2 rounded-full border transition-all duration-200 ${
              selectedCategoryId === category.categoryId
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-800 border-gray-300'
            } hover:bg-blue-100`}
          >
            {category.categoryName}
          </button>
        ))}
      </div>

      {filteredFoods.length === 0 ? (
        <p className="text-gray-600">Không có món ăn nào.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filteredFoods.map((food) => (
            <div
              key={food.foodId}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 overflow-hidden flex flex-col"
            >
              {food.imageUrl ? (
                <img
                  src={food.imageUrl}
                  alt={food.foodName}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                  Không có ảnh
                </div>
              )}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">{food.foodName}</h3>
                  <p className="text-gray-500 text-sm mb-2">
                    Danh mục: {food.category?.categoryName || 'Không rõ'}
                  </p>
                </div>
                <div className="mt-auto">
                  <p className="text-lg font-bold text-green-600 mb-1">
                    {food.price?.toLocaleString()} đ
                  </p>
                  <p
                    className={`text-sm font-medium ${
                      food.status === 'Đang bán' ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    Trạng thái: {food.status === 'Đang bán' ? 'Còn món' : 'Hết món'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FoodList;
