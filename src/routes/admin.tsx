import {createFileRoute} from '@tanstack/react-router';
import {useQuery,useMutation,useQueryClient} from '@tanstack/react-query';
import {useServerFn} from '@tanstack/react-start';
import {useMemo,useState} from 'react';
import {ShieldCheck,Trash2,Search,RefreshCw} from 'lucide-react';
import {toast} from 'sonner';
import {Button} from '@/components/ui/button';
import {AlertDialog,AlertDialogAction,AlertDialogCancel,AlertDialogContent,AlertDialogDescription,AlertDialogFooter,AlertDialogHeader,AlertDialogTitle} from '@/components/ui/alert-dialog';
import {useAccount} from '@/components/billwiper/shell';
import {useLang} from '@/lib/i18n';
import {getAdminStatus,listSponsorInquiries,updateInquiryStatus,deleteSponsorInquiry} from '@/lib/admin.functions';
import {filterInquiries,inquiryStatuses,type InquiryStatus,type InquiryRow} from '@/lib/sponsor-rules';

export const Route=createFileRoute('/admin')({
 ssr:false,
 head:()=>({meta:[{title:'Διαχείριση — BILLWIPER'},{name:'description',content:'Ιδιωτικός χώρος διαχείρισης BILLWIPER.'},{name:'robots',content:'noindex, nofollow'},{property:'og:title',content:'Διαχείριση — BILLWIPER'},{property:'og:description',content:'Ιδιωτικός χώρος διαχείρισης.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary'}]}),
 component:AdminPage,
});

const budgetLabel:Record<string,[string,string]>={lt1000:['Έως 1.000 €','Up to €1,000'],'1000-5000':['1.000 – 5.000 €','€1,000 – 5,000'],'5000-20000':['5.000 – 20.000 €','€5,000 – 20,000'],gt20000:['Πάνω από 20.000 €','Over €20,000']};
const statusLabel:Record<InquiryStatus,[string,string]>={new:['Νέο','New'],contacted:['Επικοινωνήσαμε','Contacted'],in_discussion:['Σε συζήτηση','In Discussion'],closed:['Κλειστό','Closed']};

function AdminPage(){
 const {user,openAccount}=useAccount();const {tr}=useLang();
 const status=useServerFn(getAdminStatus);
 const access=useQuery({queryKey:['admin-status',user?.id],queryFn:()=>status(),enabled:!!user,retry:false});
 if(!user)return <Gate title={tr('Απαιτείται σύνδεση','Sign-in required')} text={tr('Ο χώρος διαχείρισης είναι διαθέσιμος μόνο σε διαχειριστές.','The admin area is available to administrators only.')} action={<Button onClick={openAccount}>{tr('Σύνδεση','Sign in')}</Button>}/>;
 if(access.isPending)return <Gate title={tr('Έλεγχος δικαιωμάτων…','Checking access…')} text="" busy/>;
 if(access.isError)return <Gate title={tr('Σφάλμα','Error')} text={tr('Δεν ήταν δυνατός ο έλεγχος δικαιωμάτων.','Could not verify access.')} action={<Button variant="outline" onClick={()=>access.refetch()}>{tr('Δοκίμασε ξανά','Try again')}</Button>}/>;
 if(!access.data.isAdmin)return <Gate title={tr('Δεν έχεις πρόσβαση','Access denied')} text={tr('Ο λογαριασμός σου δεν έχει ρόλο διαχειριστή.','Your account does not have the administrator role.')}/>;
 return <Inquiries/>;
}

function Gate({title,text,action,busy}:{title:string;text:string;action?:React.ReactNode;busy?:boolean}){
 return <main className="page-content"><div className="empty-state" role={busy?'status':undefined}><ShieldCheck/><h1>{title}</h1>{text&&<p>{text}</p>}{action}</div></main>;
}

function Inquiries(){
 const {tr,lang}=useLang();const qc=useQueryClient();
 const list=useServerFn(listSponsorInquiries),setStatus=useServerFn(updateInquiryStatus),remove=useServerFn(deleteSponsorInquiry);
 const q=useQuery({queryKey:['admin-inquiries'],queryFn:()=>list()});
 const [search,setSearch]=useState(''),[filter,setFilter]=useState<InquiryStatus|'all'>('all'),[toDelete,setToDelete]=useState<InquiryRow|null>(null);
 const rows=useMemo(()=>filterInquiries(q.data??[],search,filter),[q.data,search,filter]);
 const upd=useMutation({mutationFn:(v:{id:string;status:InquiryStatus})=>setStatus({data:v}),onSuccess:()=>{qc.invalidateQueries({queryKey:['admin-inquiries']});toast.success(tr('Η κατάσταση ενημερώθηκε.','Status updated.'));},onError:()=>toast.error(tr('Η ενημέρωση απέτυχε.','Update failed.'))});
 const del=useMutation({mutationFn:(id:string)=>remove({data:{id}}),onSuccess:()=>{setToDelete(null);qc.invalidateQueries({queryKey:['admin-inquiries']});toast.success(tr('Το αίτημα διαγράφηκε.','Inquiry deleted.'));},onError:()=>toast.error(tr('Η διαγραφή απέτυχε.','Delete failed.'))});
 const date=(s:string)=>new Date(s).toLocaleString(lang==='en'?'en-GB':'el-GR',{dateStyle:'medium',timeStyle:'short'});
 return <main className="page-content">
  <div className="eyebrow">{tr('ΙΔΙΩΤΙΚΟΣ ΧΩΡΟΣ','PRIVATE AREA')}</div>
  <h1>{tr('Αιτήματα χορηγίας','Sponsor inquiries')}</h1>
  <div className="form-row" style={{marginTop:20}}>
   <div className="field"><label htmlFor="adm-search"><Search size={12} aria-hidden/> {tr('Αναζήτηση','Search')}</label><input id="adm-search" value={search} onChange={e=>setSearch(e.target.value)} placeholder={tr('Εταιρεία, όνομα, email…','Company, name, email…')}/></div>
   <div className="field"><label htmlFor="adm-filter">{tr('Κατάσταση','Status')}</label><select id="adm-filter" value={filter} onChange={e=>setFilter(e.target.value as InquiryStatus|'all')}><option value="all">{tr('Όλες','All')}</option>{inquiryStatuses.map(s=><option key={s} value={s}>{tr(...statusLabel[s])}</option>)}</select></div>
  </div>
  {q.isPending?<p role="status" className="modal-copy" style={{marginTop:24}}>{tr('Φόρτωση αιτημάτων…','Loading inquiries…')}</p>
  :q.isError?<div className="empty-state" role="alert"><p>{tr('Δεν ήταν δυνατή η φόρτωση των αιτημάτων.','Could not load inquiries.')}</p><Button variant="outline" onClick={()=>q.refetch()}><RefreshCw/>{tr('Δοκίμασε ξανά','Try again')}</Button></div>
  :rows.length===0?<div className="empty-state"><ShieldCheck/><p>{(q.data?.length??0)===0?tr('Δεν υπάρχουν αιτήματα ακόμη.','No inquiries yet.'):tr('Κανένα αίτημα δεν ταιριάζει στα φίλτρα.','No inquiries match the filters.')}</p></div>
  :<div style={{display:'grid',gap:12,marginTop:24}}>
   <p className="modal-copy">{rows.length} / {q.data!.length}</p>
   {rows.map(r=><article key={r.id} className="campaign-item" aria-label={r.company}>
    <div style={{display:'flex',justifyContent:'space-between',gap:12,flexWrap:'wrap'}}><h3 style={{margin:0}}>{r.company}</h3><small className="modal-copy">{date(r.created_at)}</small></div>
    <p style={{margin:0}}>{r.contact_name} · <a className="text-primary" href={`mailto:${r.email}`}>{r.email}</a></p>
    <small className="text-primary">{tr(...(budgetLabel[r.budget_range]??[r.budget_range,r.budget_range]))}</small>
    {r.message&&<p className="modal-copy" style={{whiteSpace:'pre-wrap',wordBreak:'break-word'}}>{r.message}</p>}
    <div style={{display:'flex',gap:10,alignItems:'end',flexWrap:'wrap'}}>
     <div className="field" style={{flex:1,minWidth:160}}><label htmlFor={`st-${r.id}`}>{tr('Κατάσταση','Status')}</label><select id={`st-${r.id}`} value={r.status} disabled={upd.isPending} onChange={e=>upd.mutate({id:r.id,status:e.target.value as InquiryStatus})}>{inquiryStatuses.map(s=><option key={s} value={s}>{tr(...statusLabel[s])}</option>)}</select></div>
     <Button variant="outline" onClick={()=>setToDelete(r)} aria-label={tr(`Διαγραφή ${r.company}`,`Delete ${r.company}`)}><Trash2/>{tr('Διαγραφή','Delete')}</Button>
    </div>
   </article>)}
  </div>}
  <AlertDialog open={!!toDelete} onOpenChange={o=>{if(!o)setToDelete(null);}}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>{tr('Διαγραφή αιτήματος;','Delete inquiry?')}</AlertDialogTitle><AlertDialogDescription>{tr(`Το αίτημα της εταιρείας «${toDelete?.company??''}» θα διαγραφεί οριστικά.`,`The inquiry from “${toDelete?.company??''}” will be permanently deleted.`)}</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>{tr('Άκυρο','Cancel')}</AlertDialogCancel><AlertDialogAction disabled={del.isPending} onClick={e=>{e.preventDefault();if(toDelete)del.mutate(toDelete.id);}}>{del.isPending?tr('Διαγραφή…','Deleting…'):tr('Οριστική διαγραφή','Delete permanently')}</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
 </main>;
}
