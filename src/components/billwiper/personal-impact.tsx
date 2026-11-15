import {useQuery} from '@tanstack/react-query';
import {Heart,ShieldCheck,Layers,ArrowUpRight,RefreshCw,Clock} from 'lucide-react';
import {Link} from '@tanstack/react-router';
import {supabase} from '@/integrations/supabase/client';
import {useAccount} from './shell';
import {useLang} from '@/lib/i18n';
import {Button} from '@/components/ui/button';
import {FlexCard} from './flex-card';
import {euros} from '@/lib/bill-rules';
import {participationXP,participationLevel} from '@/lib/showcase-rules';

export function PersonalImpact(){
 const {user,openAccount}=useAccount();const {tr,lang}=useLang();
 const history=useQuery({queryKey:['personal-impact',user?.id],enabled:!!user,queryFn:async()=>{
  if(!user)return [];
  const {data,error}=await supabase.from('wipes').select('id,bill_id,amount,created_at,is_demo').eq('user_id',user.id).eq('is_demo',true).order('created_at',{ascending:false});
  if(error)throw error;return data??[];
 }});
 if(!user)return <div className="empty-state impact-gate"><ShieldCheck size={32}/><h2>{tr('Ο δικός σου κύκλος προσφοράς.','Your own circle of impact.')}</h2><p>{tr('Συνδέσου για να δεις το ιδιωτικό ιστορικό συμμετοχής σου.','Sign in to see your private participation history.')}</p><Button onClick={openAccount}>{tr('Σύνδεση','Sign in')}<ArrowUpRight/></Button></div>;
 if(history.isPending)return <div role="status" className="loading-state"><span className="loading-line"/>{tr('Φόρτωση ιστορικού…','Loading history…')}</div>;
 if(history.isError)return <div className="empty-state" role="alert"><p>{tr('Το ιστορικό δεν φορτώθηκε.','History could not be loaded.')}</p><Button variant="outline" onClick={()=>history.refetch()}><RefreshCw/>{tr('Δοκίμασε ξανά','Try again')}</Button></div>;
 const rows=history.data??[],bills=new Set(rows.map(r=>r.bill_id)).size,total=rows.reduce((s,r)=>s+Number(r.amount),0),xp=participationXP(bills);
 return <><div className="personal-metrics"><div><ShieldCheck/><span>{tr('Επαληθευμένη συνεισφορά','Verified contributions')}</span><strong>{euros(0)}</strong><small>{tr('Η επιβεβαίωση παρόχων δεν είναι ενεργή','Provider confirmation is not active')}</small></div><div><Heart/><span>{tr('Προσομοιωμένη συνεισφορά','Simulated contributions')}</span><strong>{euros(total)}</strong><small>{tr('Δεν μεταφέρθηκαν χρήματα','No money was moved')}</small></div><div><Layers/><span>{tr('Παραδείγματα υποστήριξης','Examples supported')}</span><strong>{bills}</strong><small>{xp} {tr('δοκιμαστικά XP','demo XP')} · {tr('Επίπεδο','Level')} {participationLevel(xp)}</small></div></div>
 <section className="impact-history"><div className="section-title"><h2>{tr('Ιστορικό συμμετοχής','Participation history')}</h2><span className="prototype-pill">{tr('Ιδιωτικό · Προσομοίωση','Private · Simulation')}</span></div>{rows.length===0?<div className="empty-state"><Heart size={28}/><h2>{tr('Κάθε αρχή έχει σημασία.','Every beginning matters.')}</h2><p>{tr('Δεν έχεις καταγεγραμμένες συμμετοχές ακόμη.','You have no recorded participation yet.')}</p><Button asChild><Link to="/">{tr('Ξεκίνα','Start swiping')}<ArrowUpRight/></Link></Button></div>:rows.map(r=><div className="history-row" key={r.id}><span className="history-icon"><Heart size={16}/></span><div><strong>{tr('Υποστήριξη παραδείγματος','Example supported')}</strong><small>{new Date(r.created_at).toLocaleDateString(lang==='en'?'en-GB':'el-GR')} · {tr('Προσομοίωση','Simulation')}</small></div><strong>{euros(Number(r.amount))}</strong></div>)}</section>
 <section className="confirmation-states"><ShieldCheck size={18}/><div><h3>{tr('Επαλήθευση, όχι υποθέσεις.','Verification, not assumptions.')}</h3><p>{tr('Τα δοκιμαστικά επιτεύγματα παραμένουν ξεχωριστά. Εκκρεμείς συνεισφορές δεν είναι ολοκληρωμένος αντίκτυπος. Επαληθευμένες κάρτες θα διατίθενται μόνο μετά από πραγματική επιβεβαίωση.','Demo achievements stay separate. Pending contributions are not completed impact. Verified cards will only be available after genuine confirmation.')}</p><span><Clock size={12}/>{tr('Πραγματικές πληρωμές ανενεργές','Real payments inactive')}</span></div></section>
 {rows.length>0&&<FlexCard bills={bills} amount={total}/>}</>;
}