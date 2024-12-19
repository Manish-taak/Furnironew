
import React from "react";
import Cart from '../../public/icons/cart.svg';
import Account1 from '../../public/icons/account1.svg';
import Addicon from '../../public/icons/add.svg'
import Hearticon from "../../public/icons/Heart.svg"
import Compareicon from "../../public/icons/compare.svg"
import Shareicon from "../../public/icons/share.svg"
import Downarrow from "@/../public/icons/downarrow.svg"
import Trophy from "@/../public/icons/trophy.svg"
import Warranty from "@/../public/icons/guarantee.svg"
import Shipping from "@/../public/icons/shipping.svg"
import Contact from "@/../public/icons/contact.svg"
import { cn } from "@/app/utils/cn";

// Map icon names to components
const icons = {
    account: Account1,
    cart: Cart,
    addicon: Addicon,
    hearticon: Hearticon,
    compareicon: Compareicon,
    shareicon: Shareicon,
    downarrow: Downarrow,
    trophy: Trophy,
    warranty: Warranty,
    shipping: Shipping,
    contact: Contact,
};

export type IconName = keyof typeof icons;

type IconProps = {
    name: IconName;
    size?: number;
    className?: string;
    color?: string;
    onClick?: () => void
};

const Icon: React.FC<IconProps> = ({ name, size = 20, color, className, onClick }) => {
    const IconComponent = icons[name];
    return (
        <IconComponent
            width={size}
            height={size}
            fill={color ? color : "transparent"}
            className={cn`${className}`}
            onClick={onClick}
        />
    );
};

export default Icon;
