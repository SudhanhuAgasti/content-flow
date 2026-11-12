import React, { forwardRef } from 'react';

export const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      icon: Icon,
      type = 'text',
      className = '',
      id,
      name,
      required,
      ...props
    },
    ref
  ) => {
    const inputId = id || name;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold tracking-wide uppercase text-obsidian-300"
          >
            {label} {required && <span className="text-emperor-500">*</span>}
          </label>
        )}

        <div className="relative rounded-xl">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-obsidian-400">
              <Icon className="w-4 h-4" />
            </div>
          )}

          <input
            id={inputId}
            name={name}
            type={type}
            ref={ref}
            className={`w-full rounded-xl bg-obsidian-900 border text-white placeholder-obsidian-500 text-sm py-2.5 transition-colors focus:outline-none ${
              Icon ? 'pl-10 pr-4' : 'px-4'
            } ${
              error
                ? 'border-rose-500/80 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                : 'border-obsidian-700/80 hover:border-obsidian-600 focus:border-emperor-500 focus:ring-1 focus:ring-emperor-500'
            } ${className}`}
            {...props}
          />
        </div>

        {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}
        {helperText && !error && (
          <p className="text-xs text-obsidian-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

