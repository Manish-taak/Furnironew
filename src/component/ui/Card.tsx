import React from "react";
import img from "@/../public/images/furniture15.png";
const Card = () => {
  return (
    <>
      <div>
        <img src={String(img.src)} alt="img" />
        <div>
          <p>-30%</p>
        </div>
      </div>
      <div className=" bg-[#F4F5F7] flex justify-between gap-0 ">
        <h4 className="text-red-500 text-sm ">Syltherine</h4>
        <p>Stylish cafe chair</p>
        <div>
          <h5>Rp 2.500.000</h5>
          <h6>
            <del>Rp 3.500.000</del>
          </h6>
        </div>
      </div>
    </>
  );
};

export default Card;
