import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';

import Navbar from '../../../components/navbar/Navbar';

const slides = [
  {
    image: 'https://assets.epicurious.com/photos/5a3002b504847a34b821cb4a/16:9/w_2580,c_limit/seared-scallops-with-brown-butter-and-lemon-pan-sauce-recipe-BA-121217.jpg',
    subtitle: 'PHỤC VỤ TỪ NĂM 1995',
    title: 'Trải Nghiệm Tuyệt Vời',
    desc: 'Hương vị hoàn hảo trong từng món ăn – ẩm thực tinh tế mang phong cách hiện đại.'
  },
  {
    image: 'https://media.riverford.co.uk/images/dish/meat-main-2500x1822-3d3d16dd8a3763dfb7c399c9cb4b8e23.jpg',
    subtitle: 'KHÁM PHÁ HƯƠNG VỊ',
    title: 'Ẩm Thực Đỉnh Cao',
    desc: 'Tận hưởng món ngon đặc sắc từ đầu bếp hàng đầu thế giới, được chế biến với tâm huyết.'
  },
  {
    image: 'https://cdn.sanity.io/images/fr9flhkd/main/fddab1cc5c2abf477430e76dde2d290622b46aa5-1800x1000.jpg?fm=webp&q=75&w=1280',
    subtitle: 'MENU PHONG PHÚ',
    title: 'Mỗi Món Là Một Câu Chuyện',
    desc: 'Chọn lựa từ hàng chục món ăn độc đáo được chọn lọc kỹ lưỡng để làm hài lòng vị giác của bạn.'
  }
];

const Hero = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Navbar nằm nổi bên trên */}
      <div className="absolute top-0 left-0 w-full z-30">
        <Navbar insideHero={true} />
      </div>

      {/* Swiper - Background slider */}
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        className="w-full h-full"
      >
        {slides.map((slide, index) => (
            <SwiperSlide key={index}>
  <div className="w-full h-full relative">
    
    {/* Background có hiệu ứng zoom */}
    <div
      className="absolute inset-0 bg-cover bg-center z-0 scale-125 animate-[zoom-out_10s_ease-out_forwards]"
      style={{ backgroundImage: `url(${slide.image})` }}
    ></div>

    {/* Overlay */}
    <div className="absolute inset-0 bg-black/60 z-10"></div>

    {/* Nội dung không bị zoom */}
    <div className="relative z-20 w-full h-full flex flex-col justify-center items-center text-center px-4">
      <p className="text-yellow-500 tracking-widest text-sm md:text-base mb-2">
        {slide.subtitle}
      </p>
      <h1
        className="text-white text-4xl md:text-6xl font-[Fraunces] font-semibold leading-tight mb-4"
        style={{ fontFamily: "'Fraunces', serif" }}
      >
        {slide.title}
      </h1>
      <p className="text-white/80 text-sm md:text-lg max-w-2xl">
        {slide.desc}
      </p>
    </div>
    
  </div>
</SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Hero;
