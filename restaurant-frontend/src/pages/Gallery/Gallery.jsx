import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Gallery = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/gallery");
      setImages(res.data);
    } catch (err) {
      console.error("Lỗi khi tải ảnh:", err);
    }
  };

  return (
    <>
      {/* Ảnh nền đầu trang */}
      <div
        className="w-full h-[500px] bg-cover bg-center flex items-center justify-center text-center"
        style={{
          backgroundImage:
            "url('https://kalanidhithemes.com/live-preview/landing-page/restoria/all-demo/Restoria-Defoult-2/images/background/banner-image-4.jpg')",
        }}
      >
        <div className="bg-black/50 w-full h-full flex flex-col justify-center items-center px-4">
          <h1 className="text-white text-4xl font-bold mb-2">THƯ VIỆN HÌNH ẢNH</h1>
          <p className="text-neutral-300 text-lg">Không gian và khoảnh khắc tại nhà hàng</p>
        </div>
      </div>

      {/* Lưới ảnh masonry */}
      <div className="w-full bg-[#0f2a24] py-12 px-4 lg:px-28 md:px-16 sm:px-7">
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {images.map((img, index) => (
            <div key={index} className="break-inside-avoid overflow-hidden rounded-lg shadow-md hover:scale-105 transition-transform duration-300">
              <img
                src={img.imageUrl}
                alt={img.caption || 'Ảnh nhà hàng'}
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Gallery;
