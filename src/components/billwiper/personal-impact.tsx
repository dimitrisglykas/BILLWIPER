import {useQuery} from '@tanstack/react-query';
import {useServerFn} from '@tanstack/react-start';
import {Button} from '@/components/ui/button';
import {getMyRFHistory} from '@/lib/rf.functions';
import {useAccount} from './shell';
import {useLang} from '@/lib/i18n';
import {euros} from '@/lib/bill-rules';
export function PersonalImpact(){const {user,openAccount}=useAccount(),{tr}=useLang(),get=useServerFn(getMyRFHistory);const q=useQuery({queryKey:['my-rf-history',user?.id],queryFn:()=>get(),enabled:!!user});if(!user)return <Button onClick={openAccount}>{tr('Σύνδεση για το ιδιωτικό ιστορικό','Sign in for your private history')}</Button>;if(q.isPending)return <p role="status">{tr('Φόρτωση…','Loading…')}</p>;if(q.isError)return <Button onClick={()=>q.refetch()}>{tr('Δοκίμασε ξανά','Try again')}</Button>;return <section className="impact-history"><p className="subheading">{tr('Οι υποβολές παραμένουν εκκρεμείς μέχρι ανεξάρτητη επιβεβαίωση.','Submissions remain pending until independent confirmation.')}</p>{q.data.length?q.data.map(r=><div className="history-row" key={r.bill_id}><span>{r.bill?.rf_provider}</span><span>{r.bill?.rf_status==='paid'?tr('Επιβεβαιωμένη εξόφληση','Confirmed settlement'):tr('Υπό Επιβεβαίωση','Pending Verification')}</span><strong>{euros(Number(r.bill?.amount??0))}</strong></div>):<p>{tr('Δεν έχεις υποβάλει δηλώσεις πληρωμής.','You have not submitted any payment claims.')}</p>}</section>;}
