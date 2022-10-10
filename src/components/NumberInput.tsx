import React from 'react';
import { NumberInput as MantineNumberInput, NumberInputProps as MantineNumberInputProps } from '@mantine/core';
import { twMerge } from 'tailwind-merge';

const NumberInput = React.forwardRef<HTMLInputElement, MantineNumberInputProps>(({ classNames, ...props }, ref) => {
	return (
		<MantineNumberInput
			classNames={{
				root: twMerge(`flex flex-col gap-1`, classNames?.root),
				label: twMerge(`text-sm text-primary-700`, classNames?.label),
				required: twMerge(`text-primary-900`, classNames?.required),
				wrapper: twMerge(`relative`, classNames?.wrapper),
				input: twMerge(
					`
            h-10 w-full rounded border-2 border-primary-100 bg-white py-[6px]
            px-4 font-poppins text-base text-primary-500 
            transition-colors hover:border-primary-400 focus:border-primary-600
            focus-visible:outline-none
            `,
					props.readOnly &&
						`
            border-transparent border-b-primary-200 px-0 hover:border-transparent
            hover:border-b-primary-400 focus:border-transparent focus:border-b-primary-600
            `,
					classNames?.input
				),
				rightSection: twMerge(`m-[1px] `, classNames?.rightSection),
				control: twMerge(`enabled:text-primary-500`, classNames?.control),
				error: twMerge(`text-red-400`, classNames?.error),
			}}
			ref={ref}
			{...props}
		/>
	);
});
NumberInput.displayName = 'NumberInput';

export default NumberInput;
