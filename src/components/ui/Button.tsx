import type { ButtonHTMLAttributes } from 'react';
import { Spinner } from './Spinner';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
}

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  secondary:
    'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700',
  ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
};

const BASE_STYLES =
  'inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

export function Button({
  variant = 'primary',
  isLoading = false,
  disabled,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={`${BASE_STYLES} ${VARIANT_STYLES[variant]} ${className ?? ''}`.trim()}
    >
      {isLoading && <Spinner size="sm" />}
      {children}
    </button>
  );
}
