import {z} from 'zod';
export const budgetRanges=['lt1000','1000-5000','5000-20000','gt20000'] as const;
export const sponsorInquiry=z.object({
 company:z.string().trim().min(2).max(120),
 contact_name:z.string().trim().min(2).max(100),
 email:z.string().trim().toLowerCase().email().max(255),
 budget_range:z.enum(budgetRanges),
 message:z.string().trim().max(1000).default(''),
 privacy_consent:z.literal(true),
});
export type SponsorInquiry=z.infer<typeof sponsorInquiry>;
export const inquiryStatuses=['new','contacted','in_discussion','closed'] as const;
export type InquiryStatus=typeof inquiryStatuses[number];
export const inquiryStatusUpdate=z.object({id:z.string().uuid(),status:z.enum(inquiryStatuses)});
export const inquiryId=z.object({id:z.string().uuid()});
export type InquiryRow={id:string;company:string;contact_name:string;email:string;budget_range:string;message:string;status:string;created_at:string};
/** Client-side search + status filter for the admin list. */
export function filterInquiries(rows:InquiryRow[],q:string,status:InquiryStatus|'all'){const t=q.trim().toLowerCase();return rows.filter(r=>(status==='all'||r.status===status)&&(!t||[r.company,r.contact_name,r.email,r.message].some(v=>v.toLowerCase().includes(t))));}
