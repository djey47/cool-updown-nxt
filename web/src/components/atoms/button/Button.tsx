import classNames from 'classnames';
import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children?: React.ReactNode;
  isClickable?: boolean;
}

const Button = ({ className = '', children, isClickable = true, ...buttonAttributes }: ButtonProps) => {
  const buttonClassNames = classNames(
    className,
    'rounded',
    'p-2',
    {
      'hover:bg-indigo-300/50': isClickable,
      'cursor-pointer': isClickable,
      'cursor-default': !isClickable,      
    },
  );
  return (
    <button
      type="button"
      className={buttonClassNames}
      {...buttonAttributes}
    >
      {children}
    </button>
  );
};

export default Button;
