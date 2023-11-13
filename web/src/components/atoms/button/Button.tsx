import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children?: React.ReactNode;
}

const Button = ({ className = '', children, ...buttonAttributes }: ButtonProps) => {
  return (
    <button
      type="button"
      className={`hover:bg-indigo-300/50 rounded p-2 ${className}`}
      {...buttonAttributes}
    >
      {children}
    </button>
  );
};

export default Button;
