import React from 'react';
import { NumberInput as MantineNumberInput, NumberInputProps as MantineNumberInputProps } from '@mantine/core';
import { twMerge } from 'tailwind-merge';

const NumberInput = React.forwardRef<HTMLInputElement, MantineNumberInputProps>(({ classNames, ...props }, ref) => {
	return (
		<MantineNumberInput
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
            h-10
            `,
					props.readOnly &&
						`
            border-transparent border-b-slate-200 px-0 hover:border-transparent
            hover:border-b-slate-400 focus:border-transparent focus:border-b-slate-600
            `,
					classNames?.input
				),
				rightSection: twMerge(`m-[1px] `, classNames?.rightSection),
                control: twMerge(`enabled:text-slate-500`, classNames?.control),
			}}
			ref={ref}
			{...props}
		/>
	);
});
NumberInput.displayName = 'NumberInput';

export default NumberInput;