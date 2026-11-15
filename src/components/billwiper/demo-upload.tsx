import {useState,type FormEvent} from 'react';
import {useServerFn} from '@tanstack/react-start';
import {useQueryClient} from '@tanstack/react-query';
import {Button} from '@/components/ui/button';
import {createDemoBill} from '@/lib/billwiper.functions';
import {useAccount} from './shell';
import {demoBillInput} from '@/lib/contribution-rules';
import {toast} from 'sonner';
import {useLang} from '@/lib/i18n';
export function DemoUpload(){
 const {user,openAccount}=useAccount();const save=useServerFn(createDemoBill),query=useQueryClient();const [busy,setBusy]=useState(false),[saved,setSaved]=useState(false);const {tr}=useLang();
 async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();if(!user){openAccount();return;}const form=e.currentTarget,data=new FormData(form);const input=demoBillInput.safeParse({provider:data.get('provider'),amount:Number(data.get('amount')),due_date:data.get('due_date')});if(!input.success){toast.error(tr('Έλεγξε τον πάροχο, το ποσό και την ημερομηνία λήξης.','Check the provider, amount and due date.'));return;}setSaved(false);setBusy(true);try{await save({data:input.data});await query.invalidateQueries({queryKey:['billwiper-feed']});setSaved(true);form.reset();}catch(e){toast.error(e instanceof Error?tr(e.message):tr('Δεν αποθηκεύτηκε.','Not saved.'));}finally{setBusy(false);}}
 return <section className="demo-upload"><h2>{tr('Προσθήκη παραδείγματος','Add an example')}</h2><p className="modal-copy">{tr('Χωρίς πραγματικό RF, προσωπικά στοιχεία ή τραπεζική πληρωμή.','No real RF code, personal data or bank payment.')}</p>{saved&&<p role="status" className="text-primary">{tr('Το παράδειγμα προστέθηκε στη ροή.','The example was added to the feed.')}</p>}<form className="upload-form" onSubmit={submit}><div className="field"><label htmlFor="demo-provider">{tr('Πάροχος','Provider')}</label><select id="demo-provider" name="provider">{['ΔΕΗ','ΕΥΔΑΠ','Cosmote','Protergia','Φυσικό Αέριο'].map(p=><option key={p}>{p}</option>)}</select></div><div className="form-row"><div className="field"><label htmlFor="demo-amount">{tr('Ποσό (€)','Amount (€)')}</label><input id="demo-amount" name="amount" type="number" min="0.01" max="100000" step="0.01" required/></div><div className="field"><label htmlFor="demo-date">{tr('Ημερομηνία λήξης','Due date')}</label><input id="demo-date" name="due_date" type="date" required/></div></div><Button disabled={busy} type="submit">{busy?tr('Αποθήκευση…','Saving…'):user?tr('Προσθήκη στη ροή','Add to feed'):tr('Σύνδεση για προσθήκη','Sign in to add')}</Button></form></section>;
}