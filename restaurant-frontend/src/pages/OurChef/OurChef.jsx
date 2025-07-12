import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OurChef = () => {
  const [chefs, setChefs] = useState([]);

  useEffect(() => {
    const fetchChefs = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/users/chefs");
        setChefs(res.data);
      } catch (err) {
        console.error("Lỗi khi tải danh sách đầu bếp:", err);
      }
    };
    fetchChefs();
  }, []);

  return (
    <>
      {/* Ảnh nền đầu trang */}
      <div
        className="w-full h-[500px] bg-cover bg-center flex items-center justify-center text-center"
        style={{
          backgroundImage:
            "url('https://kalanidhithemes.com/live-preview/landing-page/restoria/all-demo/Restoria-Defoult-2/images/background/banner-image-5.jpg')",
        }}
      >
        <div className="bg-black/50 w-full h-full flex flex-col justify-center items-center px-4">
          <h1 className="text-white text-4xl font-bold mb-2">ĐỘI NGŨ ĐẦU BẾP</h1>
          <p className="text-neutral-300 text-lg">Những người đứng sau hương vị tuyệt vời</p>
        </div>
      </div>

      {/* Danh sách đầu bếp */}
      <div className="w-full bg-[#0f2a24] py-16 px-4 lg:px-28 md:px-16 sm:px-7">
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-12">
          {chefs.map((chef) => (
            <div
              key={chef.userId}
              className="bg-[#0b1e1b] rounded-xl border border-[#E6B15F] p-6 text-center hover:scale-105 transition-transform duration-300"
            >
              <div className="w-full flex justify-center mb-4">
                <img
                  src={chef.imageUrl || "/default-chef.png"}
                  alt={chef.username}
                  className="w-[180px] h-[180px] object-cover rounded-full border-4 border-[#E6B15F]"
                />
              </div>
              <h3 className="text-white text-xl font-bold">{chef.username}</h3>
              <p className="text-[#E6B15F] mt-1">{chef.email}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default OurChef;
