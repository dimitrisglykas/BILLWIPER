export function fundingProgress(goal:number,remaining:number){
 const goalCents=Math.max(0,Math.round(goal*100));
 const remainingCents=Math.min(goalCents,Math.max(0,Math.round(remaining*100)));
 return {wiped:(goalCents-remainingCents)/100,goal:goalCents/100,fraction:goalCents? (goalCents-remainingCents)/goalCents:0};
}
export function providerCategory(provider:string){return provider==='ΕΥΔΑΠ'?'water':['Cosmote','Nova','Vodafone'].includes(provider)?'telecom':'electricity';}