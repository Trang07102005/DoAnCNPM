import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faPhone,
  faPeopleGroup,
  faCalendarDays,
  faClock,
} from '@fortawesome/free-solid-svg-icons';

const Table = () => {
  return (
    <div
      className="w-full min-h-screen bg-cover bg-center flex items-center justify-center px-4"
      style={{ backgroundImage: `url('https://kalanidhithemes.com/live-preview/landing-page/restoria/all-demo/Restoria-Defoult-2/images/background/image-10.jpg')` }}
    >
      <div className="bg-[#0b1e1b]/90 p-8 w-full max-w-4xl border border-yellow-500 bg-no-repeat bg-center bg-[length:450px_450px]"
      style={{
        backgroundImage: `url('https://kalanidhithemes.com/live-preview/landing-page/restoria/all-demo/Restoria-Defoult-2/images/resource/pattern-dark.png')`,
      }}
    >
        <div className="text-center mb-8">
          <h5 className="text-[#E6B15F] tracking-widest font-medium">ĐẶT ONLINE</h5>
          <h1 className="text-4xl text-white font-semibold mt-2 mb-2">ĐẶT BÀN</h1>
          <p className="text-neutral-300">
            YÊU CẦU BOOKING <span className="text-[#E6B15F]">+84-0123 456789</span> hoặc ĐIỀN VÀO FORM BÊN DƯỚI
          </p>
        </div>

        <form className="space-y-6">
          <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
            {/* Your Name */}
            <div className="relative">
              <FontAwesomeIcon icon={faUser} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Họ Và Tên"
                className="w-full h-12 pl-10 pr-3 bg-[#0f2a24] text-white border border-neutral-500  focus:border-[#E6B15F] focus:outline-none"
              />
            </div>

            {/* Phone Number */}
            <div className="relative">
              <FontAwesomeIcon icon={faPhone} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Số Điện Thoại"
                className="w-full h-12 pl-10 pr-3 bg-[#0f2a24] text-white border border-neutral-500  focus:border-yellow-500 focus:outline-none"
              />
            </div>

            {/* Số người */}
            <div className="relative">
              <FontAwesomeIcon icon={faPeopleGroup} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
              <select
                className="w-full h-12 pl-10 pr-3 bg-[#0f2a24] text-white border border-neutral-500  focus:border-yellow-500 focus:outline-none"
              >
                <option value="1">1 Người</option>
                <option value="2">2 Người</option>
                <option value="3">3 Người</option>
                <option value="4">4 Người</option>
                <option value="5">5 Người</option>
              </select>
            </div>

            {/* Ngày */}
            <div className="relative">
              <FontAwesomeIcon icon={faCalendarDays} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
              <input
                type="date"
                className="w-full h-12 pl-10 pr-3 bg-[#0f2a24] text-white border border-neutral-500  focus:border-yellow-500 focus:outline-none"
              />
            </div>

            {/* Giờ */}
            <div className="relative md:col-span-2">
              <FontAwesomeIcon icon={faClock} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
              <input
                type="time"
                className="w-full h-12 pl-10 pr-3 bg-[#0f2a24] text-white border border-neutral-500  focus:border-yellow-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Message */}
          <textarea
            placeholder="Ghi Chú Thêm"
            rows="4"
            className="w-full px-4 py-3 bg-[#0f2a24] text-white border border-neutral-500  focus:border-yellow-500 focus:outline-none"
          />

          {/* Button */}
          <button
            type="submit"
            className="w-full h-12 bg-[#E6B15F] text-black font-semibold  hover:bg-yellow-400 transition duration-300"
          >
            ĐẶT BÀN
          </button>
        </form>
      </div>
    </div>
  );
};

export default Table;
