import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { MouseEventHandler } from 'react';
import { twMerge } from 'tailwind-merge';

interface ActiveLinkProps {
	children: React.ReactNode;
	href: string;
	childRoutes?: string[];
	isAdminRoute?: boolean;
	icon: React.ReactNode;
}

const ActiveLink = ({ children, href, isAdminRoute = false, icon, childRoutes = [] }: ActiveLinkProps) => {
	const router = useRouter();
	const { data: session } = useSession();

	const handleClick: MouseEventHandler<HTMLAnchorElement> = (event) => {
		event.preventDefault();
		router.push(href);
	};

	if (session?.user?.role === 'user' && isAdminRoute) {
		return null;
	}

	const isMatchedRoute = router.asPath === href || childRoutes.some((route) => router.asPath.includes(route));

	return (
		<span
			onClick={handleClick}
			className={twMerge(
				`
                    w-full text-primary-600 rounded p-4 flex items-center gap-4 justify-between
                    hover:bg-primary-100 active:bg-primary-300 transition-colors cursor-pointer
                    `,
				isMatchedRoute && `text-primary-50 font-semibold bg-primary-300 hover:bg-primary-300`
			)}
		>
			{children}
			{icon}
		</span>
	);
};

export default ActiveLink;
