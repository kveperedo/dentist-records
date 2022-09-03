import { ScrollArea } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { ArrowLeftIcon, Pencil1Icon } from '@radix-ui/react-icons';
import dayjs from 'dayjs';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { join } from 'tailwind-merge';
import Button from '../../components/Button';
import LoadingOverlay from '../../components/LoadingOverlay';
import TextInput from '../../components/TextInput';
import RecordForm from '../../features/record/RecordForm';
import { showNotification } from '../../utils/mantine';
import { capitalizeFirstLetter } from '../../utils/text';
import { trpc } from '../../utils/trpc';

const getAge = (dateOfBirth: Date) => {
	const date = dayjs(dateOfBirth);
	return dayjs().diff(date, 'year');
};

const RecordPage: NextPage = () => {
	const router = useRouter();
	const modals = useModals();
	const id = router.query.id as string;
	const utils = trpc.useContext();
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
	const isLoading = isGetRecordLoading || isEditRecordLoading;

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

	return (
		<div className='min-h-screen bg-slate-100'>
			<main className='container m-auto flex h-screen p-8'>
				<div className='relative flex w-full flex-1 flex-col gap-8'>
					<LoadingOverlay visible={isLoading} />
					{data && (
						<div className='flex h-full divide-x-2 divide-slate-200 rounded bg-white shadow'>
							<div className='flex flex-1 flex-col'>
								<div className='m-4 flex justify-between'>
									<Button
										onClick={() => router.back()}
										className={join(`
									border-transparent bg-transparent text-slate-600
									hover:border-slate-600 hover:bg-slate-100 active:bg-slate-200
									`)}
										leftIcon={<ArrowLeftIcon className='h-5 w-5 text-slate-600' />}
									>
										Go back
									</Button>
									<Button
										onClick={handleEditRecord}
										className={join(`
										border-transparent bg-slate-200 text-slate-700 transition-colors 
										hover:bg-slate-300 active:bg-slate-400
									`)}
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
							<div className='flex-[2]'></div>
						</div>
					)}
				</div>
			</main>
		</div>
	);
};

export default RecordPage;