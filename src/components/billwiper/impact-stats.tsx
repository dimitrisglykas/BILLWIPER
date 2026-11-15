import {Heart,Users,ShieldCheck} from 'lucide-react';
import {euros} from '@/lib/bill-rules';
import {useLang} from '@/lib/i18n';
export function ImpactStats({total,participants,bills}:{total:number;participants:number;bills:number}){
 const {tr}=useLang();return <div className="impact-stats"><div><Heart size={17}/><strong>{euros(total)}</strong><span>{tr('Δοκιμαστική συνεισφορά','Simulated contributions')}</span></div><div><Users size={17}/><strong>{participants}</strong><span>{tr('Συμμετοχές παρουσίασης','Showcase participants')}</span></div><div><ShieldCheck size={17}/><strong>0</strong><span>{tr('Επαληθευμένες πληρωμές','Verified payments')}</span></div><p>{bills} {tr('διαθέσιμα παραδείγματα · Χωρίς πραγματική χρέωση','available examples · No real charge')}</p></div>;
}