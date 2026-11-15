import {describe,it,expect} from 'vitest';
import {rfBillInput,validPaymentRF,canTransition,privateFile} from './rf-rules';
const payload='123456789012345678901';
function rf(){const s=payload+'271500';let r=0;for(const d of s)r=(r*10+Number(d))%97;return 'RF'+String(98-r).padStart(2,'0')+payload;}
const bill={provider:'ΔΕΗ',amount:100,rf_code:rf(),city:'Αθήνα',story:'Χρειάζομαι βοήθεια.',due_date:'2026-12-01',terms:true,document_path:'user/bills/file.pdf'};
describe('RF facilitation rules',()=>{
 it('caps bills at exactly €100',()=>{expect(rfBillInput.safeParse(bill).success).toBe(true);expect(rfBillInput.safeParse({...bill,amount:100.01}).success).toBe(false);});
 it('requires RF and exactly 25 alphanumeric characters with a valid checksum',()=>{expect(rf().length).toBe(25);expect(validPaymentRF(rf())).toBe(true);expect(validPaymentRF('XX'+rf().slice(2))).toBe(false);expect(validPaymentRF(rf()+'1')).toBe(false);expect(validPaymentRF('RF00'+payload)).toBe(false);});
 it('caps the anonymous story at 140 characters',()=>{expect(rfBillInput.safeParse({...bill,story:'x'.repeat(140)}).success).toBe(true);expect(rfBillInput.safeParse({...bill,story:'x'.repeat(141)}).success).toBe(false);});
 it('requires verification consent',()=>{expect(rfBillInput.safeParse({...bill,terms:false}).success).toBe(false);});
 it('accepts only the review, claim and confirmation transitions',()=>{expect(canTransition('pending_review','active')).toBe(true);expect(canTransition('active','pending_verification')).toBe(true);expect(canTransition('pending_verification','paid')).toBe(true);expect(canTransition('active','paid')).toBe(false);expect(canTransition('pending_review','paid')).toBe(false);});
 it('limits private uploads to PDF/images and 10 MB',()=>{expect(privateFile.safeParse({name:'x.pdf',size:10*1024*1024,type:'application/pdf'}).success).toBe(true);expect(privateFile.safeParse({name:'x.pdf',size:10*1024*1024+1,type:'application/pdf'}).success).toBe(false);expect(privateFile.safeParse({name:'x.html',size:100,type:'text/html'}).success).toBe(false);});
});
