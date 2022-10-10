import { zodResolver } from '@hookform/resolvers/zod';
import { Radio } from '@mantine/core';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import Button from '../../components/Button';
import DatePicker from '../../components/DatePicker';
import Select from '../../components/Select';
import TextInput from '../../components/TextInput';
import { Gender, Record, RecordStatus } from '../../types/schema';
import { capitalizeFirstLetter } from '../../utils/text';

type RecordType = z.infer<typeof Record>;

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
			gender: Gender.enum.male,
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
				<Controller
					control={control}
					name='gender'
					render={({ field }) => (
						<Radio.Group
							label='Gender'
							required
							classNames={{ label: 'text-sm text-primary-700 font-normal [&>span]:text-primary-700' }}
							{...field}
						>
							{Gender.options.map((option) => (
								<Radio
									classNames={{
										radio: 'checked:bg-primary-400 checked:border-primary-400 focus-visible:outline-primary-600',
									}}
									key={option}
									value={option}
									label={capitalizeFirstLetter(option)}
								/>
							))}
						</Radio.Group>
					)}
				/>

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
				<TextInput required className='flex-1' label='Occupation' {...register('occupation')} />
				<TextInput required className='flex-1' label='Complaint' {...register('complaint')} />
				<TextInput required className='flex-1' label='Telephone' {...register('telephone')} />
			</div>

			<div className='mt-4 flex justify-end gap-4'>
				<Button variant='outlined' onClick={onClose}>
					Cancel
				</Button>
				<Button type='submit'>Submit</Button>
			</div>
		</form>
	);
};

export default RecordForm;
