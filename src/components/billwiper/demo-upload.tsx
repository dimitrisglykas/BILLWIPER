import {useState,type FormEvent} from 'react';
import {useServerFn} from '@tanstack/react-start';
import {useQueryClient} from '@tanstack/react-query';
import {Button} from '@/components/ui/button';
import {createDemoBill} from '@/lib/billwiper.functions';
import {useAccount} from './shell';
import {demoBillInput} from '@/lib/contribution-rules';
import {toast} from 'sonner';
export function DemoUpload(){
 const {user,openAccount}=useAccount();const save=useServerFn(createDemoBill),query=useQueryClient();const [busy,setBusy]=useState(false),[saved,setSaved]=useState(false);
 async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();if(!user){openAccount();return;}const form=e.currentTarget,data=new FormData(form);const input=demoBillInput.safeParse({provider:data.get('provider'),amount:Number(data.get('amount')),due_date:data.get('due_date')});if(!input.success){toast.error('Έλεγξε τον πάροχο, το ποσό και την ημερομηνία λήξης.');return;}setSaved(false);setBusy(true);try{await save({data:input.data});await query.invalidateQueries({queryKey:['billwiper-feed']});setSaved(true);form.reset();}catch(e){toast.error(e instanceof Error?e.message:'Δεν αποθηκεύτηκε.');}finally{setBusy(false);}}
 return <section className="demo-upload"><h2>Προσθήκη παραδείγματος</h2><p className="modal-copy">Χωρίς πραγματικό RF, προσωπικά στοιχεία ή τραπεζική πληρωμή.</p>{saved&&<p role="status" className="text-primary">Το παράδειγμα προστέθηκε στη ροή.</p>}<form className="upload-form" onSubmit={submit}><div className="field"><label htmlFor="demo-provider">Πάροχος</label><select id="demo-provider" name="provider">{['ΔΕΗ','ΕΥΔΑΠ','Cosmote','Protergia','Φυσικό Αέριο'].map(p=><option key={p}>{p}</option>)}</select></div><div className="form-row"><div className="field"><label htmlFor="demo-amount">Ποσό (€)</label><input id="demo-amount" name="amount" type="number" min="0.01" max="100000" step="0.01" required/></div><div className="field"><label htmlFor="demo-date">Ημερομηνία λήξης</label><input id="demo-date" name="due_date" type="date" required/></div></div><Button disabled={busy} type="submit">{busy?'Αποθήκευση…':user?'Προσθήκη στη ροή':'Σύνδεση για προσθήκη'}</Button></form></section>;
}