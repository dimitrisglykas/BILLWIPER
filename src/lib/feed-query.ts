import { queryOptions } from '@tanstack/react-query';
import { getFeed } from './billwiper.functions';
export const feedQuery=queryOptions({queryKey:['billwiper-feed'],queryFn:()=>getFeed(),staleTime:15000,refetchInterval:30000});
export type Bill=Awaited<ReturnType<typeof getFeed>>['bills'][number];