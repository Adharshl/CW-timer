import React from "react";

interface ButtonProps {
    label: string | React.ReactNode;
    onClick?: () => void;
    variant?: "primary" | "secondary" | "tertiary" | "outline" | "danger";
    disabled?: boolean;
    className?: string;
    type?: "button" | "submit" | "reset";
    tooltip?: string;
}

const Button: React.FC<ButtonProps> = ({
    label,
    onClick,
    variant = "primary",
    disabled = false,
    className = "",
    type = "button",
    tooltip
}) => {
    const baseStyles = "px-4 py-2 transition-colors";

    const variantStyles = {
        primary: 'px-4 py-2 text-sm text-white rounded-md bg-blue-600 hover:bg-blue-700',
        secondary: "p-3 rounded-full text-blue-500 hover:bg-blue-200",
        tertiary: 'px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200',
        outline: "text-gray-700 rounded-md hover:bg-gray-100",
        danger: "p-2 rounded-full hover:bg-red-50 text-red-500"
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={` ${className} ${baseStyles} ${variantStyles[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            title={tooltip}
        >
            {label}
        </button>
    );
};

export default Button;
