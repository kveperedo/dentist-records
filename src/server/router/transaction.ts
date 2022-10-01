import { z } from 'zod';
import { Transaction } from '../../types/schema';
import { createProtectedRouter } from './protected-router';

export const transactionRouter = createProtectedRouter().mutation('add', {
	input: Transaction.extend({ recordId: z.string() }),
	async resolve({ ctx, input }) {
		const treatmentEntry = await ctx.prisma.treatmentEntry.create({ data: input });

		return treatmentEntry;
	},
});
