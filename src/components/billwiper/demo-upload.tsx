import {useState,type FormEvent} from 'react';
import {useServerFn} from '@tanstack/react-start';
import {useQueryClient} from '@tanstack/react-query';
import {Button} from '@/components/ui/button';
import {createDemoBill} from '@/lib/billwiper.functions';
import {useAccount} from './shell';
import {toast} from 'sonner';
export function DemoUpload(){
 const {user,openAccount}=useAccount();const save=useServerFn(createDemoBill),query=useQueryClient();const [busy,setBusy]=useState(false),[saved,setSaved]=useState(false);
 async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();if(!user){openAccount();return;}const form=e.currentTarget,data=new FormData(form);setBusy(true);try{await save({data:{provider:data.get('provider'),amount:Number(data.get('amount')),due_date:data.get('due_date')}});await query.invalidateQueries({queryKey:['billwiper-feed']});setSaved(true);form.reset();}catch(e){toast.error(e instanceof Error?e.message:'Δεν αποθηκεύτηκε.');}finally{setBusy(false);}}
 return <section className="demo-upload"><h2>Δοκιμαστικός λογαριασμός</h2><p className="modal-copy">Χωρίς πραγματικό RF, προσωπικά στοιχεία ή τραπεζική πληρωμή.</p>{saved&&<p role="status" className="text-primary">Ο δοκιμαστικός λογαριασμός εμφανίζεται στη ροή.</p>}<form className="upload-form" onSubmit={submit}><div className="field"><label htmlFor="demo-provider">Πάροχος</label><select id="demo-provider" name="provider">{['ΔΕΗ','ΕΥΔΑΠ','Cosmote','Protergia'].map(p=><option key={p}>{p}</option>)}</select></div><div className="form-row"><div className="field"><label htmlFor="demo-amount">Ποσό (€)</label><input id="demo-amount" name="amount" type="number" min="0.01" max="100000" step="0.01" required/></div><div className="field"><label htmlFor="demo-date">Ημερομηνία λήξης</label><input id="demo-date" name="due_date" type="date" required/></div></div><Button disabled={busy} type="submit">{busy?'Αποθήκευση…':user?'Δημοσίευση δοκιμαστικού':'Σύνδεση για δοκιμή'}</Button></form></section>;
}