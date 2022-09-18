import { Drawer, Avatar } from '@mantine/core';
import { ArchiveIcon, GearIcon, ExitIcon } from '@radix-ui/react-icons';
import { signOut, useSession } from 'next-auth/react';
import { join } from 'tailwind-merge';
import ActiveLink from '../../components/ActiveLink';
import Button from '../../components/Button';

interface MainDrawerProps {
	isDrawerOpen: boolean;
	onClose: () => void;
}

const MainDrawer = ({ isDrawerOpen, onClose }: MainDrawerProps) => {
	const { data: session } = useSession();

	return (
		<Drawer
			title='Dental Record'
			classNames={{
				header: join(`items-center`),
				title: join(`text-xl font-medium text-slate-800`),
				drawer: join(`p-8 rounded-r flex flex-col`),
				closeButton: join(`[&>svg]:w-5 [&>svg]:h-5 text-slate-600`),
			}}
			opened={isDrawerOpen}
			onClose={onClose}
		>
			<div className='flex flex-1 flex-col items-center mt-8'>
				<div className='flex flex-col w-full gap-1'>
					<ActiveLink
						href='/'
						childRoutes={['/records']}
						icon={<ArchiveIcon className='h-5 w-5 text-inherit' />}
					>
						Records
					</ActiveLink>
					<ActiveLink isAdminRoute href='/settings' icon={<GearIcon className='h-5 w-5 text-inherit' />}>
						Settings
					</ActiveLink>
				</div>
				<div className='flex flex-col gap-4 mt-auto w-full'>
					<div className='flex gap-4 items-center justify-center'>
						<Avatar src={session?.user?.image} radius='xl' />
						<p className='text-slate-500'>{session?.user?.name}</p>
					</div>
					<Button
						onClick={() => signOut({ redirect: true })}
						variant='secondary'
						className='w-full justify-center'
						classNames={{ inner: join(`gap-4`) }}
						leftIcon={<ExitIcon className='h-5 w-5' />}
					>
						Logout
					</Button>
				</div>
			</div>
		</Drawer>
	);
};

export default MainDrawer;
