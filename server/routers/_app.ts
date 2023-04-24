import { router } from '../trpc';
import { prompts } from './prompts';
import { settings } from './settings';

export const appRouter = router({
  settings,
  prompts,
});

// export type definition of API
export type AppRouter = typeof appRouter;
