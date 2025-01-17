"use client";
import React, { useState } from "react";
import Banner from "./home/Banner";
import BrowseRange from "./home/BrowseRange";
import FuniroFurniture from "./home/FuniroFurniture";
import OurProducts from "./home/OurProducts";
import Card from "@/component/ui/Card";
import Button from "@/component/ui/Button";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "@/component/ui/Input";
import InputSelect from "@/component/ui/InputSelect";
import { Controller, useForm } from "react-hook-form";
import Benefits from "@/component/Benefits";
import TittleSection from "@/component/TittleSection";
import Header from "@/component/ui/Header";



// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// import required modules
import { Pagination } from 'swiper/modules';



const page = () => {

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [show, setshow] = useState(false);

  return (
    <>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor necessitatibus nobis aspernatur, blanditiis impedit consequatur quis ut, repellat dicta nisi accusamus voluptatem illum beatae consequuntur maxime molestias iure a ab!
      <Swiper                         
        pagination={{
          dynamicBullets: true,
        }}
        modules={[Pagination]}
        className="mySwiper"
      >
        <SwiperSlide>Slide 1</SwiperSlide>
        <SwiperSlide>Slide 2</SwiperSlide>
        <SwiperSlide>Slide 3</SwiperSlide>
        <SwiperSlide>Slide 4</SwiperSlide>
        <SwiperSlide>Slide 5</SwiperSlide>
        <SwiperSlide>Slide 6</SwiperSlide>
        <SwiperSlide>Slide 7</SwiperSlide>
        <SwiperSlide>Slide 8</SwiperSlide>
        <SwiperSlide>Slide 9</SwiperSlide>
      </Swiper>
































    </>
  );
};

export default page;