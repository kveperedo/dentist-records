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
			position='right'
			title='Dental Record'
			classNames={{
				header: join(`items-center`),
				title: join(`text-xl font-medium text-primary-800`),
				drawer: join(`flex flex-col rounded-l p-6`),
				closeButton: join(`text-primary-600 [&>svg]:h-5 [&>svg]:w-5`),
			}}
			opened={isDrawerOpen}
			onClose={onClose}
		>
			<div className='mt-8 flex flex-1 flex-col items-center'>
				<div className='flex w-full flex-col gap-1'>
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
				<div className='mt-auto flex w-full flex-col gap-4'>
					<div className='flex items-center justify-center gap-4'>
						<Avatar src={session?.user?.image} radius='xl' />
						<p className='text-primary-500'>{session?.user?.name}</p>
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
