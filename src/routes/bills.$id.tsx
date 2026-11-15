import {createFileRoute} from '@tanstack/react-router';
import {useSuspenseQuery} from '@tanstack/react-query';
import {useState} from 'react';
import {rfQuery} from '@/lib/rf-query';
import {RFBillCard} from '@/components/billwiper/rf-bill-card';
import {RFPayment} from '@/components/billwiper/rf-payment';
import {Button} from '@/components/ui/button';
import {useLang} from '@/lib/i18n';
export const Route=createFileRoute('/bills/$id')({loader:({context})=>context.queryClient.ensureQueryData(rfQuery),head:()=>({meta:[{title:'Στήριξε έναν λογαριασμό — BILLWIPER'},{name:'description',content:'Πληρωμή λογαριασμού κοινής ωφέλειας απευθείας στον πάροχο με RF.'},{property:'og:title',content:'Στήριξε έναν λογαριασμό — BILLWIPER'},{property:'og:description',content:'Το BILLWIPER δεν εισπράττει χρήματα. Έλεγξε τα στοιχεία στην τράπεζά σου πριν πληρώσεις.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary'}]}),component:BillPage});
function BillPage(){const {id}=Route.useParams(),{data}=useSuspenseQuery(rfQuery),{tr}=useLang(),[open,setOpen]=useState(false);const b=data.find(b=>b.id===id);return <main className="page-content rf-detail-page"><h1>{tr('Μια μικρή πράξη. Μεγάλη ανάσα.','A small act. Big relief.')}</h1>{b?<>{b.status==='active'?<><div className="deck"><RFBillCard bill={b} onSkip={()=>{}} onPay={()=>setOpen(true)}/></div><Button onClick={()=>setOpen(true)}>{tr('ΣΒΗΣΕ','WIPE')}</Button>{open&&<RFPayment bill={b} onClose={()=>setOpen(false)} onPending={()=>{}}/>}</>:<div className="empty-state"><h2>{b.status==='paid'?tr('Εξοφλημένος λογαριασμός','Settled bill'):tr('Υπό Επιβεβαίωση','Pending Verification')}</h2><p>{tr('Δεν δέχεται νέες πληρωμές.','No further payments are requested.')}</p></div>}</>:<div className="empty-state"><h2>{tr('Ο λογαριασμός δεν είναι διαθέσιμος','Bill unavailable')}</h2><p>{tr('Μπορεί να μην έχει εγκριθεί για δημοσίευση.','It may not have been approved for publication.')}</p></div>}</main>;}
