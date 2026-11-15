export function completeDemoBill<T extends {id:string;amount:number;is_demo:boolean}>(bills:T[], id:string, paid:string[]) {
 const bill=bills.find(item=>item.id===id);
 if(!bill?.is_demo || paid.includes(id)) return {paid, increment:0};
 return {paid:[...paid,id],increment:bill.amount};
}
export function nextBillIndex<T extends {id:string}>(bills:T[], index:number, paid:string[]) {
 let next=index+1;
 while(next<bills.length && paid.includes(bills[next]?.id ?? '')) next++;
 return next;
}
export function indexAfterContribution<T extends {id:string}>(bills:T[], nextId:string|undefined){
 const next=nextId?bills.findIndex(b=>b.id===nextId):-1;
 return next>=0?next:0;
}