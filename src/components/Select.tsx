import React from 'react';
import { Select as MantineSelect, SelectProps as MantineSelectProps } from '@mantine/core';
import { twMerge } from 'tailwind-merge';
import { ChevronDownIcon } from '@radix-ui/react-icons';

interface SelectProps extends Omit<MantineSelectProps, 'icon' | 'rightSection'> {
	leftIcon?: React.ReactNode;
	rightIcon?: React.ReactNode;
}

const Select = React.forwardRef<HTMLInputElement, SelectProps>(({ leftIcon, rightIcon, classNames, ...props }, ref) => {
	return (
		<MantineSelect
			rightSection={<ChevronDownIcon className='h-5 w-5 text-slate-500' />}
			classNames={{
				root: twMerge(`flex flex-col gap-1`, classNames?.root),
				label: twMerge(`text-sm font-normal text-slate-700`, classNames?.label),
				required: twMerge(`text-slate-900`, classNames?.required),
				wrapper: twMerge(`relative`, classNames?.wrapper),
				input: twMerge(
					`
                    h-auto w-full rounded border-2 border-slate-200 bg-white py-[6px]
                    px-4 text-base text-slate-500 transition-colors 
                    hover:border-slate-400 focus:border-slate-600 focus-visible:outline-none 
                    `,
					leftIcon && 'pl-10',
					rightIcon && 'pr-10',
					classNames?.input
				),
				icon: twMerge(`absolute right-0 top-0 h-full w-10`, classNames?.icon),
				rightSection: twMerge(`absolute right-0 top-0 z-0 h-full w-10`, classNames?.rightSection),
				itemsWrapper: twMerge(`p-2`, classNames?.itemsWrapper),
				item: twMerge(
					`
                    my-0.5 rounded-sm text-sm text-slate-700 transition-colors 
                    hover:bg-slate-100 [&[data-selected]]:bg-slate-500 
                    [&[data-selected]]:text-slate-50`,
					classNames?.item
				),
			}}
			{...props}
			ref={ref}
		/>
	);
});
Select.displayName = 'Select';

export default Select;
