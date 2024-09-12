import React from "react";
import img from "@/../public/images/furniture15.png";
import { Cardprops } from "@/interFaces/interface";
// const Card = ({ bgimage, name, description, price }: Cardprops) => {
const Card = () => {
  return (
    <div>
      <div>
        <div>
          <img src={String(img.src)} alt="img" />
          <div>
            <p>-30%</p>
          </div>
        </div>
        <div className=" bg-[#F4F5F7]">
          <h4 className="text-red-500">Syltherine</h4>
          <p>Stylish cafe chair</p>
          <div>
            <h5>Rp 2.500.000</h5>
            <h6>
              <del>Rp 3.500.000</del>
            </h6>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
