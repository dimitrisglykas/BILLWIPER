import {createServerFn} from '@tanstack/react-start';
import {requireSupabaseAuth} from '@/integrations/supabase/auth-middleware';
import {inquiryStatusUpdate,inquiryId,type InquiryRow} from './sponsor-rules';

type Ctx={supabase:any;userId:string};
async function assertAdmin({supabase,userId}:Ctx){
 const {data,error}=await supabase.rpc('has_role',{_user_id:userId,_role:'admin'});
 if(error||data!==true)throw new Error('FORBIDDEN');
}
export const getAdminStatus=createServerFn({method:'GET'}).middleware([requireSupabaseAuth]).handler(async({context})=>{
 const {data}=await context.supabase.rpc('has_role',{_user_id:context.userId,_role:'admin'});return {isAdmin:data===true};
});
export const listSponsorInquiries=createServerFn({method:'GET'}).middleware([requireSupabaseAuth]).handler(async({context}):Promise<InquiryRow[]>=>{
 await assertAdmin(context);
 const {data,error}=await context.supabase.from('sponsor_inquiries').select('id,company,contact_name,email,budget_range,message,status,created_at').order('created_at',{ascending:false}).limit(500);
 if(error)throw new Error('LOAD_FAILED');return data??[];
});
export const updateInquiryStatus=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator((i:unknown)=>inquiryStatusUpdate.parse(i)).handler(async({data,context})=>{
 await assertAdmin(context);
 const {error,count}=await context.supabase.from('sponsor_inquiries').update({status:data.status},{count:'exact'}).eq('id',data.id);
 if(error||!count)throw new Error('UPDATE_FAILED');return {ok:true};
});
export const deleteSponsorInquiry=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator((i:unknown)=>inquiryId.parse(i)).handler(async({data,context})=>{
 await assertAdmin(context);
 const {error,count}=await context.supabase.from('sponsor_inquiries').delete({count:'exact'}).eq('id',data.id);
 if(error||!count)throw new Error('DELETE_FAILED');return {ok:true};
});
