import React, { forwardRef } from 'react';

export const Textarea = forwardRef(
  (
    {
      label,
      error,
      helperText,
      rows = 4,
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

        <textarea
          id={inputId}
          name={name}
          rows={rows}
          ref={ref}
          className={`w-full rounded-xl bg-obsidian-900 border text-white placeholder-obsidian-500 text-sm px-4 py-3 transition-colors focus:outline-none resize-y ${
            error
              ? 'border-rose-500/80 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
              : 'border-obsidian-700/80 hover:border-obsidian-600 focus:border-emperor-500 focus:ring-1 focus:ring-emperor-500'
          } ${className}`}
          {...props}
        />

        {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}
        {helperText && !error && (
          <p className="text-xs text-obsidian-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

