import React from 'react';
import { Label } from '@radix-ui/react-label';
import { twMerge } from 'tailwind-merge';

interface InputProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
	startIcon?: React.ReactNode;
	endIcon?: React.ReactNode;
	label?: string;
	id: string;
	classes?: {
		input?: string;
		container?: string;
	};
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ classes, label, startIcon, endIcon, id, ...props }, ref) => {
		return (
			<div className={twMerge('flex flex-col gap-1', classes?.container)}>
				{label && (
					<Label className='text-sm text-slate-700' htmlFor={id}>
						{label}
					</Label>
				)}
				<div className='relative flex-1'>
					{startIcon && <span className='absolute h-full w-10'>{startIcon}</span>}
					<input
						ref={ref}
						id={id}
						className={twMerge(
							`w-full rounded border-2 border-slate-200 bg-white py-2 px-4
                            text-slate-500 transition-colors focus:border-slate-600 focus-visible:outline-none`,
							startIcon && 'pl-10',
							endIcon && 'pr-10',
							classes?.input
						)}
						{...props}
					/>
					{endIcon && <span className='absolute right-0 top-0 h-full w-10'>{endIcon}</span>}
				</div>
			</div>
		);
	}
);

Input.displayName = 'Input';

export default Input;
