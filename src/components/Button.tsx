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
						flex items-center rounded border text-base font-normal text-primary-50 
						outline-none transition-all hover:bg-primary-700 active:translate-y-[1px] 
						active:bg-primary-800
						`,
						variant === 'primary' &&
							`
							border-primary-600 bg-primary-600 hover:bg-primary-700
							active:bg-primary-80
							`,
						variant === 'secondary' &&
							`
							border-transparent bg-primary-200 text-primary-700 
							hover:bg-primary-300 active:bg-primary-400
							`,
						variant === 'ghost' &&
							`
							border-transparent bg-transparent text-primary-600
							hover:border-primary-600 hover:bg-primary-100 active:bg-primary-200
							`,
						variant === 'outlined' &&
							`
							border:bg-primary-400 border-primary-100 bg-transparent text-primary-700 
							hover:border-primary-300 hover:bg-transparent active:bg-primary-100
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
