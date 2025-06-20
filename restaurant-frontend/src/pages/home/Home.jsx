import React from 'react';
import Hero from './hero/Hero';
import Banner from './banner/Banner';
import Category from './category/Category';
import Offer from './offer/Offer';
import Menu from './menu/Menu';
import Table from './table/Table';

const Home = () => {
    return (
        <div className='space-y-10'>
            <Hero />
            <Banner />
            <Category />
            <Offer />
            <Menu />
            <Table />
        </div>
    );
};

export default Home;