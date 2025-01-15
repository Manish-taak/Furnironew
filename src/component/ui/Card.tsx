import React from "react";
import img from "@/../public/images/furniture15.png";
import SvgIcon from "../Icons";
import Button from "./Button";
const Card = () => {
  return (
    <>
      <div className="bg-card_bg inline-block hover:cursor-pointer relative ">
        <div className="relative">
          <img className=" object-contain" src={String(img.src)} alt="img" />
          <p className="py-3 px-[5px] bg-solid_orange text-white rounded-full absolute top-6 right-6 text-base font-medium leading-6">
            -30%
          </p>
        </div>
        <div className=" flex flex-col gap-y-2 pt-4 pl-4 pb-[30px] pr-[30px] ">
          <h4 className="text-linear_bg  heading_24">Syltherine</h4>
          <p className="text-base font-medium leading-6 text-bg_gray">
            Stylish cafe chair
          </p>
          <div className="flex items-center justify-between">
            <h5 className="font-semibold text-xl leading-[30px] text-linear_bg">
              Rp 2.500.000
            </h5>
            <h6 className="heading_16 text-bg_gray">
              <del>Rp 3.500.000</del>
            </h6>
          </div>
        </div>
        <div className="absolute top-0 right-0 left-0 bottom-0 bg-linear_bg bg-opacity-[0.7] transition-all duration-[0.5s] opacity-0 hover:opacity-[1] flex flex-col justify-center w-full items-center p-[17px]">
          <button className="text-dark_copper py-3 text-base font-medium leading-6 bg-[#FFFFFF] max-w-[202px] w-full">
            Add to cart
          </button>
          {/* <Button children="Add to cart" varient="liquid" className="flex m-[0, auto] justify-center max-w-[202px] w-full"/> */}
          <div className="flex items-center justify-between w-full  mt-6">
            <div className="flex items-center gap-x-[2px]">
              <SvgIcon name="Shareicon" className="w-4 h-4 stroke-white" />
              <p className="text-[#FFFFFF] heading_16">Share</p>
            </div>
            <div className="flex items-center gap-x-[2px]">
              <SvgIcon name="Compareicon" className="w-4 h-4 stroke-white" />
              <p className="text-[#FFFFFF] heading_16">Compare</p>
            </div>
            <div className="flex items-center gap-x-[2px] fill-transparent ">
              <SvgIcon name="Hearticon" className="w-4 h-4 stroke-white" />
              <p className="text-[#FFFFFF] heading_16">Like</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;
