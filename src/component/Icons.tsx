import React from 'react';
import Account from '../../public/icons/account.svg'; // SVG as React component
import Hearticon from "../../public/icons/Heart.svg"
import Share from "../../public/icons/share.svg"
import Comapre from "../../public/icons/compare.svg"
interface SvgIconProps {
    name: keyof typeof ICONS;
    width?: number;
    height?: number;
    className?: string;
    fill?: string; // Optional fill color
}

// Add React SVG components or static paths
const ICONS = {
    Account: Account,
    Hearticon:Hearticon,
    Share:Share,
    Comapre:Comapre
    // other icons...
};


const SvgIcon: React.FC<SvgIconProps> = ({ name, width = 24, height = 24, className = '', fill = 'currentColor' }) => {
    const IconComponentOrPath = ICONS[name];

    if (!IconComponentOrPath) {
        console.error(`Icon "${name}" does not exist in the icon set`);
        return null;
    }

    if (typeof IconComponentOrPath === 'string') {
        // For static SVG paths, we cannot modify fill directly unless inlined
        return (
            <img
                src={IconComponentOrPath}
                alt={`${name} icon`}
                width={width}
                height={height}
                className={className}
            />
        );
    } else {
        // For React components, pass the fill color as a prop or use class
        const SvgComponent = IconComponentOrPath;
        return <SvgComponent className={className} width={width} height={height} fill={fill} />;
    }
};

export default SvgIcon;