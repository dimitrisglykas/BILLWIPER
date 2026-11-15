import {queryOptions} from '@tanstack/react-query';
import {getRFBills} from './rf.functions';
export const rfQuery=queryOptions({queryKey:['rf-bills'],queryFn:()=>getRFBills(),staleTime:0,refetchInterval:15000});
export type RFBill=Awaited<ReturnType<typeof getRFBills>>[number];
