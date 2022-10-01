import { ScrollArea } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { TreatmentEntry } from '@prisma/client';
import { ArrowLeftIcon, Pencil1Icon, PlusIcon } from '@radix-ui/react-icons';
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
import { showNotification } from '../../utils/mantine';
import { capitalizeFirstLetter } from '../../utils/text';
import { trpc } from '../../utils/trpc';
import { AppProps } from '../_app';

const numberFormatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'PHP',
	maximumSignificantDigits: 2,
});

interface EntryTableProps {
	entries: TreatmentEntry[];
}

const EntryTable = ({ entries }: EntryTableProps) => {
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
						<TableHeaderCell className='w-4/12 break-words'>Service</TableHeaderCell>
						<TableHeaderCell className='w-2/12 break-words text-right'>Fees</TableHeaderCell>
					</tr>
				</TableHeader>
				<tbody>
					{entries.map((entry) => (
						<TableRow key={entry.id}>
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
			showNotification({
				status: 'success',
				title: 'Edit Record',
				message: "Successfully edited patient's records.",
			});
		},
		onError: (error) => {
			console.log(error);
			showNotification({
				status: 'error',
				title: 'Error',
				message: 'An error occurred while adding patient to records.',
			});
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
	const isLoading = isGetRecordLoading || isEditRecordLoading || isAddTransactionLoading;

	const handleAddTransaction = () => {
		const modalId = modals.openModal({
			title: 'Add Transaction',
			children: (
				<TransactionForm
					onSubmit={(values) => {
						modals.closeModal(modalId);
						addTransaction({ ...values, recordId: id });
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

	if (status === 'unauthenticated') {
		router.replace('/sign-in');
	}

	return (
		<div className='min-h-screen bg-slate-100'>
			<main className='container m-auto flex h-screen p-8'>
				<div className='relative flex w-full flex-1 flex-col gap-8'>
					<LoadingOverlay visible={isLoading} />
					{data && (
						<div className='flex h-full divide-x-2 divide-slate-200 rounded bg-white shadow-md'>
							<div className='flex flex-1 flex-col'>
								<div className='m-4 flex justify-between'>
									<Link href='/'>
										<Button
											variant='ghost'
											leftIcon={<ArrowLeftIcon className='h-5 w-5 text-slate-600' />}
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
										<TextInput value={data.complaint} label='Complaint' readOnly />
									</div>
								</ScrollArea>
							</div>
							<div className='flex-[2] bg-slate-50 rounded-r p-4 flex flex-col gap-4'>
								<div className='flex justify-between items-center'>
									<p className='text-xl text-slate-700'>Transactions</p>
									<Button onClick={handleAddTransaction} leftIcon={<PlusIcon />}>
										Add Transaction
									</Button>
								</div>
								<EntryTable entries={data?.entries ?? []} />
							</div>
						</div>
					)}
				</div>
			</main>
		</div>
	);
};

export default RecordPage;
