import React, { RefAttributes } from 'react';

import { showNotification as showMantineNotification, NotificationProps } from '@mantine/notifications';
import { CheckCircledIcon, CrossCircledIcon, InfoCircledIcon } from '@radix-ui/react-icons';
import { IconProps } from '@radix-ui/react-icons/dist/types';

type NotificationStatus = 'info' | 'success' | 'error';

const iconMapping: Record<
	NotificationStatus,
	{
		Icon: React.ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>;
		className: IconProps['className'];
	}
> = {
	info: { Icon: InfoCircledIcon, className: 'h-5 w-5 text-primary-500' },
	success: { Icon: CheckCircledIcon, className: 'h-5 w-5 text-green-500' },
	error: { Icon: CrossCircledIcon, className: 'h-5 w-5 text-red-500' },
};

interface ShowNotificationProps extends NotificationProps {
	status?: NotificationStatus;
}

export const showNotification = ({ status = 'info', ...props }: ShowNotificationProps) => {
	const { Icon, className: iconClassName } = iconMapping[status];

	showMantineNotification({ icon: <Icon className={iconClassName} />, ...props });
};
