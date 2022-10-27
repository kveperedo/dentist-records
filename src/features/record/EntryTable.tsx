import { Menu } from '@mantine/core';
import { TreatmentEntry } from '@prisma/client';
import { DotsVerticalIcon, Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';
import dayjs from 'dayjs';
import Button from '../../components/Button';
import EmptyOverlay from '../../components/EmptyOverlay';
import { TableCell, TableContainer, TableHeader, TableHeaderCell, TableRow } from '../../components/Table';

const numberFormatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'PHP',
	minimumFractionDigits: 2,
});

export interface EntryTableProps {
	entries: TreatmentEntry[];
	onActionClick: (type: 'edit' | 'delete', entry: TreatmentEntry) => void;
}

const EntryTable = ({ entries, onActionClick }: EntryTableProps) => {
	if (entries.length === 0) {
		return (
			<div className='flex h-full flex-col items-center justify-center gap-4'>
				<EmptyOverlay
					imageAlt='empty transactions'
					imageSrc='/assets/empty.svg'
					title='No transactions yet'
					description='Add a transaction by clicking the button in the upper right corner!'
				/>
			</div>
		);
	}

	return (
		<TableContainer>
			<TableHeader>
				<tr>
					<TableHeaderCell className='w-2/12 break-words'>Date</TableHeaderCell>
					<TableHeaderCell className='w-4/12 break-words'>Tooth</TableHeaderCell>
					<TableHeaderCell className='w-3/12 break-words'>Service</TableHeaderCell>
					<TableHeaderCell className='w-2/12 break-words text-right'>Fees</TableHeaderCell>
					<TableHeaderCell className='w-1/12 break-words text-right'>Actions</TableHeaderCell>
				</tr>
			</TableHeader>
			<tbody>
				{entries.map((entry) => (
					<TableRow className='odd:bg-zinc-50' key={entry.id}>
						<TableCell>
							<p>{dayjs(entry.date).format('MMMM DD, YYYY')}</p>
						</TableCell>
						<TableCell>
							<p>{entry.tooth}</p>
						</TableCell>
						<TableCell>
							<p className='whitespace-pre'>{entry.service}</p>
						</TableCell>
						<TableCell className='text-right'>
							<p>{numberFormatter.format(entry.fees)}</p>
						</TableCell>
						<TableCell>
							<Menu width={150}>
								<Menu.Target>
									<Button className='m-auto p-2' variant='ghost'>
										<DotsVerticalIcon className='h-5 w-5' />
									</Button>
								</Menu.Target>

								<Menu.Dropdown>
									<Menu.Item
										className='text-slate-700 hover:bg-primary-100'
										icon={<Pencil1Icon className='h-5 w-5' />}
										onClick={() => onActionClick('edit', entry)}
									>
										Edit
									</Menu.Item>
									<Menu.Item
										className='text-red-400 hover:bg-red-100'
										icon={<TrashIcon className='h-5 w-5' />}
										onClick={() => onActionClick('delete', entry)}
									>
										Delete
									</Menu.Item>
								</Menu.Dropdown>
							</Menu>
						</TableCell>
					</TableRow>
				))}
			</tbody>
		</TableContainer>
	);
};

export default EntryTable;
