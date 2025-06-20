import React from 'react';
import ChickenB from '../../../assets/images/hero2.png'
import FishImg from '../../../assets/images/hero5.png'
const Offer = () => {
    return (
        <div className='w-full lg:px-28 md:px-16 sm:px-7 px-4 pb-8'>
            <div className="grid md:grid-cols-2 grid-cols 1 gap-10">
                <div className="w-full md:h-[40vh] sm:h-[30vh] h-[25vh] md:p-5 p-2 flex items-center justify-center bg-gradient-to-tr from-neutral-900 to-transparent rounded-xl offer_bg">
                    <div className="w-full h-full flex items-center gap-6 rounded-xl overflow-hidden">
                        <div className="w-[40%] space-y-2.5">
                            <div className="space-y-1">
                                <h6 className="text-lg text-neutral-400 font-medium">
                                    Khuyến mãi 50%
                                </h6>
                                <h1 className="text-[2.15rem] text-neutral-100 font-bold leading-[1.1]">
                                    Gà Châu Phi
                                </h1>
                            </div>
                            <button className="lg:w-fit w-full px-5 py-1.5 rounded-xl text-base text-neutral-100 bg-yellow-600">
                                Đặt Bàn Ngay
                            </button>
                        </div>
                        <div className="w-[50%] h-auto group">
                            <img src={ChickenB} alt="offer img" className="w-full aspect-square object-contain object-center group-hover:scale-[1.14] group-hover:-rotate-12 ease-in-out duration-300" />
                        </div>
                    </div>
                </div>
                <div className="w-full md:h-[40vh] sm:h-[30vh] h-[25vh] md:p-5 p-2 flex items-center justify-center bg-gradient-to-tr from-neutral-900 to-transparent rounded-xl offer_bg">
                <div className="w-full h-full flex items-center gap-6 rounded-xl overflow-hidden">
                        <div className="w-[40%] space-y-2.5">
                            <div className="space-y-1">
                                <h6 className="text-lg text-neutral-400 font-medium">
                                    Khuyến mãi 50%
                                </h6>
                                <h1 className="text-[2.15rem] text-neutral-100 font-bold leading-[1.1]">
                                    Tôm Nướng
                                </h1>
                            </div>
                            <button className="lg:w-fit w-full px-5 py-1.5 rounded-xl text-base text-neutral-100 bg-yellow-600">
                                Đặt Bàn Ngay
                            </button>
                        </div>
                        <div className="w-[50%] h-auto group">
                            <img src={FishImg} alt="offer img" className="w-full aspect-square object-contain object-center group-hover:scale-[1.14] group-hover:-rotate-12 ease-in-out duration-300" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Offer;