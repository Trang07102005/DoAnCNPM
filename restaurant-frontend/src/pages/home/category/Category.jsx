import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { faPizzaSlice } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
    <div className='w-full lg:px-28 md:px-16 sm:px-7 px-4 py-6 space-y-4'>
      {/* Top Section */}
      <div className="w-full flex items-center justify-between">
        <h5 className="text-xl text-neutral-700 font-semibold">
          Danh Mục Nổi Bật
        </h5>
        <Link to="/" className='text-sm text-neutral-500 font-medium hover:text-yellow-500 ease-in-out duration-300'>
          Xem Tất Cả
        </Link>
      </div>

      {/* Danh sách danh mục */}
      <div className="grid md:grid-cols-8 sm:grid-cols-4 grid-cols-3 gap-4">
        {categoryData.map((cat) => (
          <Link
            to="/"
            key={cat.categoryId}
            className="bg-neutral-400/10 hover:bg-neutral-400/20 border border-neutral-400/20 w-full px-2 pt-2 pb-3 rounded-xl space-y-2.5 ease-in-out duration-300 flex items-center justify-center gap-x-2.5"
          >
            
            <h6 className="text-base text-neutral-700 font-medium">
              {cat.categoryName}
            </h6>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Category;
