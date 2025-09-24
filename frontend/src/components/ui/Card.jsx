import React from 'react';
import { twMerge } from 'tailwind-merge';

const Card = ({
  children,
  className = '',
  hover = false,
  padding = 'normal',
  ...props
}) => {
  const baseClasses = 'bg-white rounded-2xl shadow-sm border border-gray-200 transition-all duration-200';
  
  const paddingClasses = {
    none: '',
    small: 'p-4',
    normal: 'p-6',
    large: 'p-8'
  };

  const hoverClasses = hover 
    ? 'hover:shadow-xl hover:border-indigo-200 hover:-translate-y-1 cursor-pointer'
    : '';

  const classes = twMerge(
    baseClasses,
    paddingClasses[padding],
    hoverClasses,
    className
  );

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default Card;
