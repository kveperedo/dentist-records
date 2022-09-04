import React from 'react';
import { twMerge } from 'tailwind-merge';
import { Button as MantineButton, ButtonProps as MantineButtonProps } from '@mantine/core';

interface ButtonProps extends Omit<MantineButtonProps, 'variant'> {
	size?: 'sm' | 'md' | 'lg';
	variant?: 'primary' | 'secondary' | 'outlined' | 'ghost';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps & React.ComponentPropsWithoutRef<'button'>>(
	({ size = 'md', variant = 'primary', classNames, className, ...props }, ref) => {
		return (
			<MantineButton
				unstyled
				ref={ref}
				{...props}
				classNames={{
					root: twMerge(
						`
						flex items-center rounded border text-base font-normal text-slate-50 
						outline-none transition-all hover:bg-slate-700 active:translate-y-[1px] 
						active:bg-slate-800
						`,
						variant === 'primary' &&
							`
							border-slate-600 bg-slate-600 hover:bg-slate-700
							active:bg-slate-80
							`,
						variant === 'secondary' &&
							`
							border-transparent bg-slate-200 text-slate-700 
							hover:bg-slate-300 active:bg-slate-400
							`,
						variant === 'ghost' &&
							`
							border-transparent bg-transparent text-slate-600
							hover:border-slate-600 hover:bg-slate-100 active:bg-slate-200
							`,
						variant === 'outlined' &&
							`
							border:bg-slate-400 border-slate-200 bg-transparent text-slate-700 
							hover:border-slate-300 hover:bg-transparent active:bg-slate-100
							`,
						size === 'md' && 'py-[7px] px-4 text-base',
						size === 'sm' && 'py-1 px-4 text-sm',
						className,
						classNames?.root
					),
					inner: twMerge(`flex items-center gap-2`, classNames?.inner),
				}}
			>
				{props.children}
			</MantineButton>
		);
	}
);
Button.displayName = 'Button';

export default Button;
