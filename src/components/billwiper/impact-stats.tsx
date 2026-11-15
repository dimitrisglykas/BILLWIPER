import {Heart,Users,ShieldCheck} from 'lucide-react';
import {euros} from '@/lib/bill-rules';
export function ImpactStats({total,participants,bills}:{total:number;participants:number;bills:number}){
 return <div className="impact-stats"><div><Heart size={17}/><strong>{euros(total)}</strong><span>Δοκιμαστική συνεισφορά</span></div><div><Users size={17}/><strong>{participants}</strong><span>Συμμετοχές παρουσίασης</span></div><div><ShieldCheck size={17}/><strong>0</strong><span>Επαληθευμένες πληρωμές</span></div><p>{bills} διαθέσιμα παραδείγματα · Χωρίς πραγματική χρέωση</p></div>;
}