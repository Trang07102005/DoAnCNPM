
import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
// import required modules
import { Autoplay, EffectCards } from 'swiper/modules';
import HeroImg1 from "../../../../assets/images/hero1.png";
import HeroImg2 from "../../../../assets/images/hero2.png";
import HeroImg3 from "../../../../assets/images/hero3.png";
import HeroImg4 from "../../../../assets/images/hero4.png";
import HeroImg5 from "../../../../assets/images/hero5.png";

const Slider = () => {
    return (
        <div>
        <Swiper
            loop = {true}
            spaceBetween={30}
            autoplay={{
            delay: 2500,
            disableOnInteraction: false,
            }}
           
            modules={[Autoplay, EffectCards]}
            className="mySwiper [&_.swiper-wrapper]:!ease-linear"
        >
            <SwiperSlide>
                <img src={HeroImg1} alt="food img" className="w-full aspect-square object-contain object-center" />
            </SwiperSlide>
            <SwiperSlide>
                <img src={HeroImg2} alt="food img" className="w-full aspect-square object-contain object-center" />
            </SwiperSlide>
            <SwiperSlide>
                <img src={HeroImg3} alt="food img" className="w-full aspect-square object-contain object-center" />
            </SwiperSlide>
            <SwiperSlide>
                <img src={HeroImg4} alt="food img" className="w-full aspect-square object-contain object-center" />
            </SwiperSlide>
            <SwiperSlide>
                <img src={HeroImg5} alt="food img" className="w-full aspect-square object-contain object-center" />
            </SwiperSlide>
      </Swiper>
        </div>
    );
};

export default Slider;