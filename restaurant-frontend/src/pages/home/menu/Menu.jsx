import React from 'react';
import { Link } from 'react-router-dom';
import Chicken from "../../../assets/images/hero2.png"

const Menu = () => {

    const menuData = [
        {
            id: 1,
            title: "Pizza",
            img: Chicken,
            name: "Gà Nướng Nguyên Con",
            desc: "Lorem",
            price: "230.000 đ",

        },
        {
            id: 2,
            title: "Pizza",
            img: Chicken,
            name: "Gà Nướng Nguyên Con",
            desc: "Lorem",
            price: "230.000 đ",

        },
        {
            id: 3,
            title: "Pizza",
            img: Chicken,
            name: "Gà Nướng Nguyên Con",
            desc: "Lorem",
            price: "230.000 đ",

        },
        {
            id: 4,
            title: "Pizza",
            img: Chicken,
            name: "Gà Nướng Nguyên Con",
            desc: "Lorem",
            price: "230.000 đ",

        },
        {
            id: 5,
            title: "Pizza",
            img: Chicken,
            name: "Gà Nướng Nguyên Con",
            desc: "Lorem",
            price: "230.000 đ",

        },
        {
            id: 6,
            title: "Pizza",
            img: Chicken,
            name: "Gà Nướng Nguyên Con",
            desc: "Lorem",
            price: "230.000 đ",

        },
        {
            id: 7,
            title: "Pizza",
            img: Chicken,
            name: "Gà Nướng Nguyên Con",
            desc: "Lorem",
            price: "230.000 đ",

        },
     
    ]

    return (
        <div className='w-full lg:px-28 md:px-16 sm:px-7 px-4'>
             {/* Top Section */}
             <div className="w-full flex items-center justify-between space-y-7">
                <h5 className="text-xl text-neutral-700 font-semibold">
                    Menu Món Ăn Bán Chạy
                </h5>

                <Link to = {"/"} className='text-sm text-neutral-500 font-medium hover:text-yellow-500 ease-in-out duration-300'>
                    Xem Tất Cả
                </Link>
            </div>

            {/*  */}
            <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-6">
                {menuData.map((data) => (
                    <Link to = {"/"} key={data.id} className='bg-neutral-400/10 hover:bg-neutral-400/20 border border-neutral-400/20 w-full px-2 pt-2 pb-3 rounded-xl space-y-2.5 ease-in-out duration-300'>
                         <img src={data.img} alt="food img" className="w-full aspect-[5/4] object-contain object-center" />
                         <div className="space-y-4 px-2 py-1">
                            <div className="space-y-1 5">
                                <h6 className="text-xl text-neutral-700 font-semibold">
                                    {data.name}
                                </h6>
                                <p className="text-sm text-neutral-400 font-normal line-clamp-1">
                                    {data.desc}
                                </p>
                                <div className="flex items-center justify-between">
                                    <h6 className="text-2xl text-neutral-700 font-bold">
                                        {data.price}
                                    </h6>
                                    <button className="w-fit px-3 py-1 bg-yellow-500 rounded-xl font-medium text-base text-neutral-700 hover:bg-yellow-600/60 ease-in-out duration-300">
                                        Xem chi tiết
                                    </button>
                                </div>
                            </div>
                         </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Menu;