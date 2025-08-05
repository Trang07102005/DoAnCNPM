import React, { useEffect, useState } from "react";
import axios from "axios";

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
        className="w-full h-[500px] bg-cover bg-center relative"
        style={{
          backgroundImage:
            "url('https://kalanidhithemes.com/live-preview/landing-page/restoria/all-demo/Restoria-Defoult-2/images/background/banner-image-4.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-white text-4xl font-bold mb-2">THƯ VIỆN HÌNH ẢNH</h1>
          <p className="text-neutral-300 text-lg">Không gian và khoảnh khắc tại nhà hàng</p>
        </div>
      </div>

      {/* Lưới ảnh */}
      <div className="w-full bg-[#0f2a24] py-16 px-6 sm:px-10 md:px-16 lg:px-28">
        {images.length === 0 ? (
          <div className="text-white text-center text-xl py-10 animate-pulse">
            Đang tải ảnh...
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-3 space-y-6">
          {images.map((img, index) => (
            <div
              key={index}
              className="break-inside-avoid border-b-3 border-[#E6B15F] overflow-hidden rounded-b-xl shadow-xl bg-white hover:scale-[1.02] transition-transform duration-300"
            >
              <img
                src={img.imageUrl}
                alt={img.caption || "Ảnh nhà hàng"}
                className="w-full h-auto object-cover brightness-67"
              />
              {img.caption && (
                <div className="px-4 py-2  text-center text-sm text-gray-200 italic bg-[#0b1e1b]">
                  {img.caption}
                </div>
              )}
            </div>
          ))}

          </div>
        )}
      </div>
    </>
  );
};

export default Gallery;
