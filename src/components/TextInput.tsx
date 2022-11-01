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
					label: twMerge(`text-sm text-primary-700`, classNames?.label),
					required: twMerge(`text-primary-900`, classNames?.required),
					wrapper: twMerge(`relative`, classNames?.wrapper),
					input: twMerge(
						`
                        w-full rounded border-2 border-primary-100 bg-white py-[6px] px-4
                        font-poppins text-base text-primary-500 transition-colors 
                        hover:border-primary-400 focus:border-primary-600 focus-visible:outline-none
                        `,
						props.readOnly &&
							`
						border-transparent border-b-primary-200 px-0 hover:border-transparent
						hover:border-b-primary-400 focus:border-transparent focus:border-b-primary-600
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
