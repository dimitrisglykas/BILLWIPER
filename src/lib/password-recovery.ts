import {useSyncExternalStore} from 'react';

type RecoveryState={userId:string|null;invalid:boolean};
const initial:RecoveryState={userId:null,invalid:false};
let state=initial;
const listeners=new Set<()=>void>();
export function recoveryState(){return state;}
export function setRecovery(userId:string|null,invalid=false){state={userId,invalid};listeners.forEach(fn=>fn());}
export function useRecovery(){return useSyncExternalStore(fn=>{listeners.add(fn);return()=>{listeners.delete(fn);};},recoveryState,()=>initial);}
export function hasRecoveryError(hash:string,search:string){const h=new URLSearchParams(hash.replace(/^#/,'')),s=new URLSearchParams(search);return h.has('error')||h.has('error_code')||s.has('error')||s.has('error_code');}
export function passwordIssue(password:string,confirmation:string):'short'|'mismatch'|null{
 if(password.length<6)return 'short';
 if(password!==confirmation)return 'mismatch';
 return null;
}