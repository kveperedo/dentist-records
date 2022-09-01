import React from 'react';
import { TextInput as MantineTextInput, TextInputProps as MantineTextInputProps } from '@mantine/core';
import { twMerge } from 'tailwind-merge';

interface TextInputProps extends Omit<MantineTextInputProps, 'icon' | 'rightSection'> {
	leftIcon?: React.ReactNode;
	rightIcon?: React.ReactNode;
}

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps & React.ComponentPropsWithoutRef<'input'>>(
	({ classNames, leftIcon, rightIcon, ...props }, ref) => {
		return (
			<MantineTextInput
				unstyled
				classNames={{
                    root: twMerge(`flex flex-col gap-1`, classNames?.root),
					label: twMerge(`text-sm text-slate-700`, classNames?.label),
					required: twMerge(`text-slate-900`, classNames?.required),
					wrapper: twMerge(`relative`, classNames?.wrapper),
					input: twMerge(
						`
                        w-full rounded border-2 border-slate-200 bg-white py-[6px] px-4
                        font-poppins text-base text-slate-500 transition-colors 
                        hover:border-slate-400 focus:border-slate-600 focus-visible:outline-none
                        `,
						leftIcon && 'pl-10',
						rightIcon && 'pr-10',
						classNames?.input
					),
					icon: twMerge(`absolute right-0 top-0 h-full w-10`, classNames?.icon),
					rightSection: twMerge(`absolute right-0 top-0 h-full w-10`, classNames?.rightSection),
				}}
				{...props}
				icon={leftIcon}
				rightSection={rightIcon}
				ref={ref}
			/>
		);
	}
);
TextInput.displayName = 'TextInput';

export default TextInput;
