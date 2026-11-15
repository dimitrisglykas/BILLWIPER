import {z} from 'zod';
export const rfProviders=['ΔΕΗ','ΕΥΔΑΠ','Φυσικό Αέριο','Τηλεφωνία'] as const;
export function validPaymentRF(code:string){
 if(!/^RF\d{2}[A-Z0-9]{21}$/.test(code))return false;
 const rotated=code.slice(4)+code.slice(0,4);let remainder=0;
 for(const c of rotated){const digits=/[A-Z]/.test(c)?String(c.charCodeAt(0)-55):c;for(const d of digits)remainder=(remainder*10+Number(d))%97;}
 return remainder===1;
}
export const rfBillInput=z.object({provider:z.enum(rfProviders),amount:z.number().positive().max(100).refine(n=>Math.abs(n*100-Math.round(n*100))<1e-8),rf_code:z.string().trim().toUpperCase().refine(validPaymentRF),city:z.string().trim().min(2).max(40),story:z.string().trim().min(1).max(140),due_date:z.iso.date(),terms:z.literal(true),document_path:z.string().min(1).max(300)});
export const receiptInput=z.object({bill_id:z.uuid(),receipt_path:z.string().max(300).nullable()});
export const reviewInput=z.discriminatedUnion('action',[z.object({bill_id:z.uuid(),action:z.literal('approve'),story:z.string().trim().min(1).max(140),city:z.string().trim().min(2).max(40)}),z.object({bill_id:z.uuid(),action:z.literal('paid'),note:z.string().trim().min(10).max(500)})]);
export function canTransition(from:string,to:string){return (from==='pending_review'&&to==='active')||(from==='active'&&to==='pending_verification')||(from==='pending_verification'&&to==='paid');}
export const privateFile=z.object({name:z.string(),size:z.number().positive().max(10*1024*1024),type:z.enum(['application/pdf','image/png','image/jpeg','image/webp'])});
