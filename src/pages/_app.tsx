// src/pages/_app.tsx
import { withTRPC } from '@trpc/next';
import type { AppRouter } from '../server/router';
import type { AppType } from 'next/dist/shared/lib/utils';
import superjson from 'superjson';
import { SessionProvider } from 'next-auth/react';
import '../styles/globals.css';
import { MantineProvider } from '@mantine/core';
import { emotionCache } from '../styles/emotion-cache';
import { ModalsProvider } from '@mantine/modals';
import { NotificationsProvider } from '@mantine/notifications';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import MainDrawer from '../features/shared/MainDrawer';
import Header from '../components/Header';
import { join } from 'tailwind-merge';

export interface AppProps {
	openDrawer: () => void;
}

const MyApp: AppType = ({ Component, pageProps: { session, ...pageProps } }) => {
	const router = useRouter();
	const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

	useEffect(() => {
		setIsDrawerOpen(false);
	}, [router.asPath]);

	const openDrawer = () => {
		setIsDrawerOpen(true);
	};

	const closeDrawer = () => {
		setIsDrawerOpen(false);
	};

	return (
		<SessionProvider session={session}>
			<MantineProvider
				withGlobalStyles
				withNormalizeCSS
				theme={{
					fontFamily: 'Poppins',
					cursorType: 'pointer',
					loader: 'bars',
					components: {
						Notification: {
							classNames: {
								root: 'shadow-sm p-3 before:hidden',
								title: 'text-base text-primary-700',
								description: 'text-sm text-primary-500',
								icon: 'bg-transparent mr-2',
								closeButton: '[&>svg]:w-5 [&>svg]:h-5 text-primary-600',
							},
						},
						Menu: {
							classNames: {
								dropdown: 'shadow-sm p-2 border-zinc-200',
								item: 'transition-colors',
							},
							defaultProps: {
								transition: 'fade',
								withArrow: true,
								withinPortal: true,
							},
						},
						Tabs: {
							classNames: {
								root: 'flex flex-col flex-1 h-full',
								tabsList: 'flex items-stretch shadow-sm divide-x divide-zinc-200',
								tab: join(
									`
									flex-1 rounded-none bg-white py-4 text-sm
									first:rounded-l last:rounded-r [&[data-active]]:bg-primary-200 [&[data-active]]:text-primary-700
									`
								),
								panel: 'flex-1 mt-6 overflow-auto',
							},
							defaultProps: {
								unstyled: true,
								keepMounted: false,
							},
						},
					},
				}}
				emotionCache={emotionCache}
			>
				<NotificationsProvider>
					<ModalsProvider
						modalProps={{
							classNames: {
								title: `text-xl font-medium text-primary-800`,
								close: `[&>svg]:w-5 [&>svg]:h-5 text-primary-600 focus-visible:outline-primary-700`,
								modal: `flex flex-col p-6`,
								body: `flex-1`,
							},
							centered: true,
						}}
					>
						{<Header openDrawer={openDrawer} />}
						<Component {...pageProps} openDrawer={openDrawer} />
						<MainDrawer onClose={closeDrawer} isDrawerOpen={isDrawerOpen} />
					</ModalsProvider>
				</NotificationsProvider>
			</MantineProvider>
		</SessionProvider>
	);
};

const getBaseUrl = () => {
	if (typeof window !== undefined) return ''; // browser should use relative url
	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
	return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export default withTRPC<AppRouter>({
	config() {
		/**
		 * If you want to use SSR, you need to use the server's full URL
		 * @link https://trpc.io/docs/ssr
		 */
		const url = `${getBaseUrl()}/api/trpc`;

		return {
			url,
			transformer: superjson,
			/**
			 * @link https://react-query.tanstack.com/reference/QueryClient
			 */
			queryClientConfig: {
				defaultOptions: { queries: { refetchOnWindowFocus: process.env.NODE_ENV !== 'development' } },
			},
		};
	},
	/**
	 * @link https://trpc.io/docs/ssr
	 */
	ssr: false,
})(MyApp);
