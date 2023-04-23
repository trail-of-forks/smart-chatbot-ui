import { router } from '../trpc';
import { settings } from './settings';

export const appRouter = router({
  settings,
});

// export type definition of API
export type AppRouter = typeof appRouter;
