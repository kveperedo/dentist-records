import { MagnifyingGlassIcon, PlusIcon, ArrowUpIcon, HamburgerMenuIcon } from '@radix-ui/react-icons';
import type { NextPage } from 'next';
import Head from 'next/head';
import { trpc } from '../utils/trpc';
import Button from '../components/Button';
import { useEffect, useState } from 'react';
import TextInput from '../components/TextInput';
import { useModals } from '@mantine/modals';
import { Pagination, ScrollArea } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { join } from 'tailwind-merge';
import LoadingOverlay from '../components/LoadingOverlay';
import RecordForm from '../features/record/RecordForm';
import { showNotification } from '../utils/mantine';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { AppProps } from './_app';
import { TableCell, TableContainer, TableHeader, TableHeaderCell, TableRow } from '../components/Table';
import EmptyOverlay from '../components/EmptyOverlay';
import { atom, useAtom } from 'jotai';

const NoResultsFound = () => {
	return (
		<div className='flex h-full flex-col items-center justify-center gap-4'>
			<EmptyOverlay
				classes={{ container: join('bg-white rouneded shadow-md') }}
				imageSrc='/assets/empty.svg'
				imageAlt='empty record'
				title='No records found'
				description='Please try adjusting the search!'
			/>
		</div>
	);
};

interface RecordTableProps {
	records: { id: string; name: string }[];
	isSortedAsc: boolean;
	onSortClick: () => void;
	onRecordDelete: (id: string) => void;
}

const RecordTable = ({ records, isSortedAsc, onSortClick, onRecordDelete }: RecordTableProps) => {
	return (
		<TableContainer>
			<TableHeader>
				<tr>
					<TableHeaderCell
						onClick={onSortClick}
						className={join(`cursor-pointer transition-colors hover:bg-slate-300`)}
					>
						<div className='flex items-center gap-2'>
							<p>Name</p>
							{
								<ArrowUpIcon
									className={join('h-5 w-5 transition-transform', !isSortedAsc && 'rotate-180')}
								/>
							}
						</div>
					</TableHeaderCell>
					<TableHeaderCell className='text-right'>Actions</TableHeaderCell>
				</tr>
			</TableHeader>
			<tbody>
				{records.map((record) => (
					<TableRow key={record.id}>
						<TableCell>{record.name}</TableCell>
						<TableCell>
							<div className='flex justify-end gap-4'>
								<Link href={`/records/${record.id}`}>
									<Button variant='secondary' size='sm'>
										View
									</Button>
								</Link>

								<Button variant='outlined' onClick={() => onRecordDelete(record.id)} size='sm'>
									Delete
								</Button>
							</div>
						</TableCell>
					</TableRow>
				))}
			</tbody>
		</TableContainer>
	);
};

const SEARCH_INPUT_DEBOUNCE_TIME = 250;

const pageNumberAtom = atom(1);
const isSortedAscAtom = atom(true);

const HomePage: NextPage<AppProps> = ({ openDrawer }) => {
	const modals = useModals();
	const utils = trpc.useContext();
	const { status } = useSession();
	const router = useRouter();
	const [pageNumber, setPageNumber] = useAtom(pageNumberAtom);
	const [isSortedAsc, setIsSortedAsc] = useAtom(isSortedAscAtom);
	const [pageCount, setPageCount] = useState(0);
	const [searchTerm, setSearchTerm] = useState('');
	const [isFirstInitialLoading, setIsFirstInitialLoading] = useState(true);
	const [debouncedSearchTerm] = useDebouncedValue(searchTerm, SEARCH_INPUT_DEBOUNCE_TIME);
	const { data, isLoading: isGetRecordsLoading } = trpc.useQuery(
		['record.all', { pageNumber, searchTerm: debouncedSearchTerm, sortType: isSortedAsc ? 'asc' : 'desc' }],
		{
			onError: (error) => {
				console.log(error);
				showNotification({
					status: 'error',
					title: 'Error',
					message: 'An error occurred while getting patient records.',
				});
			},
		}
	);
	const { mutate: addRecord, isLoading: isAddRecordLoading } = trpc.useMutation(['record.add'], {
		onSuccess: () => {
			utils.invalidateQueries(['record.all']);
			showNotification({
				status: 'success',
				title: 'Add Record',
				message: 'Successfully added patient to records.',
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
	const { mutate: deleteRecord, isLoading: isDeleteRecordLoading } = trpc.useMutation(['record.delete'], {
		onSuccess: () => {
			utils.invalidateQueries(['record.all']);
			showNotification({
				status: 'success',
				title: 'Delete Record',
				message: "Successfully deleted the patient's records.",
			});
		},
		onError: (error) => {
			console.log(error);
			showNotification({
				status: 'error',
				title: 'Error',
				message: "An error occurred while deleting the patient's records.",
			});
		},
	});

	useEffect(() => {
		if (data?.pageCount) {
			setPageCount(data.pageCount);
		}
	}, [data?.pageCount]);

	useEffect(() => {
		if (!isGetRecordsLoading) {
			setIsFirstInitialLoading(false);
		}
	}, [isGetRecordsLoading]);

	const isTableLoading = isGetRecordsLoading || isAddRecordLoading || isDeleteRecordLoading;

	const handleAddRecord = () => {
		const modalId = modals.openModal({
			title: 'Add Record',
			children: (
				<RecordForm
					onSubmit={(values) => {
						modals.closeModal(modalId);
						addRecord(values);
					}}
					onClose={() => modals.closeModal(modalId)}
				/>
			),
			className: '[&_.mantine-Modal-modal]:w-[768px]',
		});
	};

	const handleDeleteRecord = (id: string) => {
		const modalId = modals.openModal({
			title: 'Delete record',
			children: (
				<>
					<p className='text-slate-600'>Are you sure you want to delete this record?</p>
					<div className='mt-4 flex justify-end gap-4'>
						<Button variant='outlined' onClick={() => modals.closeModal(modalId)}>
							Cancel
						</Button>
						<Button
							onClick={() => {
								modals.closeModal(modalId);
								deleteRecord(id);
							}}
						>
							Delete Record
						</Button>
					</div>
				</>
			),
		});
	};

	if (status == 'unauthenticated') {
		router.replace('/sign-in');
	}

	const noResultsFound = data?.records && data?.records.length === 0 && debouncedSearchTerm !== '';

	return (
		<>
			<Head>
				<title>Create T3 App</title>
				<meta name='description' content='Generated by create-t3-app' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			{status === 'loading' || isFirstInitialLoading ? (
				<LoadingOverlay visible />
			) : (
				<div className='min-h-screen bg-slate-100'>
					<main className='container m-auto flex h-screen flex-1 flex-col p-8'>
						<div className='mb-8 flex items-center gap-4'>
							<Button variant='secondary' className='px-[7px]' onClick={openDrawer}>
								<HamburgerMenuIcon className='h-5 w-5' />
							</Button>

							<TextInput
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								rightIcon={
									<span className='flex h-full w-10 shrink-0 cursor-pointer items-center justify-center'>
										<MagnifyingGlassIcon className='h-5 w-5 text-slate-500' />
									</span>
								}
								placeholder='Search users'
							/>

							<Button
								onClick={handleAddRecord}
								className='ml-auto'
								leftIcon={<PlusIcon className='h-5 w-5 text-base text-inherit' />}
							>
								Add Record
							</Button>
						</div>

						{noResultsFound ? (
							<NoResultsFound />
						) : (
							<div className='mb-8 flex flex-1 overflow-hidden rounded bg-white shadow-md'>
								<ScrollArea
									className='clip-rounded relative flex flex-1'
									classNames={{ viewport: 'h-full' }}
								>
									<LoadingOverlay visible={isTableLoading && status === 'authenticated'} />
									<RecordTable
										records={data?.records ?? []}
										isSortedAsc={isSortedAsc}
										onRecordDelete={handleDeleteRecord}
										onSortClick={() => setIsSortedAsc((prev) => !prev)}
									/>
								</ScrollArea>
							</div>
						)}

						<Pagination
							className='mt-auto'
							classNames={{
								item: `
									text-slate-800 [&[data-active]]:bg-slate-600 
									[&[data-active]]:text-slate-50 text-base font-poppins
									border-slate-200 enabled:hover:border-slate-300 bg-white
									font-normal transition-colors disabled:bg-slate-300
									`,
							}}
							page={pageNumber}
							total={pageCount}
							onChange={setPageNumber}
							position='center'
							withControls
							withEdges
						/>
					</main>
				</div>
			)}
		</>
	);
};

export default HomePage;
