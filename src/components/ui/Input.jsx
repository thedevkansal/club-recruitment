import React from 'react';
import { twMerge } from 'tailwind-merge';
import { AlertCircle } from 'lucide-react';

const Input = ({
  label,
  error,
  className = '',
  icon: Icon,
  helperText,
  ...props
}) => {
  const inputClasses = twMerge(
    'appearance-none relative block w-full px-4 py-3 border placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-0 focus:z-10 sm:text-sm transition-all duration-200 bg-white',
    error
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
      : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 hover:border-gray-400',
    Icon && 'pl-12',
    className
  );

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-gray-700">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          className={inputClasses}
          {...props}
        />
      </div>
      
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
      
      {error && (
        <p className="text-sm text-red-600 flex items-center mt-1">
          <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
