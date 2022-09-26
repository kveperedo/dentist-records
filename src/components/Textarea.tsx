import React from 'react';
import { Textarea as MantineTextarea, TextareaProps as MantineTextareaProps } from '@mantine/core';
import { twMerge } from 'tailwind-merge';

const Textarea = React.forwardRef<HTMLTextAreaElement, MantineTextareaProps>(({ classNames, ...props }, ref) => {
	return (
		<MantineTextarea
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
					props.readOnly &&
						`
            border-transparent border-b-slate-200 px-0 hover:border-transparent
            hover:border-b-slate-400 focus:border-transparent focus:border-b-slate-600
            `,
					classNames?.input
				),
				icon: twMerge(`absolute right-0 top-0 h-full w-10`, classNames?.icon),
				rightSection: twMerge(`absolute right-0 top-0 h-full w-10`, classNames?.rightSection),
			}}
			ref={ref}
			{...props}
		/>
	);
});
Textarea.displayName = 'Textarea';

export default Textarea;
