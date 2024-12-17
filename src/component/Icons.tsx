import React from 'react';
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
import Logo from "@/../public/icons/logo.svg"
interface SvgIconProps {
    name: keyof typeof ICONS; // The icon name (must be a key in ICONS)
    width?: number;           // Custom width of the icon
    height?: number;          // Custom height of the icon
    className?: string;       // Additional classes for styling
    fill?: string;            // Fill color for the icon
}

// Object containing the imported SVG components
const ICONS = {
    Account: Account1,
    Cart: Cart,
    Addicon:Addicon,
    Hearticon:Hearticon,
    Compareicon:Compareicon,
    Shareicon:Shareicon,
    Downarrow:Downarrow,
    Trophy:Trophy,
    Warranty:Warranty,
    Shipping:Shipping,
    Contact:Contact,
    Logo:Logo


};

// The SvgIcon component which dynamically renders the correct SVG icon
const SvgIcon: React.FC<SvgIconProps> = ({
    name,
    width = 24, // Default width
    height = 24, // Default height
    className = '', // Default class name
    fill = 'currentColor' // Default fill color
}) => {
    // Retrieve the correct icon from the ICONS object
    const IconComponent = ICONS[name];

    if (!IconComponent) {
        // Log an error if the icon name is invalid
        console.error(`Icon "${name}" does not exist in the icon set.`);
        return null; // Optionally, return a default fallback icon here
    }

    // Render the SVG component with dynamic props
    return (
        <IconComponent
            className={className} // Apply custom classes
            width={width}         // Custom width
            height={height}       // Custom height
            fill={fill}           // Fill color
        />
    );
};

export default SvgIcon;