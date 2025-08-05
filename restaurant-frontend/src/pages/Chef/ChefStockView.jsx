import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ChefStockView = () => {
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/chef/ingredients');
      setIngredients(response.data);
    } catch (error) {
      console.error('Lỗi khi tải danh sách tồn kho:', error);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-green-700 mb-6">📦 Tồn kho nguyên liệu</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {ingredients.map((ingredient) => (
          <div
            key={ingredient.ingredientId}
            className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center hover:shadow-xl transition"
          >
            <img
              src={ingredient.imageUrl || 'https://via.placeholder.com/150'}
              alt={ingredient.ingredientName}
              className="w-28 h-28 object-cover rounded-full border mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-800">
              {ingredient.ingredientName}
            </h3>
            <p className="text-gray-600">Đơn vị: <strong>{ingredient.unit}</strong></p>
            <p className="text-gray-600">Tồn kho: <strong>{ingredient.quantityInStock}</strong></p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChefStockView;
