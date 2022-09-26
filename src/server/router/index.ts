// src/server/router/index.ts
import { createRouter } from './context';
import superjson from 'superjson';

import { exampleRouter } from './example';
import { protectedExampleRouter } from './protected-example-router';
import { recordRouter } from './record';
import { transactionRouter } from './transaction';

export const appRouter = createRouter()
	.transformer(superjson)
	.merge('example.', exampleRouter)
	.merge('record.', recordRouter)
	.merge('question.', protectedExampleRouter)
	.merge('transaction.', transactionRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
