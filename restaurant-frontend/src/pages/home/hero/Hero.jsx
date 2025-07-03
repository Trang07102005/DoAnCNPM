import React from 'react';
import Slider from './slider/Slider';

const Hero = () => {
    return (
        <div className='w-full md:h-[calc(100vh-8ch)] h-auto bg-gradient-to-tr from-yellow-700 via-amber-800 to-red-700 flex items-center justify-between mt-[8ch] lg:px-28 md:px-16 sm:px-7 px-4'>
            <div className="flex-1 w-full flex items-center justify-between gap-x-8 gap-y-4 md:py-0 py-4 flex-wrap">
                <div className="md:w-[45%] w-full space-y-8">
                    <div className="space-y-4">
                        <h6 className="text-yellow-200/70 text-base font-normal bg-neutral-900/40 w-fit px-3 py-0.5 rounded-lg">
                            AN TOÀN & CHẤT LƯỢNG
                        </h6>
                        <h1 className="text-neutral-50 font-black md:text text-5xl leading-tight">
                            Món Ăn Độc Đáo Khắp Thế Giới
                        </h1>
                        <p className="md:text-base text-sm text-neutral-300 font-normal">
                            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Rerum provident blanditiis quia dolorem et magni recusandae sed laudantium exercitationem possimus, porro ullam obcaecati, soluta alias! Expedita tempora nihil explicabo labore.
                        </p>
                    </div>
                    <button className="w-fit px-8 py-2 text-lg font-medium text-neutral-900 bg-neutral-100 hover:text-neutral-100 hover:bg-neutral-100/10 border-2 border-neutral-100 hover:border-neutral-100 rounded-xl ease-in-out duration-300">
                        Đặt Bàn Ngay !
                    </button>
                </div>
                <div className="md:w-[50%] w-full space-y-4">
                    <Slider />
                </div>
            </div>
        </div>
    );
};

export default Hero;