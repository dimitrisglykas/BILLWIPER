import { z } from 'zod';

export const billIdentity = z.object({first_name:z.string().trim().min(1).max(25).regex(/^[\p{L} -]+$/u),city:z.string().trim().min(2).max(40).regex(/^[\p{L} -]+$/u),note:z.string().trim().min(1).max(80)});
export function validRF(value:string) {
  if (!/^RF\d{23}$/.test(value)) return false;
  const digits=value.slice(4)+'2715'+value.slice(2,4);
  let remainder=0;
  for(const digit of digits) remainder=(remainder*10+Number(digit))%97;
  return remainder===1;
}
export const extractedBill=z.object({provider:z.enum(['ΔΕΗ','ΕΥΔΑΠ','Cosmote','Protergia']),amount:z.number().positive().max(100000),rf_code:z.string().refine(validRF),due_date:z.string().regex(/^\d{4}-\d{2}-\d{2}$/),is_valid:z.literal(true)});
export function receiptStatus(isDemo:boolean) { return isDemo ? 'PAID' : 'PENDING'; }
export const euros=(n:number)=>new Intl.NumberFormat('el-GR',{style:'currency',currency:'EUR'}).format(n);