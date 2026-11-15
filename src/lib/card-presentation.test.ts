import {describe,it,expect} from 'vitest';
import {fundingProgress,providerCategory} from './card-presentation';
describe('funding display',()=>{
 it('shows zero wiped out of 38.20',()=>expect(fundingProgress(38.2,38.2)).toEqual({wiped:0,goal:38.2,fraction:0}));
 it('shows 30 wiped out of 120',()=>expect(fundingProgress(120,90)).toEqual({wiped:30,goal:120,fraction:.25}));
 it('keeps full funding at 100 percent',()=>expect(fundingProgress(38.2,0).fraction).toBe(1));
 it('recognizes all requested telecom providers',()=>{for(const provider of ['Cosmote','Nova','Vodafone'])expect(providerCategory(provider)).toBe('telecom');});
 it('shows 15 euros funded for the 42.50 electricity example',()=>expect(fundingProgress(42.5,27.5).wiped).toBe(15));
 it('shows zero funded for the 24.80 water example',()=>expect(fundingProgress(24.8,24.8).wiped).toBe(0));
 it('shows 10 euros funded for the 29.90 telecom example',()=>expect(fundingProgress(29.9,19.9).wiped).toBe(10));
 it('shows 20 euros funded for the 68 heating example',()=>expect(fundingProgress(68,48).wiped).toBe(20));
 it('shows zero funded for the 35.40 electricity example',()=>expect(fundingProgress(35.4,35.4).wiped).toBe(0));
 it('recognizes heating separately from electricity',()=>expect(providerCategory('Φυσικό Αέριο')).toBe('heating'));
});