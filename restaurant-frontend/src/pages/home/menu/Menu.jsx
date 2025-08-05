import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Menu = () => {
  const [menuData, setMenuData] = useState([]);

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/food");
      setMenuData(res.data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách món ăn:", err);
    }
  };

  return (
    <div className="w-full bg-[#0f2a24] py-12 px-4 lg:px-28 md:px-16 sm:px-7">
      {/* Tiêu đề */}
      <div className="text-center mb-12">
        <h2 className="text-[#E6B15F] font-medium tracking-wider text-xl"
          style={{ fontFamily: 'Fraunces, serif' }}>DANH MỤC MÓN ĂN</h2>
        <h1 className="text-6xl text-white font-thin mt-2"
        style={{ fontFamily: 'Fraunces, serif' }}>Món Ăn Bán Chạy</h1>
      </div>

      {/* Grid món ăn */}
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-12">
        {menuData.slice(0, 9).map((data) => (
          <div
            key={data.foodId}
            className="relative bg-[#0b1e1b] border border-[#E6B15F] rounded-[200px_200px_0_0] overflow-hidden text-center pb-6 hover:scale-105 transition duration-300"
          >
            {/* Hình ảnh */}
            <div className="w-full h-[400px] bg-[#152C29] flex items-center justify-center">
              <img
                src={data.imageUrl}
                alt={data.foodName}
                className="w-[300px] h-[300px] object-cover rounded-full border-4 border-[#E6B15F]"
              />
            </div>

            {/* Nội dung */}
            <div className="px-6 pt-6">
              <h3 className="text-white text-xl font-semibold uppercase tracking-wide">{data.foodName}</h3>
              <p className="text-neutral-400 text-sm mt-2 mb-4">
                {data.category?.categoryName || 'Đặc biệt'}
              </p>

              {/* Giá tiền */}
              <div className="text-[#E6B15F] text-lg font-semibold">
                {Number(data.price).toLocaleString()} đ
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Nút Xem Tất Cả */}
      <div className="w-full flex justify-center mt-12">
        <Link
          to="/foodmenu"
          className="px-10 py-4 bg-[#E6B15F] text-black font-semibold  hover:bg-yellow-400 transition duration-300"
        >
          Xem Tất Cả Món Ăn
        </Link>
      </div>
    </div>
  );
};

export default Menu;
