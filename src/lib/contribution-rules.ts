import {z} from 'zod';
export const demoBillInput=z.object({provider:z.enum(['ΔΕΗ','ΕΥΔΑΠ','Cosmote','Protergia','Φυσικό Αέριο']),amount:z.number().positive().max(100000).refine(n=>Number.isInteger(Math.round(n*100))&&Math.abs(n*100-Math.round(n*100))<0.000001),due_date:z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value=>{const date=new Date(value+'T00:00:00Z');return Number.isFinite(date.getTime())&&date.toISOString().slice(0,10)===value;})});
export function contributionCents(amount:number,remaining:number,isDemo:boolean){
 if(!isDemo||!Number.isFinite(amount)||amount<=0||Math.abs(amount*100-Math.round(amount*100))>0.000001||Math.round(amount*100)>Math.round(remaining*100))throw new Error('Μη έγκυρο ποσό δοκιμαστικής συνεισφοράς.');
 return Math.round(amount*100);
}export const MAX_OPEN_DEMO_BILLS_PER_USER=3;
export function canAddDemoBill(openCount:number){return Number.isFinite(openCount)&&openCount<MAX_OPEN_DEMO_BILLS_PER_USER;}
