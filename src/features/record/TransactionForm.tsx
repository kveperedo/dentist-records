import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import Button from '../../components/Button';
import DatePicker from '../../components/DatePicker';
import NumberInput from '../../components/NumberInput';
import Textarea from '../../components/Textarea';
import { Transaction } from '../../types/schema';

type TransactionType = z.infer<typeof Transaction>;

export interface TransactionFormProps {
	onSubmit: (values: TransactionType) => void;
	onClose?: () => void;
	existingData?: TransactionType;
}

const TransactionForm = ({ onSubmit, onClose, existingData }: TransactionFormProps) => {
	const { register, control, reset, handleSubmit } = useForm<TransactionType>({
		resolver: zodResolver(Transaction),
		defaultValues: {
			date: new Date(),
			fees: 0,
			service: '',
			tooth: '',
		},
	});

	const handleFormSubmit = (values: TransactionType) => {
		onSubmit(values);
	};

	useEffect(() => {
		if (existingData) {
			reset(existingData);
		}
	}, [existingData, reset]);

	return (
		<form onSubmit={handleSubmit(handleFormSubmit)} className='flex h-full flex-col gap-4'>
			<div className='flex flex-col gap-4 sm:flex-row [&>*]:flex-1'>
				<Controller
					control={control}
					name='date'
					render={({ field: { name, onChange, ref, value } }) => {
						return (
							<DatePicker
								required
								label='Date'
								name={name}
								ref={ref}
								value={value ? dayjs(value).toDate() : null}
								onChange={onChange}
							/>
						);
					}}
				/>
				<Controller
					control={control}
					name='fees'
					render={({ field, fieldState: { error } }) => {
						return (
							<NumberInput
								error={error?.message}
								required
								label='Fees'
								min={Transaction.shape.fees.minValue ?? undefined}
								precision={2}
								{...field}
							/>
						);
					}}
				/>
			</div>
			<Textarea required label='Tooth' autosize maxRows={5} minRows={2} {...register('tooth')} />
			<Textarea required label='Service' autosize maxRows={5} minRows={3} {...register('service')} />

			<div className='mt-auto'>
				<div className='mt-4 flex justify-end gap-4'>
					<Button variant='outlined' onClick={onClose}>
						Cancel
					</Button>
					<Button type='submit'>Submit</Button>
				</div>
			</div>
		</form>
	);
};

export default TransactionForm;
