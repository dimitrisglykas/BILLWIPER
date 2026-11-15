import {describe,it,expect} from 'vitest';
import {contributionCents,demoBillInput} from './contribution-rules';
describe('demo contribution boundaries',()=>{
 it('accepts a partial 10 euro contribution to a 38.20 euro bill',()=>expect(contributionCents(10,38.2,true)).toBe(1000));
 it('accepts full payment leaving zero',()=>expect(3820-contributionCents(38.2,38.2,true)).toBe(0));
 it('rejects contributions above remaining balance',()=>expect(()=>contributionCents(38.21,38.2,true)).toThrow());
 it('rejects simulated payments against real bills',()=>expect(()=>contributionCents(10,38.2,false)).toThrow());
 it('rejects zero and fractional cents',()=>{expect(()=>contributionCents(0,38.2,true)).toThrow();expect(()=>contributionCents(1.001,38.2,true)).toThrow();});
 it('accepts heating uploads',()=>expect(demoBillInput.safeParse({provider:'Φυσικό Αέριο',amount:68,due_date:'2026-12-15'}).success).toBe(true));
 it('rejects impossible calendar dates',()=>expect(demoBillInput.safeParse({provider:'ΔΕΗ',amount:42.5,due_date:'2026-02-30'}).success).toBe(false));
});