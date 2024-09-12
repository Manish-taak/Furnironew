import React from 'react'
import Banner from './home/Banner'
import BrowseRange from './home/BrowseRange'
import FuniroFurniture from './home/FuniroFurniture'
import OurProducts from './home/OurProducts'
import Card from '@/component/ui/Card'

const page = () => {
    return (
        <>
            <Banner />
            <BrowseRange />
            <FuniroFurniture />
            <OurProducts />
            <Card />
        </>
    )
}

export default page