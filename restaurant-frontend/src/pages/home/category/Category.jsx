import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Category = () => {
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/food-categories");
      setCategoryData(res.data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách danh mục:", err);
    }
  };

  return (
<div className="w-full flex flex-col items-center bg-[#152C29] space-y-6 py-8">
  {categoryData.map((cat) => (
    <div
      key={cat.categoryId}
      className="relative group w-[1200px] h-[120px] hover:h-[220px] bg-[#152C29] border-t border-b border-b-[#152C29] 
                 overflow-hidden cursor-pointer transition-all duration-300"
    >
      <div
        className="absolute z-10 left-4 top-1/2 -translate-y-1/2 w-auto h-auto 
                   group-hover:left-0 group-hover:top-0 group-hover:translate-y-0 group-hover:w-full group-hover:h-full"
      >
        <img
          src={cat.imageUrl}
          alt={cat.categoryName}
          className="w-44 h-20 object-cover rounded-full shadow-md 
             group-hover:w-full group-hover:h-full group-hover:rounded-none
             group-hover:brightness-50"
        />
      </div>

      
      <div className="absolute right-8 top-1/2 -translate-y-1/2 flex items-center gap-4 z-10">
  {/* H2 và icon ngôi sao */}
  <div
    className="flex items-center gap-3
               transition-all duration-300
               group-hover:relative group-hover:left-[-13%] group-hover:translate-x-1/8"
  >
    <h2
      style={{ fontFamily: 'Fraunces, serif' }}
      className="text-6xl text-white tracking-wide  transition-all duration-300"
    >
      {cat.categoryName.toUpperCase()}
    </h2>
    <img
      src="https://images.vexels.com/media/users/3/254382/isolated/preview/8efce08800d999b79c2f73b94c75fd03-yellow-star-flat.png"
      className="w-5 h-5 object-cover"
      alt="star"
    />
  </div>

  <div
  className="w-20 h-20 rounded-full border border-yellow-500 flex items-center justify-center
             transition-all duration-500 transform
             group-hover:bg-[#E6B15F] group-hover:rotate-[360deg]"
>
  <svg
    className="w-10 h-10 text-[#E6B15F] group-hover:text-black transition-colors duration-300"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
</div>


</div>


      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-[5]" />
    </div>
  ))}
</div>








  );
};

export default Category;
