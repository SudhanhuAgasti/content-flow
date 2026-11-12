import React, { forwardRef } from 'react';

export const Select = forwardRef(
  (
    {
      label,
      error,
      options = [],
      placeholder = 'Select an option',
      className = '',
      id,
      name,
      required,
      ...props
    },
    ref
  ) => {
    const selectId = id || name;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-semibold tracking-wide uppercase text-obsidian-300"
          >
            {label} {required && <span className="text-emperor-500">*</span>}
          </label>
        )}

        <div className="relative">
          <select
            id={selectId}
            name={name}
            ref={ref}
            className={`w-full appearance-none rounded-xl bg-obsidian-900 border text-white text-sm px-4 py-2.5 transition-colors focus:outline-none cursor-pointer ${
              error
                ? 'border-rose-500/80 focus:border-rose-500'
                : 'border-obsidian-700/80 hover:border-obsidian-600 focus:border-emperor-500 focus:ring-1 focus:ring-emperor-500'
            } ${className}`}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="bg-obsidian-900 text-obsidian-500">
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                className="bg-obsidian-900 text-white py-1"
              >
                {opt.label}
              </option>
            ))}
          </select>

          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-obsidian-400">
            <svg
              className="w-4 h-4 fill-current"
              viewBox="0 0 20 20"
            >
              <path
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
                fillRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
