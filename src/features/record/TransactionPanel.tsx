import { ScrollArea } from '@mantine/core';
import { Record, TreatmentEntry } from '@prisma/client';
import { twMerge } from 'tailwind-merge';
import EntryTable, { EntryTableProps } from './EntryTable';

interface TransactionPanelProps {
	data: Record & {
		entries: TreatmentEntry[];
	};
	onActionClick: EntryTableProps['onActionClick'];
	className?: string;
}

const TransactionPanel = ({ data, onActionClick, className }: TransactionPanelProps) => {
	return (
		<div
			className={twMerge(
				'flex flex-1 items-center justify-center overflow-hidden rounded bg-white shadow',
				className
			)}
		>
			<ScrollArea className='clip-rounded relative flex h-full flex-1 bg-white shadow-lg'>
				<EntryTable entries={data?.entries ?? []} onActionClick={onActionClick} />
			</ScrollArea>
		</div>
	);
};

export default TransactionPanel;
