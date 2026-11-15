import {createServerFn} from '@tanstack/react-start';
import {createClient} from '@supabase/supabase-js';
import {requireSupabaseAuth} from '@/integrations/supabase/auth-middleware';
import type {Database} from '@/integrations/supabase/types';
import {rfBillInput,receiptInput,reviewInput} from './rf-rules';
import {z} from 'zod';
export const getRFBills=createServerFn({method:'GET'}).handler(async()=>{
 const key=process.env['SUPABASE_PUBLISHABLE_KEY']!;
 const db=createClient<Database>(process.env['SUPABASE_URL']!,key,{auth:{persistSession:false,autoRefreshToken:false},global:{fetch:(input,init)=>{const h=new Headers(init?.headers);if(h.get('Authorization')===`Bearer ${key}`)h.delete('Authorization');h.set('apikey',key);return fetch(input,{...init,headers:h});}}});
 const {data,error}=await db.from('bills').select('id,rf_provider,amount,due_date,rf_status,rf_code,story,public_city,created_at').not('rf_status','is',null).eq('is_demo',false).order('created_at');
 if(error)throw new Error('BILLS_LOAD_FAILED');
 return (data??[]).map(b=>({id:b.id,provider:b.rf_provider??'',amount:Number(b.amount),due_date:b.due_date,status:b.rf_status??'',rf_code:b.rf_code??'',story:b.story??'',city:b.public_city??''}));
});
export const submitRFBill=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator((i:unknown)=>rfBillInput.parse(i)).handler(async({data,context})=>{
 const file=await context.supabase.storage.from('rf-documents').download(data.document_path);
 if(file.error||!file.data||file.data.size>10*1024*1024)throw new Error('DOCUMENT_REQUIRED');
 const bytes=new Uint8Array(await file.data.slice(0,12).arrayBuffer());
 const valid=(bytes[0]===37&&bytes[1]===80&&bytes[2]===68&&bytes[3]===70)||(bytes[0]===137&&bytes[1]===80&&bytes[2]===78&&bytes[3]===71)||(bytes[0]===255&&bytes[1]===216&&bytes[2]===255)||(bytes[0]===82&&bytes[1]===73&&bytes[2]===70&&bytes[3]===70&&bytes[8]===87&&bytes[9]===69&&bytes[10]===66&&bytes[11]===80);
 if(!valid)throw new Error('INVALID_FILE');
 const {data:id,error}=await context.supabase.rpc('submit_rf_bill',{p_provider:data.provider,p_amount:data.amount,p_rf:data.rf_code,p_city:data.city,p_story:data.story,p_due:data.due_date,p_path:data.document_path,p_consent:data.terms});
 if(error)throw new Error('SUBMISSION_FAILED');return {id};
});
export const claimRFPayment=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator((i:unknown)=>receiptInput.parse(i)).handler(async({data,context})=>{
 if(data.receipt_path){const file=await context.supabase.storage.from('rf-documents').download(data.receipt_path);if(file.error||!file.data||file.data.size>10*1024*1024)throw new Error('INVALID_RECEIPT');}
 const {error}=await context.supabase.rpc('claim_rf_payment',{p_bill:data.bill_id,...(data.receipt_path?{p_receipt:data.receipt_path}:{})});
 if(error)throw new Error('BILL_UNAVAILABLE');return {status:'pending_verification' as const};
});
export const listRFReviews=createServerFn({method:'GET'}).middleware([requireSupabaseAuth]).handler(async({context})=>{
 const role=await context.supabase.rpc('has_role',{_user_id:context.userId,_role:'admin'});if(role.data!==true)throw new Error('FORBIDDEN');
 const [bills,submissions,receipts]=await Promise.all([context.supabase.from('bills').select('id,rf_provider,amount,due_date,rf_status').not('rf_status','is',null).order('created_at',{ascending:false}),context.supabase.from('bill_submissions').select('bill_id,rf_code,raw_story,city,document_path'),context.supabase.from('verifications').select('bill_id,receipt_image_url')]);
 if(bills.error||submissions.error||receipts.error)throw new Error('LOAD_FAILED');
 return (bills.data??[]).map(b=>({...b,submission:submissions.data?.find(s=>s.bill_id===b.id),receipt:receipts.data?.find(r=>r.bill_id===b.id)}));
});
export const reviewRFBill=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator((i:unknown)=>reviewInput.parse(i)).handler(async({data,context})=>{
 const {error}=await context.supabase.rpc('review_rf_bill',{p_bill:data.bill_id,p_action:data.action,...(data.action==='approve'?{p_story:data.story,p_city:data.city}:{p_note:data.note})});
 if(error)throw new Error('REVIEW_FAILED');return {ok:true};
});
export const getPrivateRFFile=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator((i:unknown)=>z.object({path:z.string().min(1).max(300)}).parse(i)).handler(async({data,context})=>{
 const {data:url,error}=await context.supabase.storage.from('rf-documents').createSignedUrl(data.path,60);if(error||!url)throw new Error('FORBIDDEN');return {url:url.signedUrl};
});
export const getMyRFHistory=createServerFn({method:'GET'}).middleware([requireSupabaseAuth]).handler(async({context})=>{
 const {data,error}=await context.supabase.from('verifications').select('bill_id,created_at').eq('user_id',context.userId).order('created_at',{ascending:false});if(error)throw new Error('LOAD_FAILED');
 const ids=(data??[]).map(r=>r.bill_id);if(!ids.length)return [];
 const bills=await context.supabase.from('bills').select('id,rf_provider,amount,rf_status').in('id',ids);if(bills.error)throw new Error('LOAD_FAILED');
 return (data??[]).map(r=>({...r,bill:bills.data?.find(b=>b.id===r.bill_id)}));
});
