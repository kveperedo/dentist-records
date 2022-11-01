import { ScrollArea } from '@mantine/core';
import { Record } from '@prisma/client';
import dayjs from 'dayjs';
import TextInput from '../../components/TextInput';
import { capitalizeFirstLetter } from '../../utils/text';

const getAge = (dateOfBirth: Date) => {
	const date = dayjs(dateOfBirth);
	return dayjs().diff(date, 'year');
};

interface RecordInfoPanelProps {
	data: Record;
	header?: React.ReactNode;
}

const RecordInfoPanel = ({ data, header }: RecordInfoPanelProps) => {
	return (
		<div className='flex h-full flex-col rounded bg-white shadow'>
			{header}
			<ScrollArea classNames={{ root: 'my-4 flex-1 overflow-hidden' }}>
				<div className='mx-4 flex flex-col gap-4'>
					<TextInput value={data.name} label='Name' readOnly />
					<TextInput value={data.occupation} label='Occupation' readOnly />
					<TextInput value={data.address} label='Address' readOnly />
					<div className='flex gap-4 [&>*]:flex-1'>
						<TextInput value={dayjs(data.birthday).format('MMMM DD, YYYY')} label='Birthday' readOnly />
						<TextInput value={getAge(data.birthday)} label='Age' readOnly />
					</div>
					<div className='flex gap-4 [&>*]:flex-1'>
						<TextInput value={data.telephone} label='Telephone' readOnly />
						<TextInput value={capitalizeFirstLetter(data.status)} label='Status' readOnly />
					</div>
					<div className='flex gap-4 [&>*]:flex-1'>
						<TextInput value={capitalizeFirstLetter(data.gender)} label='Gender' readOnly />
						<TextInput value={data.complaint} label='Complaint' readOnly />
					</div>
				</div>
			</ScrollArea>
		</div>
	);
};

export default RecordInfoPanel;
