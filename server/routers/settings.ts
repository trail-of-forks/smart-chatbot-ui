import { getUserHash } from '@/utils/server/auth';
import { UserDb } from '@/utils/server/storage';

import { SettingsSchema } from '@/types/settings';

import { procedure, router } from '../trpc';

export const settings = router({
  get: procedure.query(async ({ ctx }) => {
    try {
      const userHash = await getUserHash(ctx.req, ctx.res);
      const userDb = await UserDb.fromUserHash(userHash);
      return await userDb.getSettings();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }),
  settingsUpdate: procedure
    .input(SettingsSchema)
    .mutation(async ({ ctx, input }) => {
      const userHash = await getUserHash(ctx.req, ctx.res);
      input.userId = userHash;
      const userDb = await UserDb.fromUserHash(userHash);
      await userDb.saveSettings(input);
      return { success: true };
    }),
});
