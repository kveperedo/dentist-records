import { Tabs } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { Record, TreatmentEntry } from '@prisma/client';
import { ArrowLeftIcon, Pencil1Icon, PlusIcon } from '@radix-ui/react-icons';
import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Button from '../../components/Button';
import LoadingOverlay from '../../components/LoadingOverlay';
import { EntryTableProps } from '../../features/record/EntryTable';
import RecordForm from '../../features/record/RecordForm';
import RecordInfoPanel from '../../features/record/RecordPanel';
import TransactionForm from '../../features/record/TransactionForm';
import TransactionPanel from '../../features/record/TransactionPanel';
import { showRecordNotification } from '../../features/record/utils';
import useIsSmallBreakpoint from '../../hooks/useIsSmallBreakpoint';
import { showNotification } from '../../utils/mantine';
import { trpc } from '../../utils/trpc';
import { AppProps } from '../_app';

interface TabPanelContainerProps {
	children: React.ReactNode;
	action: React.ReactNode;
}

const TabPanelContainer = ({ action, children }: TabPanelContainerProps) => {
	return (
		<div className='mt-0 flex h-full flex-col gap-4'>
			<div className='flex justify-between'>
				<Link href='/'>
					<Button variant='ghost' leftIcon={<ArrowLeftIcon className='h-5 w-5 text-primary-600' />}>
						Back
					</Button>
				</Link>

				{action}
			</div>
			{children}
		</div>
	);
};

interface MobileRecordPageProps {
	data: Record & {
		entries: TreatmentEntry[];
	};
	onActionClick: EntryTableProps['onActionClick'];
	onEditRecord: () => void;
	onAddTransaction: () => void;
}

const MobileRecordPage = ({ data, onActionClick, onEditRecord, onAddTransaction }: MobileRecordPageProps) => {
	return (
		<Tabs defaultValue='record' variant='default'>
			<Tabs.List grow>
				<Tabs.Tab value='record'>Record</Tabs.Tab>
				<Tabs.Tab value='transactions'>Transactions</Tabs.Tab>
				<Tabs.Tab value='files'>Files</Tabs.Tab>
			</Tabs.List>
			<Tabs.Panel value='record'>
				<TabPanelContainer
					action={
						<Button onClick={onEditRecord} leftIcon={<Pencil1Icon className='h-5 w-5' />}>
							Edit Record
						</Button>
					}
				>
					<RecordInfoPanel data={data} />
				</TabPanelContainer>
			</Tabs.Panel>
			<Tabs.Panel value='transactions'>
				<TabPanelContainer
					action={
						<Button onClick={onAddTransaction} leftIcon={<PlusIcon />}>
							Add Transaction
						</Button>
					}
				>
					<TransactionPanel data={data} onActionClick={onActionClick} />
				</TabPanelContainer>
			</Tabs.Panel>
		</Tabs>
	);
};

const RecordPage: NextPage<AppProps> = () => {
	const router = useRouter();
	const modals = useModals();
	const isSmallBreakpoint = useIsSmallBreakpoint();
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
			className: 'w-auto sm:[&_.mantine-Modal-modal]:w-[768px]',
			fullScreen: isSmallBreakpoint,
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
			className: 'w-auto sm:[&_.mantine-Modal-modal]:w-[768px]',
			fullScreen: isSmallBreakpoint,
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

	if (isLoading) {
		return <LoadingOverlay className='mt-16' visible />;
	}

	return (
		<div className='h-[calc(100vh-64px)] bg-primary-50'>
			<main className='container m-auto flex h-full overflow-hidden p-6 sm:py-6 sm:px-0'>
				<div className='relative flex w-full flex-1 flex-col gap-8'>
					{data && (
						<div className='flex h-full flex-col sm:flex-row'>
							{isSmallBreakpoint ? (
								<MobileRecordPage
									data={data}
									onActionClick={handleActionClick}
									onEditRecord={handleEditRecord}
									onAddTransaction={() => handleOpenTransactionForm()}
								/>
							) : (
								<>
									<div className='flex flex-col gap-4'>
										<RecordInfoPanel
											data={data}
											header={
												<div className='m-4 flex justify-between'>
													<Link href='/'>
														<Button
															variant='ghost'
															leftIcon={
																<ArrowLeftIcon className='h-5 w-5 text-primary-600' />
															}
														>
															Back
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
											}
										/>
									</div>
									<div className='ml-4 flex flex-1 flex-col gap-4'>
										<Tabs defaultValue='transactions' classNames={{ root: 'w-full', tab: 'px-6' }}>
											<Tabs.List>
												<Tabs.Tab value='transactions'>Transactions</Tabs.Tab>
												<Tabs.Tab value='files'>Files</Tabs.Tab>
											</Tabs.List>
											<Tabs.Panel value='transactions'>
												<div className='flex h-full flex-col items-start justify-between gap-4 overflow-hidden'>
													<Button
														onClick={() => handleOpenTransactionForm()}
														leftIcon={<PlusIcon />}
													>
														Add Transaction
													</Button>
													<TransactionPanel
														className='h-[calc(100%-56px)] w-full'
														data={data}
														onActionClick={handleActionClick}
													/>
												</div>
											</Tabs.Panel>
										</Tabs>
									</div>
								</>
							)}
						</div>
					)}
				</div>
			</main>
		</div>
	);
};

export default RecordPage;
