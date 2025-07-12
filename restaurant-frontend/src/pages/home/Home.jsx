import React from 'react';
import Hero from './hero/Hero';
import Banner from './banner/Banner';
import Category from './category/Category';
import Menu from './menu/Menu';
import Table from './table/Table';

const Home = () => {
    return (
        <div className=''>
            <Hero />
            <Banner />
            <Category />
            <Menu />
            <Table />
        </div>
    );
};

export default Home;