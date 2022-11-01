import { z } from 'zod';
import { Transaction } from '../../types/schema';
import { createProtectedRouter } from './protected-router';

export const transactionRouter = createProtectedRouter()
	.mutation('add', {
		input: Transaction.extend({ recordId: z.string() }),
		async resolve({ ctx, input }) {
			const treatmentEntry = await ctx.prisma.treatmentEntry.create({ data: input });

			return treatmentEntry;
		},
	})
	.mutation('edit', {
		input: Transaction.required(),
		async resolve({ ctx, input }) {
			const { id, ...data } = input;
			const record = await ctx.prisma.treatmentEntry.update({ where: { id }, data });

			return record;
		},
	})
	.mutation('delete', {
		input: z.string(),
		async resolve({ ctx, input }) {
			const record = await ctx.prisma.treatmentEntry.delete({ where: { id: input } });

			return record;
		},
	});
