import { UserDb } from '@/utils/server/storage';

import { PromptSchema, PromptSchemaArray } from '@/types/prompt';

import { procedure, router } from '../trpc';

export const prompts = router({
  list: procedure.query(async ({ ctx }) => {
    const userDb = await UserDb.fromUserHash(ctx.userHash);
    return await userDb.getPrompts();
  }),
  update: procedure.input(PromptSchema).mutation(async ({ ctx, input }) => {
    const userDb = await UserDb.fromUserHash(ctx.userHash);
    await userDb.savePrompts(input);
    return { success: true };
  }),
  updateAll: procedure
    .input(PromptSchemaArray)
    .mutation(async ({ ctx, input }) => {
      const userDb = await UserDb.fromUserHash(ctx.userHash);
      await userDb.savePrompts(input);
      return { success: true };
    }),
});
