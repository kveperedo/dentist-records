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

const MyApp: AppType = ({ Component, pageProps: { session, ...pageProps } }) => {
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
								title: 'text-base text-slate-700',
								description: 'text-sm text-slate-500',
								icon: 'bg-transparent mr-2',
								closeButton: '[&>svg]:w-5 [&>svg]:h-5 text-slate-600',
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
								title: `text-xl font-medium text-slate-800`,
								close: `[&>svg]:w-5 [&>svg]:h-5 text-slate-600 focus-visible:outline-slate-700`,
								modal: `p-8`,
							},
							centered: true,
						}}
					>
						<Component {...pageProps} />
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
			// queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
		};
	},
	/**
	 * @link https://trpc.io/docs/ssr
	 */
	ssr: false,
})(MyApp);
