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

export interface AppProps {
	openDrawer: () => void;
}

const MyApp: AppType = ({ Component, pageProps: { session, ...pageProps } }) => {
	const router = useRouter();
	const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

	useEffect(() => {
		setIsDrawerOpen(false);
	}, [router.asPath]);

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
								modal: `p-8`,
							},
							centered: true,
						}}
					>
						<Component {...pageProps} openDrawer={() => setIsDrawerOpen(true)} />
						<MainDrawer onClose={() => setIsDrawerOpen(false)} isDrawerOpen={isDrawerOpen} />
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
