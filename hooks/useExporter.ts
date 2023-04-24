import { useEffect, useState } from 'react';

import useStorageService from '@/services/useStorageService';

import { exportData } from '@/utils/app/importExport';
import { trpc } from '@/utils/trpc';

export const useExporter = () => {
  const [requireExport, setRequireExport] = useState(false);
  const storageService = useStorageService();
  const promptsQuery = trpc.prompts.list.useQuery(undefined, {
    enabled: false,
  });
  useEffect(() => {
    if (promptsQuery.data && requireExport) {
      exportData(storageService, promptsQuery.data);
      setRequireExport(false);
    }
  }, [
    promptsQuery.data,
    promptsQuery.isFetched,
    requireExport,
    storageService,
  ]);
  return {
    exportData: async () => {
      setRequireExport(true);
      promptsQuery.refetch();
    },
  };
};
