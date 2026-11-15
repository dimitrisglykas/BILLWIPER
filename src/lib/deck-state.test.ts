import {describe,it,expect} from 'vitest';
import {completeDemoBill,nextBillIndex,indexAfterContribution} from './deck-state';
const bills=[{id:'one',amount:38.2,is_demo:true},{id:'two',amount:24,is_demo:true},{id:'real',amount:51.4,is_demo:false}];
describe('deck completion',()=>{
 it('advances from card 1/3 to 2/3 after completion',()=>expect(nextBillIndex(bills,0,['one'])).toBe(1));
 it('increments a completed demo total exactly once',()=>{const result=completeDemoBill(bills,'one',[]);expect(result.increment).toBe(38.2);expect(completeDemoBill(bills,'one',result.paid).increment).toBe(0);});
 it('never increments real totals from receipt submission',()=>expect(completeDemoBill(bills,'real',[])).toEqual({paid:[],increment:0}));
 it('keeps the next card when the completed card disappears from the refreshed feed',()=>expect(indexAfterContribution(bills.slice(1),'two')).toBe(0));
 it('advances after a partial contribution without skipping the next bill',()=>expect(indexAfterContribution(bills,'two')).toBe(1));
});