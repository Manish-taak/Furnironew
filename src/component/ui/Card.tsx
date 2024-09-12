import React from "react";
import img from "@/../public/images/furniture15.png";
import { Icons } from "react-toastify";
import SvgIcon from "../Icons";
const Card = () => {
  return (
    <>
      <div className="bg-[#F4F5F7]  hover:cursor-pointer relative ">
        <div className="relative">
          <img className="w-full object-contain" src={String(img.src)} alt="img" />
          <p className="py-3 px-[5px] bg-[#E97171] text-white rounded-full absolute top-6 right-6 text-base font-medium leading-6">
            -30%
          </p>
        </div>
        <div className=" flex flex-col gap-y-2 pt-4 pl-4 pb-[30px] pr-[30px] ">
          <h4 className="text-[#3A3A3A]  font-semibold text-[24px] leading-7">
            Syltherine
          </h4>
          <p className="text-base font-medium leading-6 text-[#898989]">
            Stylish cafe chair
          </p>
          <div className="flex items-center justify-between">
            <h5 className="font-semibold text-xl leading-[30px] text-[#3A3A3A]">
              Rp 2.500.000
            </h5>
            <h6 className="text-base font-medium leading-6 text-[#898989]">
              <del>Rp 3.500.000</del>
            </h6>
          </div>
        </div>
        <div className="absolute top-0 right-0 left-0 bottom-0 bg-[#3A3A3A] bg-opacity-[0.7] transition-all duration-[0.5s] opacity-0 hover:opacity-[1] flex flex-col justify-center items-center p-[17px]">
            <button className="text-[#B88E2F] py-3 text-base font-medium leading-6 bg-[#FFFFFF] max-w-[202px] w-full">Add to cart</button>
            <div className="flex items-center justify-between w-full  mt-6">
                <div className="flex items-center">
                {/* <SvgIcon name='Account' /> */}
                <p className="text-[#FFFFFF] text-base font-medium leading-6">Share</p>
                </div>
                <div className="flex items-center">
                {/* <SvgIcon name='Account' /> */}
                <p className="text-[#FFFFFF] text-base font-medium leading-6">Compare</p>
                </div>
                <div className="flex items-center">
                {/* <SvgIcon name='Account' /> */}
                <p className="text-[#FFFFFF] text-base font-medium leading-6">Like</p>
                </div>
            </div>
        </div> 
      </div>
    </>
  );
};

export default Card;
