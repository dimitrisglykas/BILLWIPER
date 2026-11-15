import {describe,it,expect} from 'vitest';
import {sponsorInquiry} from './sponsor-rules';
const ok={company:'Acme ΑΕ',contact_name:'Ελένη Π.',email:'eleni@acme.gr',budget_range:'1000-5000',message:'',privacy_consent:true};
describe('sponsor inquiry',()=>{
 it('accepts a complete business inquiry',()=>expect(sponsorInquiry.safeParse(ok).success).toBe(true));
 it('requires privacy consent',()=>expect(sponsorInquiry.safeParse({...ok,privacy_consent:false}).success).toBe(false));
 it('rejects personal webmail addresses',()=>expect(sponsorInquiry.safeParse({...ok,email:'x@gmail.com'}).success).toBe(false));
 it('rejects unknown budget ranges',()=>expect(sponsorInquiry.safeParse({...ok,budget_range:'1m'}).success).toBe(false));
 it('limits the message to 1000 characters',()=>expect(sponsorInquiry.safeParse({...ok,message:'a'.repeat(1001)}).success).toBe(false));
});
