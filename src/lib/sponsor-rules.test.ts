import {describe,it,expect} from 'vitest';
import {sponsorInquiry} from './sponsor-rules';
const ok={company:'Acme ΑΕ',contact_name:'Ελένη Π.',email:'eleni@acme.gr',budget_range:'1000-5000',message:'',privacy_consent:true};
describe('sponsor inquiry',()=>{
 it('accepts a complete business inquiry',()=>expect(sponsorInquiry.safeParse(ok).success).toBe(true));
 it('requires privacy consent',()=>expect(sponsorInquiry.safeParse({...ok,privacy_consent:false}).success).toBe(false));
 it('accepts Gmail, Yahoo and Outlook addresses',()=>{for(const email of ['x@gmail.com','x@yahoo.gr','x@outlook.com'])expect(sponsorInquiry.safeParse({...ok,email}).success).toBe(true);});
 it('rejects malformed emails',()=>expect(sponsorInquiry.safeParse({...ok,email:'not-an-email'}).success).toBe(false));
 it('rejects unknown budget ranges',()=>expect(sponsorInquiry.safeParse({...ok,budget_range:'1m'}).success).toBe(false));
 it('limits the message to 1000 characters',()=>expect(sponsorInquiry.safeParse({...ok,message:'a'.repeat(1001)}).success).toBe(false));
});
import {filterInquiries,inquiryStatusUpdate} from './sponsor-rules';
describe('admin inquiry rules',()=>{
 const rows=[{id:'1',company:'Acme',contact_name:'Ελένη',email:'e@acme.gr',budget_range:'lt1000',message:'',status:'new',created_at:''},{id:'2',company:'Flow',contact_name:'Νίκος',email:'n@flow.gr',budget_range:'gt20000',message:'',status:'closed',created_at:''}];
 it('filters by status',()=>expect(filterInquiries(rows,'','closed').map(r=>r.id)).toEqual(['2']));
 it('searches company, name and email case-insensitively',()=>expect(filterInquiries(rows,'ACME','all').map(r=>r.id)).toEqual(['1']));
 it('only allows the four statuses',()=>{expect(inquiryStatusUpdate.safeParse({id:'00000000-0000-4000-8000-000000000000',status:'in_discussion'}).success).toBe(true);expect(inquiryStatusUpdate.safeParse({id:'00000000-0000-4000-8000-000000000000',status:'paid'}).success).toBe(false);});
});
