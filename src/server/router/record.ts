import { z } from 'zod';
import { Record } from '../../types/schema';
import { createRouter } from './context';

const MAX_NUMBER_OF_RECORDS_PER_QUERY = 20;

export const recordRouter = createRouter()
	.query('all', {
		input: z.object({
			pageNumber: z.number().min(1),
		}),
		async resolve({ ctx, input }) {
			const { pageNumber } = input;

			const [recordCount, records] = await ctx.prisma.$transaction([
				ctx.prisma.record.count(),
				ctx.prisma.record.findMany({
					skip: (pageNumber - 1) * MAX_NUMBER_OF_RECORDS_PER_QUERY,
					take: MAX_NUMBER_OF_RECORDS_PER_QUERY,
					orderBy: {
						name: 'asc',
					},
				}),
			]);

			return {
				pageCount: Math.ceil(recordCount / MAX_NUMBER_OF_RECORDS_PER_QUERY),
				records,
			};
		},
	})
	.mutation('add', {
		input: Record.omit({ id: true }),
		async resolve({ ctx, input }) {
			const record = await ctx.prisma.record.create({ data: input });

			return record;
		},
	})
	.mutation('edit', {
		input: Record.extend({ id: z.string() }),
		async resolve({ ctx, input }) {
			const { id, ...data } = input;
			const record = await ctx.prisma.record.update({ where: { id }, data });

			return record;
		},
	})
	.mutation('delete', {
		input: z.string(),
		async resolve({ ctx, input }) {
			const record = await ctx.prisma.record.delete({ where: { id: input } });

			return record;
		},
	});
