import {describe,it,expect} from 'vitest';
import {assertRealProcessingAllowed,participationXP,participationLevel,campaignProjection} from './showcase-rules';
describe('synthetic showcase rules',()=>{
 it('blocks real bill and receipt processing',()=>expect(assertRealProcessingAllowed).toThrow('δεν είναι ενεργή'));
 it('awards equal demo XP for equal participation regardless of financial strength',()=>{const a={bills:3,amount:3},b={bills:3,amount:120};expect(participationXP(a.bills)).toBe(300);expect(participationXP(b.bills)).toBe(300);});
 it('never credits negative or invalid participation',()=>{expect(participationXP(-2)).toBe(0);expect(participationXP(NaN)).toBe(0);});
 it('levels up at three supported examples',()=>expect(participationLevel(300)).toBe(2));
 it('keeps campaign projections distinct from actual impact',()=>expect(campaignProjection(2000)).toEqual({budget:2000,supportedBills:50,cities:2}));
});