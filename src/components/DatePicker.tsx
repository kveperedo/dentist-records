import React from 'react';
import { DatePicker as MantineDatePicker, DatePickerProps as MantineDatePickerProps } from '@mantine/dates';
import { twMerge } from 'tailwind-merge';

interface DatePickerProps extends Omit<MantineDatePickerProps, 'icon' | 'rightSection'> {
	leftIcon?: React.ReactNode;
	rightIcon?: React.ReactNode;
}

const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps & React.RefAttributes<HTMLInputElement>>(
	({ classNames, leftIcon, rightIcon, ...props }, ref) => {
		return (
			<MantineDatePicker
				icon={leftIcon}
				rightSection={rightIcon}
				dayClassName={(_, modifier) => twMerge(modifier.selected && `bg-slate-600`)}
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
					rightSection: twMerge(
						`
						absolute right-0 top-0 h-full w-10 [&_svg]:h-5 [&_svg]:w-5 
						[&>button:focus-visible]:outline-slate-700`,
						classNames?.rightSection
					),
					monthPickerControlActive: twMerge(`bg-slate-600`, classNames?.monthPickerControlActive),
					yearPickerControlActive: twMerge(`bg-slate-600`, classNames?.monthPickerControlActive),
				}}
				ref={ref}
				{...props}
			/>
		);
	}
);
DatePicker.displayName = 'DatePicker';

export default DatePicker;
