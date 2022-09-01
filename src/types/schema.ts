import { z } from 'zod';

export const RecordStatus = z.enum(['single', 'married', 'divorced', 'separated', 'widowed']);

export const Record = z.object({
	id: z.string().optional(),
	name: z.string(),
	address: z.string(),
	telephone: z.string(),
	occupation: z.string(),
	status: RecordStatus,
	complaint: z.string(),
	birthday: z.date(),
});
