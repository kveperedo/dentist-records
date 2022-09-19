import { z } from 'zod';
import { Record } from '../../types/schema';
import { createProtectedRouter } from './protected-router';

const MAX_NUMBER_OF_RECORDS_PER_QUERY = 20;

export const recordRouter = createProtectedRouter()
	.query('all', {
		input: z.object({
			pageNumber: z.number().min(1),
			searchTerm: z.string().optional(),
			sortType: z.enum(['asc', 'desc']),
		}),
		async resolve({ ctx, input }) {
			const { pageNumber, searchTerm, sortType } = input;

			const [recordCount, records] = await ctx.prisma.$transaction([
				ctx.prisma.record.count(),
				ctx.prisma.record.findMany({
					skip: (pageNumber - 1) * MAX_NUMBER_OF_RECORDS_PER_QUERY,
					take: MAX_NUMBER_OF_RECORDS_PER_QUERY,
					orderBy: {
						name: sortType,
					},
					select: {
						id: true,
						name: true,
					},
					where: searchTerm ? { name: { contains: searchTerm, mode: 'insensitive' } } : undefined,
				}),
			]);

			return {
				pageCount: Math.ceil(recordCount / MAX_NUMBER_OF_RECORDS_PER_QUERY),
				records,
			};
		},
	})
	.query('specific', {
		input: z.string(),
		async resolve({ ctx, input }) {
			const record = await ctx.prisma.record.findFirst({
				where: {
					id: input,
				},
				include: {
					entries: true,
				},
			});

			return record;
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
