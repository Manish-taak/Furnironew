// Define the type for the props
export interface AccountIconProps extends React.SVGProps<SVGSVGElement> {
    width?: number;
    height?: number;
    fill?: string;
}

export interface Cardprops {
bgimage?:any;
name?:string;
description?:string;
price?:number
}