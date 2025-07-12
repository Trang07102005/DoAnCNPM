import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  return (
    <footer className="w-full bg-[#0f2a24] text-white py-16 px-4 lg:px-28 md:px-16 sm:px-8 ">
      {/* Đường viền ngắn ở giữa */}
  <div className="w-[1000px] h-px bg-gray-300 mx-auto mb-20" />
      {/* Phần giữa */}
      <div className="flex flex-col items-center space-y-12">
        {/* Ảnh 2 bên + info */}
        <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-10">
          {/* Ảnh trái */}
          <div className="w-[200px] h-[260px] rounded-[80px] overflow-hidden border border-yellow-500">
            <img
              src="https://kalanidhithemes.com/live-preview/landing-page/restoria/all-demo/Restoria-Defoult-2/images/resource/footer-img-1.jpg" // Thay bằng đường dẫn ảnh trái bạn upload
              alt="Restaurant Inside"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Nội dung giữa */}
          <div className="text-center max-w-xl space-y-3">
            <h1 className="text-3xl font-bold text-white">
              <span className="text-yellow-500">VIET</span>TAURANT
            </h1>
            <p className="text-sm text-neutral-300">
              VIETAURANT, 824 Sư Vạn Hạnh, TP. Hồ Chí Minh
              <br />
              Hàng Ngày - 8.00 am đến 10.00 pm
              <br />
              booking@gmail.com
              <br />
              Yêu Cầu Booking : +84-123-456 789
            </p>
          </div>

          {/* Ảnh phải */}
          <div className="w-[200px] h-[260px] rounded-[80px] overflow-hidden border border-yellow-500">
            <img
              src="https://kalanidhithemes.com/live-preview/landing-page/restoria/all-demo/Restoria-Defoult-2/images/resource/footer-img-2.jpg" // Thay bằng đường dẫn ảnh phải bạn upload
              alt="Dish"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Newsletter */}
        <div className="text-center mt-12">
          <h2 className="text-2xl font-semibold text-white mb-2">GỬI EMAIL</h2>
          <p className="text-neutral-400 mb-6">
            ĐĂNG KÝ VỚI CHÚNG TÔI & NHẬN 25% DISCOUNT. NHẬN THÔNG BÁO MỚI NHẤT
          </p>
          <form className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="relative w-full sm:w-96">
              <FontAwesomeIcon
                icon={faEnvelope}
                className="absolute left-3 top-3.5 text-neutral-400"
              />
              <input
                type="email"
                placeholder="Nhập Email"
                className="w-full py-2 pl-10 pr-4 rounded-md bg-transparent border border-neutral-500 text-white placeholder:text-neutral-400 focus:outline-none focus:border-yellow-500 transition"
              />
            </div>
            <button
              type="submit"
              className="bg-[#E6B15F] text-black font-semibold px-10 py-2  hover:bg-yellow-400 transition"
            >
              ĐĂNG KÝ
            </button>
          </form>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
