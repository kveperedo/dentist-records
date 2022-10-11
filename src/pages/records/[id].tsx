import { Menu, ScrollArea } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { TreatmentEntry } from '@prisma/client';
import { ArrowLeftIcon, DotsVerticalIcon, Pencil1Icon, PlusIcon, TrashIcon } from '@radix-ui/react-icons';
import dayjs from 'dayjs';
import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Button from '../../components/Button';
import EmptyOverlay from '../../components/EmptyOverlay';
import LoadingOverlay from '../../components/LoadingOverlay';
import { TableCell, TableContainer, TableHeader, TableHeaderCell, TableRow } from '../../components/Table';
import TextInput from '../../components/TextInput';
import RecordForm from '../../features/record/RecordForm';
import TransactionForm from '../../features/record/TransactionForm';
import { showRecordNotification } from '../../features/record/utils';
import { showNotification } from '../../utils/mantine';
import { capitalizeFirstLetter } from '../../utils/text';
import { trpc } from '../../utils/trpc';
import { AppProps } from '../_app';

const numberFormatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'PHP',
	minimumFractionDigits: 2,
});

interface EntryTableProps {
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
		<ScrollArea className='clip-rounded relative flex flex-1' classNames={{ viewport: 'h-full' }}>
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
		</ScrollArea>
	);
};

const getAge = (dateOfBirth: Date) => {
	const date = dayjs(dateOfBirth);
	return dayjs().diff(date, 'year');
};

const RecordPage: NextPage<AppProps> = () => {
	const router = useRouter();
	const modals = useModals();
	const id = router.query.id as string;
	const utils = trpc.useContext();
	const { status } = useSession();
	const { data, isLoading: isGetRecordLoading } = trpc.useQuery(['record.specific', id], { enabled: !!id });
	const { mutate: editRecord, isLoading: isEditRecordLoading } = trpc.useMutation(['record.edit'], {
		onSuccess: () => {
			utils.invalidateQueries(['record.specific', id]);
			showRecordNotification('editSuccess');
		},
		onError: (error) => {
			console.log(error);
			showRecordNotification('editError');
		},
	});
	const { mutate: addTransaction, isLoading: isAddTransactionLoading } = trpc.useMutation(['transaction.add'], {
		onSuccess: () => {
			utils.invalidateQueries(['record.specific', id]);
			showNotification({
				status: 'success',
				title: 'Add Transaction',
				message: "Successfully added transaction to patient's records.",
			});
		},
		onError: (error) => {
			console.log(error);
			showNotification({
				status: 'error',
				title: 'Error',
				message: "An error occurred while adding transaction to patient's records.",
			});
		},
	});
	const { mutate: deleteTransaction, isLoading: isDeleteTransactionLoading } = trpc.useMutation(
		['transaction.delete'],
		{
			onSuccess: () => {
				utils.invalidateQueries(['record.specific', id]);
				showNotification({
					status: 'success',
					title: 'Delete Transaction',
					message: 'Successfully deleted the transaction.',
				});
			},
			onError: (error) => {
				console.log(error);
				showNotification({
					status: 'error',
					title: 'Error',
					message: 'An error occurred while deleting the transaction.',
				});
			},
		}
	);
	const { mutate: editTransaction, isLoading: isEditTransactionLoading } = trpc.useMutation(['transaction.edit'], {
		onSuccess: () => {
			utils.invalidateQueries(['record.specific', id]);
			showNotification({
				status: 'success',
				title: 'Edit Transaction',
				message: 'Successfully edited the transaction.',
			});
		},
		onError: (error) => {
			console.log(error);
			showNotification({
				status: 'error',
				title: 'Error',
				message: 'An error occurred while editing the transaction.',
			});
		},
	});
	const isLoading =
		isGetRecordLoading ||
		isEditRecordLoading ||
		isAddTransactionLoading ||
		isDeleteTransactionLoading ||
		isEditTransactionLoading;

	const handleOpenTransactionForm = (entry?: TreatmentEntry) => {
		console.log(entry);

		const modalId = modals.openModal({
			title: `${entry ? 'Edit' : 'Add'} Transaction`,
			children: (
				<TransactionForm
					existingData={entry}
					onSubmit={(values) => {
						modals.closeModal(modalId);
						return entry
							? editTransaction({ ...values, id: entry.id })
							: addTransaction({ ...values, recordId: id });
					}}
					onClose={() => modals.closeModal(modalId)}
				/>
			),
			className: '[&_.mantine-Modal-modal]:w-[768px]',
		});
	};

	const handleEditRecord = () => {
		if (!data) {
			return;
		}

		const modalId = modals.openModal({
			title: 'Edit Record',
			children: (
				<RecordForm
					existingData={data}
					onSubmit={(values) => {
						modals.closeModal(modalId);
						editRecord({ id, ...values });
					}}
					onClose={() => modals.closeModal(modalId)}
				/>
			),
			className: '[&_.mantine-Modal-modal]:w-[768px]',
		});
	};

	const handleActionClick: EntryTableProps['onActionClick'] = (type, entry) => {
		if (type === 'edit') {
			handleOpenTransactionForm(entry);
		}

		if (type === 'delete') {
			const modalId = modals.openModal({
				title: 'Delete record',
				children: (
					<>
						<p className='text-primary-600'>Are you sure you want to delete this transaction?</p>
						<div className='mt-4 flex justify-end gap-4'>
							<Button variant='outlined' onClick={() => modals.closeModal(modalId)}>
								Cancel
							</Button>
							<Button
								onClick={() => {
									modals.closeModal(modalId);
									deleteTransaction(entry.id);
								}}
							>
								Delete Record
							</Button>
						</div>
					</>
				),
			});
		}
	};

	if (status === 'unauthenticated') {
		router.replace('/sign-in');
	}

	return (
		<div className='min-h-screen bg-primary-100'>
			<main className='container m-auto flex h-screen p-8'>
				<div className='relative flex w-full flex-1 flex-col gap-8'>
					<LoadingOverlay visible={isLoading} />
					{data && (
						<div className='flex h-full divide-x-2 divide-primary-200 rounded bg-white shadow-md'>
							<div className='flex flex-1 flex-col'>
								<div className='m-4 flex justify-between'>
									<Link href='/'>
										<Button
											variant='ghost'
											leftIcon={<ArrowLeftIcon className='h-5 w-5 text-primary-600' />}
										>
											Go back
										</Button>
									</Link>

									<Button
										variant='secondary'
										onClick={handleEditRecord}
										leftIcon={<Pencil1Icon className='h-5 w-5' />}
									>
										Edit Record
									</Button>
								</div>
								<ScrollArea classNames={{ root: 'my-4 flex-1 overflow-hidden' }}>
									<div className='mx-4 flex flex-col gap-4'>
										<TextInput value={data.name} label='Name' readOnly />
										<TextInput value={data.occupation} label='Occupation' readOnly />
										<TextInput value={data.address} label='Address' readOnly />
										<div className='flex gap-4 [&>*]:flex-1'>
											<TextInput
												value={dayjs(data.birthday).format('MMMM DD, YYYY')}
												label='Birthday'
												readOnly
											/>
											<TextInput value={getAge(data.birthday)} label='Age' readOnly />
										</div>
										<div className='flex gap-4 [&>*]:flex-1'>
											<TextInput value={data.telephone} label='Telephone' readOnly />
											<TextInput
												value={capitalizeFirstLetter(data.status)}
												label='Status'
												readOnly
											/>
										</div>
										<div className='flex gap-4 [&>*]:flex-1'>
											<TextInput
												value={capitalizeFirstLetter(data.gender)}
												label='Gender'
												readOnly
											/>
											<TextInput value={data.complaint} label='Complaint' readOnly />
										</div>
									</div>
								</ScrollArea>
							</div>
							<div className='flex flex-[2] flex-col gap-4 rounded-r bg-primary-50 p-4'>
								<div className='flex items-center justify-between'>
									<p className='text-xl text-primary-700'>Transactions</p>
									<Button onClick={() => handleOpenTransactionForm()} leftIcon={<PlusIcon />}>
										Add Transaction
									</Button>
								</div>
								<EntryTable entries={data?.entries ?? []} onActionClick={handleActionClick} />
							</div>
						</div>
					)}
				</div>
			</main>
		</div>
	);
};

export default RecordPage;
