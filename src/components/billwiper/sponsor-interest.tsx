import {useState,type FormEvent} from 'react';
import {useServerFn} from '@tanstack/react-start';
import {Button} from '@/components/ui/button';
import {submitSponsorInquiry} from '@/lib/billwiper.functions';
import {sponsorInquiry} from '@/lib/sponsor-rules';
import {useLang} from '@/lib/i18n';

type Errors=Partial<Record<'company'|'contact_name'|'email'|'budget_range'|'message'|'privacy_consent',string>>;
export function SponsorInterest(){
 const {tr}=useLang();const send=useServerFn(submitSponsorInquiry);
 const [busy,setBusy]=useState(false),[done,setDone]=useState(false),[errors,setErrors]=useState<Errors>({}),[fail,setFail]=useState('');
 const msg:Required<Errors>={company:tr('Συμπλήρωσε την εταιρεία (2–120 χαρακτήρες).','Enter the company (2–120 characters).'),contact_name:tr('Συμπλήρωσε το όνομα υπευθύνου.','Enter the contact name.'),email:tr('Συμπλήρωσε ένα έγκυρο email.','Enter a valid email address.'),budget_range:tr('Επίλεξε εύρος προϋπολογισμού.','Choose a budget range.'),message:tr('Το μήνυμα έως 1000 χαρακτήρες.','Message up to 1000 characters.'),privacy_consent:tr('Απαιτείται η συγκατάθεσή σου.','Your consent is required.')};
 async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();setFail('');const form=e.currentTarget,f=new FormData(form);
  if(f.get('website'))return;
  const parsed=sponsorInquiry.safeParse({company:f.get('company'),contact_name:f.get('contact_name'),email:f.get('email'),budget_range:f.get('budget_range')||undefined,message:f.get('message')??'',privacy_consent:f.get('privacy_consent')==='on'});
  if(!parsed.success){const next:Errors={};for(const i of parsed.error.issues){const k=i.path[0] as keyof Errors;next[k]=msg[k];}setErrors(next);form.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`)?.focus();return;}
  setErrors({});setBusy(true);try{await send({data:parsed.data});form.reset();setDone(true);}catch{setFail(tr('Δεν ήταν δυνατή η αποστολή. Δοκίμασε ξανά σε λίγο.','We could not send your request. Please try again shortly.'));}finally{setBusy(false);}}
 const err=(k:keyof Errors)=>errors[k]&&<small id={`sp-${k}-err`} role="alert" className="text-destructive">{errors[k]}</small>;
 const aria=(k:keyof Errors)=>({'aria-invalid':!!errors[k]||undefined,'aria-describedby':errors[k]?`sp-${k}-err`:undefined});
 return <section className="demo-upload" id="become-sponsor" aria-labelledby="become-sponsor-title">
  <span className="eyebrow">{tr('ΓΙΝΕ ΧΟΡΗΓΟΣ','BECOME A SPONSOR')}</span>
  <h2 id="become-sponsor-title">{tr('Γίνε Χορηγός','Become a Sponsor')}</h2>
  <p className="modal-copy">{tr('Δήλωσε ενδιαφέρον για μελλοντική συνεργασία. Δεν πραγματοποιείται καμία πληρωμή ή δέσμευση· τα στοιχεία σου φυλάσσονται ιδιωτικά και δεν εμφανίζονται δημόσια.','Register interest in a future partnership. No payment or commitment is made; your details are stored privately and never shown publicly.')}</p>
  {done?<p role="status" className="text-primary">{tr('Ευχαριστούμε! Λάβαμε το ενδιαφέρον σου και θα επικοινωνήσουμε μαζί σου.','Thank you! We received your interest and will get in touch.')}</p>:
  <form className="upload-form" onSubmit={submit} noValidate>
   <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{position:'absolute',left:'-9999px'}}/>
   <div className="field"><label htmlFor="sp-company">{tr('Εταιρεία','Company')}</label><input id="sp-company" name="company" maxLength={120} autoComplete="organization" {...aria('company')}/>{err('company')}</div>
   <div className="field"><label htmlFor="sp-name">{tr('Όνομα υπευθύνου','Contact name')}</label><input id="sp-name" name="contact_name" maxLength={100} autoComplete="name" {...aria('contact_name')}/>{err('contact_name')}</div>
   <div className="field"><label htmlFor="sp-email">{tr('Email επικοινωνίας','Contact email')}</label><input id="sp-email" name="email" type="email" maxLength={255} autoComplete="email" {...aria('email')}/>{err('email')}</div>
   <div className="field"><label htmlFor="sp-budget">{tr('Εύρος προϋπολογισμού','Budget range')}</label><select id="sp-budget" name="budget_range" defaultValue="" {...aria('budget_range')}><option value="" disabled>{tr('Επίλεξε…','Choose…')}</option><option value="lt1000">{tr('Έως 1.000 €','Up to €1,000')}</option><option value="1000-5000">1.000 – 5.000 €</option><option value="5000-20000">5.000 – 20.000 €</option><option value="gt20000">{tr('Πάνω από 20.000 €','Over €20,000')}</option></select>{err('budget_range')}</div>
   <div className="field"><label htmlFor="sp-message">{tr('Μήνυμα (προαιρετικό)','Message (optional)')}</label><textarea id="sp-message" name="message" rows={4} maxLength={1000} {...aria('message')}/>{err('message')}</div>
   <div className="field"><label style={{display:'flex',gap:10,alignItems:'flex-start',fontWeight:400}}><input type="checkbox" name="privacy_consent" style={{width:'auto',marginTop:3}} {...aria('privacy_consent')}/><span>{tr('Συμφωνώ να επεξεργαστεί το BILLWIPER τα στοιχεία μου μόνο για να επικοινωνήσει μαζί μου σχετικά με χορηγία, σύμφωνα με την Πολιτική Απορρήτου.','I agree that BILLWIPER may process my details only to contact me about sponsorship, under the Privacy Policy.')}</span></label>{err('privacy_consent')}</div>
   {fail&&<p role="alert" className="text-destructive">{fail}</p>}
   <Button type="submit" disabled={busy}>{busy?tr('Αποστολή…','Sending…'):tr('Αποστολή ενδιαφέροντος','Send interest')}</Button>
  </form>}
 </section>;
}
