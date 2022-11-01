import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Button from './Button';

interface HeaderProps {
	openDrawer: () => void;
}

const Header = ({ openDrawer }: HeaderProps) => {
	const session = useSession();

	if (!session.data) {
		return null;
	}

	return (
		<div className='flex h-16 items-center justify-center bg-primary-700 text-zinc-50'>
			<div className='container flex items-center p-6 sm:py-6 sm:px-0'>
				<Image className='bri' src='/assets/logo.png' alt='logo' width={40} height={40} />
				<h1 className='ml-4 text-lg font-medium'>Dentist Store Name Here</h1>
				<Button
					variant='ghost'
					className='ml-auto h-10 px-[7px] hover:bg-primary-800 active:bg-primary-900'
					onClick={openDrawer}
				>
					<HamburgerMenuIcon className='h-6 w-6 text-zinc-50' />
				</Button>
			</div>
		</div>
	);
};

export default Header;
