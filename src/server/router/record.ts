import { z } from 'zod';
import { Record } from '../../types/schema';
import { createRouter } from './context';

export const recordRouter = createRouter()
	.query('all', {
		async resolve({ ctx }) {
			const records = await ctx.prisma.record.findMany();

			return records;
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
