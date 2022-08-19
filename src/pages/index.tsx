import { PlusIcon } from '@radix-ui/react-icons';
import type { NextPage } from 'next';
import Head from 'next/head';
import { trpc } from '../utils/trpc';

const Home: NextPage = () => {
	const hello = trpc.useQuery(['example.hello', { text: 'from tRPC' }]);

	return (
		<>
			<Head>
				<title>Create T3 App</title>
				<meta name='description' content='Generated by create-t3-app' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<div className='flex min-h-screen'>
				<nav className='w-48 p-4 shadow'>Dental Records</nav>
				<main className='flex flex-1 flex-col bg-slate-100 p-4'>
					<div className='mb-4 flex items-center'>
						<h1 className='text-xl font-bold'>Dental Records</h1>
						<button className='ml-auto flex items-center gap-2 bg-violet-100 py-2 px-4 font-medium text-violet-600 transition-all hover:bg-violet-200 active:bg-violet-300'>
							<PlusIcon className='h-4 w-4 text-base text-inherit' />
							Add Record
						</button>
					</div>
					<div className='flex-1 bg-white p-4'>Table</div>
				</main>
			</div>
		</>
	);
};

export default Home;