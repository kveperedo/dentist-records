import React from 'react';
import { twMerge } from 'tailwind-merge';

interface ButtonProps
	extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
	startIcon?: React.ReactNode;
	endIcon?: React.ReactNode;
	size?: 'medium' | 'small';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, size = 'medium', startIcon, endIcon, children, ...props }, ref) => {
		return (
			<button
				ref={ref}
				className={twMerge(
					`flex items-center gap-2 rounded border border-slate-600 bg-slate-600 text-slate-50 transition-all hover:bg-slate-700 active:bg-slate-800`,
					size === 'medium' && 'py-2 px-4',
					size === 'small' && 'py-1 px-4 text-sm',
					className
				)}
				{...props}
			>
				{startIcon}
				{children}
				{endIcon}
			</button>
		);
	}
);

Button.displayName = 'Button';

export default Button;
