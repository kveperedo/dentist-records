import {
	LoadingOverlay as MantineLoadingOverlay,
	LoadingOverlayProps as MantineLoadingOverlayProps,
} from '@mantine/core';
import React from 'react';
import { twMerge } from 'tailwind-merge';

const LoadingOverlay = React.forwardRef<HTMLDivElement, MantineLoadingOverlayProps>(({ className, ...props }, ref) => {
	return <MantineLoadingOverlay className={twMerge('[&_svg]:fill-slate-800', className)} {...props} ref={ref} />;
});
LoadingOverlay.displayName = 'LoadingOverlay';

export default LoadingOverlay;
