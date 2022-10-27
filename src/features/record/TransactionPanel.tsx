import { ScrollArea } from '@mantine/core';
import { Record, TreatmentEntry } from '@prisma/client';
import EntryTable, { EntryTableProps } from './EntryTable';

interface TransactionPanelProps {
	data: Record & {
		entries: TreatmentEntry[];
	};
	onActionClick: EntryTableProps['onActionClick'];
}

const TransactionPanel = ({ data, onActionClick }: TransactionPanelProps) => {
	return (
		<div className='flex flex-1 items-center justify-center overflow-hidden rounded bg-white shadow'>
			<ScrollArea className='clip-rounded relative flex h-full flex-1 bg-white shadow-lg'>
				<EntryTable entries={data?.entries ?? []} onActionClick={onActionClick} />
			</ScrollArea>
		</div>
	);
};

export default TransactionPanel;
