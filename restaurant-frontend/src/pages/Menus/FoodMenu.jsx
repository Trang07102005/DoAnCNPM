import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FoodMenu = () => {
  const [foods, setFoods] = useState([]);
  const [visibleCounts, setVisibleCounts] = useState({});

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/food');
      setFoods(res.data);
    } catch (err) {
      console.error('Lỗi khi tải danh sách món ăn:', err);
    }
  };

  const groupedByCategory = foods.reduce((groups, food) => {
    const catId = food.category?.categoryId;
    const catName = food.category?.categoryName || 'Không xác định';
    if (!groups[catId]) {
      groups[catId] = {
        categoryName: catName,
        items: [],
      };
    }
    groups[catId].items.push(food);
    return groups;
  }, {});

  const handleShowMore = (catId) => {
    setVisibleCounts((prev) => ({
      ...prev,
      [catId]: (prev[catId] || 6) + 3,
    }));
  };

  const handleCollapse = (catId) => {
    setVisibleCounts((prev) => ({
      ...prev,
      [catId]: 6,
    }));
  };

  return (
    <>
      {/* Ảnh nền đầu trang */}
      <div
        className="w-full h-[500px] bg-cover bg-center flex items-center justify-center text-center"
        style={{
          backgroundImage:
            "url('https://kalanidhithemes.com/live-preview/landing-page/restoria/all-demo/Restoria-Defoult-2/images/background/banner-image-2.jpg')",
        }}
      >
        <div className="bg-black/50 w-full h-full flex flex-col justify-center items-center px-4">
          <h1 className="text-white text-4xl font-bold mb-2">THỰC ĐƠN CỦA NHÀ HÀNG</h1>
          <p className="text-neutral-300 text-lg">Hương vị tinh tế, phục vụ tận tâm</p>
        </div>
      </div>

      {/* Nội dung món ăn */}
      <div className="w-full bg-[#0f2a24] py-12 px-4 lg:px-28 md:px-16 sm:px-7 space-y-7">
        {Object.entries(groupedByCategory).map(([catId, group]) => {
          const visibleCount = visibleCounts[catId] || 6;
          const totalItems = group.items.length;
          const showMore = visibleCount < totalItems;
          const canCollapse = visibleCount > 6;

          return (
            <div key={catId} className="mb-20">
              {/* Tiêu đề danh mục */}
              <div className="text-center mb-12">
                <h2 className="text-[#E6B15F] tracking-widest font-medium uppercase">Lunch + Dinner</h2>
                <h1 className="text-5xl text-white font-bold mt-2">{group.categoryName}</h1>
              </div>

              {/* Danh sách món */}
              <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-12">
                {group.items.slice(0, visibleCount).map((item) => (
                  <div
                    key={item.foodId}
                    className="relative bg-[#0b1e1b] border border-[#E6B15F] rounded-[120px_120px_0_0] overflow-hidden text-center pb-6 hover:scale-105 transition duration-300"
                  >
                    <div className="w-full h-[240px] bg-[#152C29] flex items-center justify-center">
                      <img
                        src={item.imageUrl}
                        alt={item.foodName}
                        className="w-[200px] h-[200px] object-cover rounded-full border-4 border-[#E6B15F]"
                      />
                    </div>
                    <div className="px-6 pt-6">
                      <h3 className="text-white text-xl font-semibold uppercase tracking-wide">{item.foodName}</h3>
                      <p className="text-neutral-400 text-sm mt-2 mb-4">{group.categoryName}</p>
                      <div className="text-[#E6B15F] text-lg font-semibold">
                        {Number(item.price).toLocaleString()} đ
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Nút Xem thêm / Thu gọn */}
              <div className="w-full flex justify-center gap-4 mt-8">
                {showMore && (
                  <button
                    onClick={() => handleShowMore(catId)}
                    className="px-10 py-3 bg-[#E6B15F] text-black font-semibold hover:bg-yellow-400 transition duration-300"
                  >
                    Xem thêm món
                  </button>
                )}
                {canCollapse && (
                  <button
                    onClick={() => handleCollapse(catId)}
                    className="px-10 py-3 bg-gray-600 text-white font-semibold hover:bg-gray-500 transition duration-300"
                  >
                    Thu gọn
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default FoodMenu;
