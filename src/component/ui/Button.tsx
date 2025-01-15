import { cn } from "@/app/utils/cn";
import Link from "next/link";
import React from "react";
import { Buttonprops } from "@/interFaces/interface";
import SvgIcon from "../Icons";

const Button: React.FC<Buttonprops> = ({
  children,
  btnclass,
  btntype,
  className,
  icon,
  navroute,
  onCLick,
  varient,
}) => {
  let variantClasses: string | undefined = "";

  switch (varient) {
    case "solid":
      variantClasses = `py-[17px] px-[48px] bg-dark_copper text-white  capitalize heading_20  ${className}`;
      break;
    case "liquid":
      variantClasses = `text-dark_copper py-3 heading_20 bg-white max-w-[202px] w-full ${className}`;
      break;
    case "light":
      variantClasses = `text-dark_copper border-[1px] border-dark_copper py-3 capitalize max-w-[245px] w-full heading_20 ${className}`;
      break;
    case "transparent":
      variantClasses = ` py-[15px] px-[47px] heading_20 text-black border-[1px] border-black rounded-[10px] capitalize ${className}`;
      break;
  }
  return (
    <div>
      {navroute !== undefined || null ? (
        <Link href={`${navroute}`} className={`${btnclass}`}>
          <button
            type={btntype}
            onClick={onCLick}
            className={` flex items-center justify-center gap-x-[10px]  ${variantClasses}`}
          >
            {icon && <SvgIcon height={16} width={16} name="Addicon" />}
            {children}
          </button>
        </Link>
      ) : (
        <button
          type={btntype}
          onClick={onCLick}
          className={` ${variantClasses}`}
        >
          {children}
        </button>
      )}
    </div>
  );
};

export default Button;
