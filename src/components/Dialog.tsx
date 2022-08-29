import React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Cross1Icon } from '@radix-ui/react-icons';

interface DialogContentProps {
	children: React.ReactNode;
	title: React.ReactNode;
}

export const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
	({ children, title, ...props }, forwardedRef) => (
		<DialogPrimitive.Portal>
			<DialogPrimitive.Overlay className='rdx-state-open:animate-fade-in rdx-state-closed:animate-fade-out fixed inset-0 bg-black/40' />

			<DialogPrimitive.Content
				className='rdx-state-open:animate-fade-in rdx-state-closed:animate-fade-out fixed top-1/2 left-1/2 w-96 -translate-x-1/2 -translate-y-1/2 rounded bg-white p-8 shadow-sm'
				{...props}
				ref={forwardedRef}
			>
				<DialogPrimitive.Title className='mb-8 text-xl font-medium text-slate-800'>
					{title}
				</DialogPrimitive.Title>
				<DialogPrimitive.Close className='group absolute top-8 right-8' aria-label='Close'>
					<Cross1Icon className='h-5 w-5 text-slate-800 transition-colors group-hover:text-slate-600' />
				</DialogPrimitive.Close>
				{children}
			</DialogPrimitive.Content>
		</DialogPrimitive.Portal>
	)
);

DialogContent.displayName = 'DialogContent';

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
