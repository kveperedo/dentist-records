import {
	MagnifyingGlassIcon,
	PlusIcon,
	ArrowUpIcon,
	HamburgerMenuIcon,
	DotsVerticalIcon,
	Pencil1Icon,
	TrashIcon,
	EnterIcon,
	Cross1Icon,
} from '@radix-ui/react-icons';
import type { NextPage } from 'next';
import Head from 'next/head';
import { trpc } from '../utils/trpc';
import Button from '../components/Button';
import { useEffect, useState } from 'react';
import TextInput from '../components/TextInput';
import { useModals } from '@mantine/modals';
import { Menu, Pagination, ScrollArea } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { join } from 'tailwind-merge';
import LoadingOverlay from '../components/LoadingOverlay';
import RecordForm from '../features/record/RecordForm';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { AppProps } from './_app';
import { TableCell, TableContainer, TableHeader, TableHeaderCell, TableRow } from '../components/Table';
import EmptyOverlay from '../components/EmptyOverlay';
import { atom, useAtom } from 'jotai';
import { showRecordNotification } from '../features/record/utils';
import { z } from 'zod';
import { Record } from '../types/schema';

type RecordType = Required<z.infer<typeof Record>>;

const NoResultsFound = () => {
	return (
		<div className='flex h-full flex-col items-center justify-center gap-4'>
			<EmptyOverlay
				classes={{ container: join('rounded bg-white shadow-md') }}
				imageSrc='/assets/empty.svg'
				imageAlt='empty record'
				title='No records found'
				description='Please try adjusting the search!'
			/>
		</div>
	);
};

interface RecordTableProps {
	records: RecordType[];
	isSortedAsc: boolean;
	onSortClick: () => void;
	onActionClick: (type: 'delete' | 'edit', record: RecordType) => void;
}

const RecordTable = ({ records, isSortedAsc, onSortClick, onActionClick }: RecordTableProps) => {
	const router = useRouter();

	const handleRecordView = (id: string) => {
		router.push(`/records/${id}`);
	};

	return (
		<TableContainer>
			<TableHeader>
				<tr>
					<TableHeaderCell
						onClick={onSortClick}
						className={join(`cursor-pointer transition-colors hover:bg-primary-300`)}
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
					<TableRow
						className='cursor-pointer odd:bg-zinc-50'
						onClick={() => handleRecordView(record.id)}
						key={record.id}
					>
						<TableCell>{record.name}</TableCell>
						<TableCell>
							<Menu width={150}>
								<Menu.Target>
									<Button
										onClick={(event) => event.stopPropagation()}
										className='ml-auto p-2'
										variant='ghost'
									>
										<DotsVerticalIcon className='h-5 w-5' />
									</Button>
								</Menu.Target>

								<Menu.Dropdown>
									<Menu.Item
										className='text-slate-700 hover:bg-primary-100'
										icon={<EnterIcon className='h-5 w-5' />}
										onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
											event.stopPropagation();
											handleRecordView(record.id);
										}}
									>
										View
									</Menu.Item>
									<Menu.Item
										className='text-slate-700 hover:bg-primary-100'
										icon={<Pencil1Icon className='h-5 w-5' />}
										onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
											event.stopPropagation();
											onActionClick('edit', record);
										}}
									>
										Edit
									</Menu.Item>
									<Menu.Item
										className='text-red-400 hover:bg-red-100'
										icon={<TrashIcon className='h-5 w-5' />}
										onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
											event.stopPropagation();
											onActionClick('delete', record);
										}}
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
				showRecordNotification('queryError');
			},
		}
	);
	const { mutate: addRecord, isLoading: isAddRecordLoading } = trpc.useMutation(['record.add'], {
		onSuccess: () => {
			utils.invalidateQueries(['record.all']);
			showRecordNotification('addSuccess');
		},
		onError: (error) => {
			console.log(error);
			showRecordNotification('addError');
		},
	});
	const { mutate: deleteRecord, isLoading: isDeleteRecordLoading } = trpc.useMutation(['record.delete'], {
		onSuccess: () => {
			utils.invalidateQueries(['record.all']);
			showRecordNotification('deleteSuccess');
		},
		onError: (error) => {
			console.log(error);
			showRecordNotification('deleteError');
		},
	});
	const { mutate: editRecord, isLoading: isEditRecordLoading } = trpc.useMutation(['record.edit'], {
		onSuccess: () => {
			utils.invalidateQueries(['record.all']);
			showRecordNotification('editSuccess');
		},
		onError: (error) => {
			console.log(error);
			showRecordNotification('editError');
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

	const isTableLoading = isGetRecordsLoading || isAddRecordLoading || isDeleteRecordLoading || isEditRecordLoading;

	const handleOpenRecordForm = (record?: RecordType) => {
		const modalId = modals.openModal({
			title: `${record ? 'Edit' : 'Add'} Record`,
			children: (
				<RecordForm
					existingData={record}
					onSubmit={(values) => {
						modals.closeModal(modalId);
						return record ? editRecord({ id: record.id, ...values }) : addRecord(values);
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
					<p className='text-primary-600'>Are you sure you want to delete this record?</p>
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

	const handleActionClick: RecordTableProps['onActionClick'] = (type, record) => {
		if (type === 'delete') {
			return handleDeleteRecord(record.id);
		}

		if (type === 'edit') {
			return handleOpenRecordForm(record);
		}
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
				<div className='min-h-screen bg-primary-50'>
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
										{searchTerm.length ? (
											<Cross1Icon
												className='h-5 w-5 text-primary-500'
												onClick={() => setSearchTerm('')}
											/>
										) : (
											<MagnifyingGlassIcon className='h-5 w-5 text-primary-500' />
										)}
									</span>
								}
								placeholder='Search users'
							/>

							<Button
								onClick={() => handleOpenRecordForm()}
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
										onActionClick={handleActionClick}
										onSortClick={() => setIsSortedAsc((prev) => !prev)}
									/>
								</ScrollArea>
							</div>
						)}

						<Pagination
							className='mt-auto'
							classNames={{
								item: `
									text-primary-800 [&[data-active]]:bg-primary-600 
									[&[data-active]]:text-primary-50 text-base font-poppins
									border-primary-100 enabled:hover:border-primary-300 bg-white
									font-normal transition-colors disabled:bg-primary-300
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
