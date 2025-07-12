import React, { useState } from 'react';
import { toast } from 'react-toastify';

const Contact = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.warn("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    // Giả lập gửi form
    console.log('Gửi liên hệ:', form);
    toast.success("Cảm ơn bạn đã liên hệ!");
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <>
      {/* Ảnh nền đầu trang */}
      <div
        className="w-full h-[500px] bg-cover bg-center flex items-center justify-center text-center"
        style={{
          backgroundImage:
            "url('https://kalanidhithemes.com/live-preview/landing-page/restoria/all-demo/Restoria-Defoult-2/images/background/banner-image-4.jpg')"
        }}
      >
        <div className="bg-black/50 w-full h-full flex flex-col justify-center items-center px-4">
          <h1 className="text-white text-4xl font-bold mb-2">LIÊN HỆ NHÀ HÀNG</h1>
          <p className="text-neutral-300 text-lg">Chúng tôi luôn sẵn sàng lắng nghe bạn</p>
        </div>
      </div>

      {/* Nội dung liên hệ */}
      <div className="w-full bg-[#0f2a24] text-white py-16 px-4 lg:px-28 md:px-16 sm:px-7">
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Thông tin liên hệ */}
          <div>
          <img
            src="https://kalanidhithemes.com/live-preview/landing-page/restoria/all-demo/Restoria-Defoult-2/images/resource/restaurant.jpg" // hoặc đường dẫn đầy đủ từ CDN
            alt="curve"
            className="w-70 m-auto mb-12"
            />
            <h2 className="text-3xl font-bold mb-4 text-[#E6B15F]">Thông Tin Liên Hệ</h2>
            <p className="mb-4">Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua thông tin bên dưới.</p>
            <ul className="space-y-4 text-base">
              <li><strong>Địa chỉ:</strong> 123 Đường Nguyễn Văn Cừ, Q.5, TP.HCM</li>
              <li><strong>Điện thoại:</strong> (028) 1234 5678</li>
              <li><strong>Email:</strong> support@viettaurant.vn</li>
              <li><strong>Giờ mở cửa:</strong> 09:00 - 22:00 (hằng ngày)</li>
            </ul>
          </div>

          {/* Form liên hệ */}
          <form onSubmit={handleSubmit} className="bg-[#0f2a24] p-6  ">
            <h2 className="text-2xl font-semibold mb-6 text-[#E6B15F]">Gửi Tin Nhắn</h2>

            <div className="mb-4">
              <label className="block mb-1">Tên của bạn</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-transparent border border-gray-500  focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-transparent border border-gray-500  focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1">Nội dung</label>
              <textarea
                name="message"
                rows="5"
                value={form.message}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-transparent border border-gray-500  focus:outline-none focus:border-yellow-400 resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-[#E6B15F] text-black text-xl font-thin hover:bg-yellow-400 transition duration-300 "
            >
              Gửi Liên Hệ
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Contact;
