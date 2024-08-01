// src/components/Button.js
import React, { ReactNode } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "success" | "danger";
  size?: "md" | "sm" | "lg";
  disabled?: boolean;
  className?: string;
};
const Button = ({
  children,
  onClick,
  className,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
}: ButtonProps) => {
  const baseClasses =
    "inline-flex items-center justify-center border border-transparent font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
    success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };

  const sizes = {
    sm: "px-2.5 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const buttonClasses = classNames(
    baseClasses,
    variants[variant],
    sizes[size],
    {
      "opacity-50 cursor-not-allowed": disabled,
    },
    className
  );

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  variant: PropTypes.oneOf(["primary", "secondary", "success", "danger"]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  disabled: PropTypes.bool,
};

export default Button;
