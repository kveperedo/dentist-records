import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';
import { createStylesServer, ServerStyles } from '@mantine/next';
import { emotionCache } from '../styles/emotion-cache';

const stylesServer = createStylesServer(emotionCache);

export default class _Document extends Document {
	static async getInitialProps(ctx: DocumentContext) {
		const initialProps = await Document.getInitialProps(ctx);

		return {
			...initialProps,
			styles: [initialProps.styles, <ServerStyles html={initialProps.html} server={stylesServer} key='styles' />],
		};
	}

	render() {
		return (
			<Html className='scroll-smooth font-poppins'>
				<Head>
					<link rel='preconnect' href='https://fonts.googleapis.com' />
					<link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='true' />
					<link
						href='https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap'
						rel='stylesheet'
					/>
				</Head>
				<body id="app">
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}
