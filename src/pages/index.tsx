import { MagnifyingGlassIcon, PlusIcon, CheckCircledIcon, CrossCircledIcon, ArrowUpIcon } from '@radix-ui/react-icons';
import type { NextPage } from 'next';
import Head from 'next/head';
import { trpc } from '../utils/trpc';
import Button from '../components/Button';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Record, RecordStatus } from '../types/schema';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import TextInput from '../components/TextInput';
import { useModals } from '@mantine/modals';
import Select from '../components/Select';
import DatePicker from '../components/DatePicker';
import dayjs from 'dayjs';
import { LoadingOverlay, Pagination, ScrollArea } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useDebouncedValue } from '@mantine/hooks';
import Image from 'next/image';
import { twMerge } from 'tailwind-merge';

const capitalizeFirstLetter = (word: string) => word.charAt(0).toUpperCase() + word.slice(1);

type RecordType = z.infer<typeof Record>;

const NoResultsFound = () => {
	return (
		<div className='flex h-full flex-col items-center justify-center gap-4'>
			<Image src='/assets/empty.svg' width={384} height={384} alt='empty record' />
			<span className='-mt-14 flex flex-col items-center'>
				<h1 className='text-xl text-slate-700'>No records found</h1>
				<p className='text-slate-500'>Please try adjusting the search</p>
			</span>
		</div>
	);
};

export interface RecordFormProps {
	onSubmit: (values: RecordType) => void;
	onClose?: () => void;
	existingData?: RecordType;
}

const RecordForm = ({ onSubmit, onClose, existingData }: RecordFormProps) => {
	const { register, control, reset, handleSubmit } = useForm<RecordType>({
		resolver: zodResolver(Record),
		defaultValues: {
			status: RecordStatus.enum.single,
			birthday: new Date(),
		},
	});

	const handleFormSubmit = (values: RecordType) => {
		onSubmit(values);
	};

	useEffect(() => {
		if (existingData) {
			reset(existingData);
		}
	}, [existingData, reset]);

	return (
		<form onSubmit={handleSubmit(handleFormSubmit)} className='flex flex-col gap-4'>
			<TextInput required label='Name' {...register('name')} />
			<div className='flex gap-4'>
				<TextInput required className='flex-1' label='Occupation' {...register('occupation')} />
				<Controller
					control={control}
					name='status'
					render={({ field }) => (
						<Select
							required
							className='flex-1'
							label='Status'
							{...field}
							data={Object.values(RecordStatus.enum).map((status) => ({
								value: status,
								label: capitalizeFirstLetter(status),
							}))}
						/>
					)}
				/>
				<Controller
					control={control}
					name='birthday'
					render={({ field: { name, onChange, ref, value } }) => {
						return (
							<DatePicker
								required
								label='Birthday'
								name={name}
								initialLevel='year'
								ref={ref}
								value={value ? dayjs(value).toDate() : null}
								onChange={onChange}
							/>
						);
					}}
				/>
			</div>
			<TextInput required label='Address' {...register('address')} />
			<div className='flex gap-4'>
				<TextInput required className='flex-1' label='Complaint' {...register('complaint')} />
				<TextInput required className='flex-1' label='Telephone' {...register('telephone')} />
			</div>

			<div className='mt-4 flex justify-end gap-4'>
				<Button
					onClick={onClose}
					className='bg-transparent text-slate-600 hover:bg-slate-100 active:bg-slate-200'
				>
					Cancel
				</Button>
				<Button type='submit'>Submit</Button>
			</div>
		</form>
	);
};

const SEARCH_INPUT_DEBOUNCE_TIME = 250;

const Home: NextPage = () => {
	const modals = useModals();
	const utils = trpc.useContext();
	const [pageNumber, setPageNumber] = useState(1);
	const [pageCount, setPageCount] = useState(0);
	const [searchTerm, setSearchTerm] = useState('');
	const [isSortedAsc, setIsSortedAsc] = useState(true);
	const [debouncedSearchTerm] = useDebouncedValue(searchTerm, SEARCH_INPUT_DEBOUNCE_TIME);
	const { data, isLoading: isGetRecordsLoading } = trpc.useQuery(
		['record.all', { pageNumber, searchTerm: debouncedSearchTerm, sortType: isSortedAsc ? 'asc' : 'desc' }],
		{
			onError: (error) => {
				console.log(error);
				showNotification({
					icon: <CrossCircledIcon className='h-5 w-5 text-red-500' />,
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
				icon: <CheckCircledIcon className='h-5 w-5 text-green-500' />,
				title: 'Add Record',
				message: 'Successfully added patient to records.',
			});
		},
		onError: (error) => {
			console.log(error);
			showNotification({
				icon: <CrossCircledIcon className='h-5 w-5 text-red-500' />,
				title: 'Error',
				message: 'An error occurred while adding patient to records.',
			});
		},
	});
	const { mutate: deleteRecord, isLoading: isDeleteRecordLoading } = trpc.useMutation(['record.delete'], {
		onSuccess: () => {
			utils.invalidateQueries(['record.all']);
			showNotification({
				icon: <CheckCircledIcon className='h-5 w-5 text-green-500' />,
				title: 'Delete Record',
				message: "Successfully deleted the patient's records.",
			});
		},
		onError: (error) => {
			console.log(error);
			showNotification({
				icon: <CrossCircledIcon className='h-5 w-5 text-red-500' />,
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
						<Button
							onClick={() => modals.closeModal(modalId)}
							className='bg-transparent text-slate-600 hover:bg-slate-100 active:bg-slate-200'
						>
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

	const noResultsFound = data?.records && data?.records.length === 0 && debouncedSearchTerm !== '';

	return (
		<>
			<Head>
				<title>Create T3 App</title>
				<meta name='description' content='Generated by create-t3-app' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<div className='min-h-screen bg-slate-100'>
				<main className='container m-auto flex h-screen flex-1 flex-col p-8'>
					<div className='mb-8 flex items-center '>
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
						<div className='mb-8 flex flex-1 overflow-hidden shadow-md bg-white rounded'>
							<ScrollArea
								className='clip-rounded relative flex flex-1'
								classNames={{ viewport: 'h-full' }}
							>
								<LoadingOverlay className='[&_svg]:fill-slate-800' visible={isTableLoading} />
								<table className='h-full w-full table-auto border-collapse bg-white shadow-sm'>
									<thead
										className={`
								sticky top-0 z-10 table-header-group 
								border-separate border-b-2 border-slate-500 text-slate-700`}
									>
										<tr>
											<th
												onClick={() => setIsSortedAsc((prev) => !prev)}
												className={twMerge(
													`cursor-pointer rounded-tl-md bg-slate-200 p-4 py-6 
												text-left font-semibold transition-colors 
												hover:bg-slate-300
												`
												)}
											>
												<div className='flex items-center gap-2'>
													<p>Name</p>
													{
														<ArrowUpIcon
															className={twMerge(
																'h-5 w-5 transition-transform',
																!isSortedAsc && 'rotate-180'
															)}
														/>
													}
												</div>
											</th>
											<th className='rounded-tr-md bg-slate-200 p-4 py-6 text-right font-semibold'>
												Actions
											</th>
										</tr>
									</thead>
									<tbody>
										{data?.records?.map((record) => (
											<tr
												className='border-collapse text-slate-600 transition-colors hover:bg-slate-50'
												key={record.id}
											>
												<td className='rounded-bl-md px-4 py-3'>{record.name}</td>
												<td className='rounded-br-md px-4 py-3'>
													<div className='flex justify-end gap-4'>
														<Button
															size='sm'
															className='border-transparent bg-slate-200 text-slate-700 transition-colors hover:bg-slate-300 active:bg-slate-400'
														>
															View
														</Button>
														<Button
															onClick={() => handleDeleteRecord(record.id)}
															size='sm'
															className='border:bg-slate-400 border-slate-200 bg-transparent  text-slate-700 transition-colors hover:border-slate-300 hover:bg-transparent active:bg-slate-100'
														>
															Delete
														</Button>
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
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
		</>
	);
};

export default Home;
