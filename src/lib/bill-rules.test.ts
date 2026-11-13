import {describe,it,expect} from 'vitest';
import {billIdentity,validRF,receiptStatus} from './bill-rules';
describe('Billwiper rules',()=>{
 it('limits notes to 80 characters',()=>{expect(billIdentity.safeParse({first_name:'Μαρία',city:'Αθήνα',note:'α'.repeat(80)}).success).toBe(true);expect(billIdentity.safeParse({first_name:'Μαρία',city:'Αθήνα',note:'α'.repeat(81)}).success).toBe(false);});
 it('requires RF plus 23 digits and valid checksum',()=>{expect(validRF('RF74000000000000000000001')).toBe(true);expect(validRF('RF1900000000000000000000001')).toBe(false);expect(validRF('RF123')).toBe(false);});
 it('never treats an unverified real receipt as paid',()=>{expect(receiptStatus(false)).toBe('PENDING');expect(receiptStatus(true)).toBe('PAID');});
});