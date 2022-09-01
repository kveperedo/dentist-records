import React from 'react';
import { twMerge } from 'tailwind-merge';
import { Button as MantineButton, ButtonProps as MantineButtonProps } from '@mantine/core';

interface ButtonProps extends MantineButtonProps {
	size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps & React.ComponentPropsWithoutRef<'button'>>(
	({ size = 'md', classNames, className, ...props }, ref) => {
		return (
			<MantineButton
				unstyled
				ref={ref}
				{...props}
				classNames={{
					root: twMerge(
						`
						flex items-center rounded border border-slate-600 
						bg-slate-600 text-base font-normal text-slate-50 
						outline-none transition-all hover:bg-slate-700
						active:translate-y-[1px] active:bg-slate-800
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
