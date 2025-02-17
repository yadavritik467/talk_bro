import React from "react";

interface ButtonProps {
    children: React.ReactNode;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    type?: "button" | "submit" | "reset";
    variant?: "primary" | "secondary" | "danger" | "outline" | "dark"; // Different styles
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    className?: string;
    isLoading?: boolean;
    icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    type = "button",
    variant = "primary",
    size = "md",
    disabled = false,
    className = "",
    isLoading = false,
    icon,
}) => {
    // Tailwind styles based on variant
    const baseStyles = "font-medium rounded-lg flex items-center justify-center gap-2 transition-all";
    const variantStyles = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300",
        secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-4 focus:ring-gray-300",
        dark: "bg-gray-800 text-white hover:bg-gray-800 focus:ring-4 focus:ring-gray-300",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-4 focus:ring-red-300",
        outline: "border border-gray-600 text-gray-600 hover:bg-gray-100 focus:ring-4 focus:ring-gray-300",
    };

    // Tailwind styles based on size
    const sizeStyles = {
        sm: "text-sm px-3 py-1.5",
        md: "text-md px-4 py-2",
        lg: "text-lg px-6 py-3",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabled ? "opacity-50 cursor-not-allowed" : ""
                } ${className}`}
        >
            {isLoading ? (
                <span className="animate-spin w-5 h-5 border-4 border-white border-t-transparent rounded-full"></span>
            ) : (
                <>
                    {icon && <span>{icon}</span>}
                    {children}
                </>
            )}
        </button>
    );
};

export default Button;
