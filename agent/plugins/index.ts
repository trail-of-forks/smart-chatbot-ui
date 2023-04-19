import { Plugin } from '@/types/agent';

import { TaskExecutionContext } from './executor';
import {
  RequestsGetTool,
  RequestsGetWebpageTool,
  RequestsPostTool,
  RequestsPostWebpageTool,
} from './requests';

export const createApiTools = (context: TaskExecutionContext): Plugin[] => {
  return [
    new RequestsGetTool(context.headers),
    new RequestsPostTool(context.headers),
  ];
};

export const createWebpageTools = (context: TaskExecutionContext): Plugin[] => {
  return [
    new RequestsGetWebpageTool(context.headers),
    new RequestsPostWebpageTool(context.headers),
  ];
};
