import {createFileRoute} from '@tanstack/react-router';
import {useServerFn} from '@tanstack/react-start';
import {useState,type FormEvent} from 'react';
import {Upload,ShieldCheck,ArrowUpRight,CheckCircle2,LoaderCircle} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {useAccount} from '@/components/billwiper/shell';
import {verifyBill} from '@/lib/billwiper.functions';
import {billIdentity,euros} from '@/lib/bill-rules';
import {useQueryClient} from '@tanstack/react-query';
import {toast} from 'sonner';
import {DemoUpload} from '@/components/billwiper/demo-upload';
export const Route=createFileRoute('/upload')({head:()=>({meta:[{title:'Ανέβασε λογαριασμό — Billwiper'},{name:'description',content:'Πρόσθεσε συνθετικά παραδείγματα λογαριασμών χωρίς προσωπικά στοιχεία ή πραγματική χρέωση.'},{property:'og:title',content:'Ανέβασε λογαριασμό — Billwiper'},{property:'og:description',content:'Μόνο συνθετικά δεδομένα. Η επεξεργασία πραγματικών εγγράφων είναι ανενεργή.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),component:UploadPage});
function UploadPage(){return <main className="page-content upload-page"><div className="eyebrow">ΕΝΑ ΠΑΡΑΔΕΙΓΜΑ. ΜΙΑ ΝΕΑ ΑΝΑΣΑ.</div><h1>Δώσε χώρο στο καλό.</h1><p className="subheading">Δημιούργησε έναν συνθετικό λογαριασμό για την παρουσίαση.</p><div className="prototype-notice"><ShieldCheck size={21}/><div><strong>Μόνο δοκιμαστικά στοιχεία</strong><p>Δεν δεχόμαστε πραγματικά έγγραφα, ονόματα, διευθύνσεις, ΑΦΜ ή RF. Η ανάγνωση εγγράφων και η επαλήθευση από παρόχους είναι απενεργοποιημένες.</p></div></div><DemoUpload/><section className="planned-service"><Upload size={23}/><h2>Ανάγνωση λογαριασμού με AI</h2><span className="prototype-pill">Σχεδιαζόμενη υπηρεσία</span><p>Η προηγούμενη λειτουργία διατηρείται, αλλά δεν επεξεργάζεται πραγματικούς λογαριασμούς στο prototype.</p><Button variant="outline" disabled>Μη διαθέσιμο στην παρουσίαση</Button></section></main>}
