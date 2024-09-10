import React from 'react';
import Account from '../../public/icons/account'; // SVG as React component

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
