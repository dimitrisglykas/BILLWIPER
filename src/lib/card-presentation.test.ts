import {describe,it,expect} from 'vitest';
import {fundingProgress,providerCategory} from './card-presentation';
describe('funding display',()=>{
 it('shows zero wiped out of 38.20',()=>expect(fundingProgress(38.2,38.2)).toEqual({wiped:0,goal:38.2,fraction:0}));
 it('shows 30 wiped out of 120',()=>expect(fundingProgress(120,90)).toEqual({wiped:30,goal:120,fraction:.25}));
 it('keeps full funding at 100 percent',()=>expect(fundingProgress(38.2,0).fraction).toBe(1));
 it('recognizes all requested telecom providers',()=>{for(const provider of ['Cosmote','Nova','Vodafone'])expect(providerCategory(provider)).toBe('telecom');});
});