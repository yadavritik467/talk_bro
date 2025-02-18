import React from "react";

interface CustomInputProps {
  className?: string;
  prefixIcon?: React.ReactNode;
  onChangeHandler?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  name?: string;
  id?: string;
  type?: string;
  placeholder?: string;
}

const CustomInput: React.FC<CustomInputProps> = ({
  className = "",
  prefixIcon,
  onChangeHandler,
  value,
  name,
  id,
  type = "text",
  placeholder = "Enter text...",
}) => {
  return (
    <div className="relative">
      {/* Prefix Icon */}
      {prefixIcon && (
        <div className="absolute inset-y-0 start-0 flex items-center ps-3.5">
          {prefixIcon}
        </div>
      )}

      {/* Input Field */}
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChangeHandler}
        className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
          prefixIcon ? "ps-9" : "ps-3"
        } dark:bg-gray-200 dark:border-gray-400 dark:placeholder-gray-400 dark:text-gray-700 dark:focus:ring-blue-500 dark:focus:border-blue-500 ${className}`}
        placeholder={placeholder}
      />
    </div>
  );
};

export default CustomInput;
