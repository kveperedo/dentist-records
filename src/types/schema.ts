import { z } from 'zod';

export const Record = z.object({
	id: z.string().optional(),
	name: z.string(),
	address: z.string(),
	telephone: z.string(),
	age: z.number().min(1),
	occupation: z.string(),
	status: z.enum(['single', 'married', 'divorced', 'separated', 'widowed']),
	complaint: z.string(),
	birthday: z.date(),
});
