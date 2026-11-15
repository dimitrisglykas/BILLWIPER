import {z} from 'zod';
export const budgetRanges=['lt1000','1000-5000','5000-20000','gt20000'] as const;
const freeMail=/@(gmail|yahoo|hotmail|outlook|live|icloud|aol|proton(mail)?|yandex|gmx)\.[a-z.]+$/i;
export const sponsorInquiry=z.object({
 company:z.string().trim().min(2).max(120),
 contact_name:z.string().trim().min(2).max(100),
 email:z.string().trim().toLowerCase().email().max(255).refine(e=>!freeMail.test(e),'business'),
 budget_range:z.enum(budgetRanges),
 message:z.string().trim().max(1000).default(''),
 privacy_consent:z.literal(true),
});
export type SponsorInquiry=z.infer<typeof sponsorInquiry>;
