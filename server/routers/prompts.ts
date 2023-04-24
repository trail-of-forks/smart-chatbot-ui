import { UserDb } from '@/utils/server/storage';

import { PromptSchemaArray } from '@/types/prompt';

import { procedure, router } from '../trpc';

export const prompts = router({
  list: procedure.query(async ({ ctx }) => {
    const userDb = await UserDb.fromUserHash(ctx.userHash);
    return await userDb.getPrompts();
  }),
  updateAll: procedure
    .input(PromptSchemaArray)
    .mutation(async ({ ctx, input }) => {
      const userDb = await UserDb.fromUserHash(ctx.userHash);
      await userDb.savePrompts(input);
      return { success: true };
    }),
});
