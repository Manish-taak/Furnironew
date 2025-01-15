import { Dispatch, ReactNode, SetStateAction } from "react";

// Define the type for the props
export interface AccountIconProps extends React.SVGProps<SVGSVGElement> {
    width?: number;
    height?: number;
    fill?: string;
}

export interface Cardprops {
bgimage?:any;
tittle?:string;
description?:string;
price?:number,
oldprice?:string,
discount?:number,
}

export type buttonvariant =
  | "solid"
  | "liquid"
  | "light"
  | "transparent"

export  interface Buttonprops{
    children:ReactNode,
    varient?:buttonvariant,
    className?:string,
    onCLick?:()=>void,
    icon?:boolean,
    btntype?:"button" | "submit" | "reset",
    navroute?:string,
    btnclass?:string
}

export interface inputtype {
    type?: string;
    name?: string;
    id?: string;
    inputclass?: string;
    placeholder?: string;
    className?: string;
    inputparent?: string;
    show?: boolean;
    showtype?: boolean;
    setshow?: Dispatch<SetStateAction<boolean>>;
    label: string;
    error?: string;
    [key: string]: any; // to allow additional props
  }
  
  export interface option {
    id: number;
    name: string;
    logo?: string;
  }
  
  export interface inputselect {
    label?: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    options: option[];
    error?: string;
  }

  export interface benefitProps {
    tittle?:string,
    
  }