import Image from 'next/image';
import { twMerge } from 'tailwind-merge';

interface EmptyOverlayProps {
	imageSrc: string;
	imageAlt: string;
	title: string;
	description: string;
	classes?: Partial<{ container: string; label: string }>;
}

const EmptyOverlay = ({ imageSrc, imageAlt, description, title, classes }: EmptyOverlayProps) => {
	return (
		<div className={twMerge('flex flex-col p-6', classes?.container)}>
			<Image src={imageSrc} width={384} height={384} alt={imageAlt} />
			<span className={twMerge('-mt-10 flex flex-col items-center gap-1', classes?.label)}>
				<h1 className='text-xl text-primary-700'>{title}</h1>
				<p className='text-center text-primary-500'>{description}</p>
			</span>
		</div>
	);
};

export default EmptyOverlay;
