import { Info, ScanLine, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const steps = [
  { icon: ScanLine, status: 'Διαθέσιμο · ανάγνωση στοιχείων', title: 'Ανάγνωση λογαριασμού με AI', description: 'Η AI εξάγει στοιχεία και ελέγχεται η μορφή και το ψηφίο ελέγχου RF. Αυτό δεν επιβεβαιώνει τη γνησιότητα ή την οφειλή. Η επαλήθευση από τον πάροχο είναι σχεδιαζόμενη, όχι ενεργή υπηρεσία.' },
  { icon: ArrowUpRight, status: 'Σχεδιαζόμενο · δεν είναι ενεργό', title: 'Απευθείας πληρωμές στον πάροχο', description: 'Η σύνδεση για πραγματικές μικρο-πληρωμές και επιβεβαίωση από τον πάροχο δεν έχει ενεργοποιηθεί. Σήμερα οι συνεισφορές είναι μόνο προσομοιώσεις: ενημερώνουν δοκιμαστικά υπόλοιπα και κατάταξη, χωρίς χρέωση ή μεταφορά χρημάτων.' },
  { icon: ShieldCheck, status: 'Ισχύει σήμερα', title: '0% Προμήθεια & Διαφάνεια', description: 'Το BILLWIPER δεν εισπράττει χρήματα ή προμήθεια. Τυχόν πραγματικά αποδεικτικά παραμένουν σε αναμονή και δεν αλλάζουν πραγματικά υπόλοιπα χωρίς ανεξάρτητη επιβεβαίωση.' },
];

export function TrustInfo() {
  return <Dialog>
    <DialogTrigger asChild>
      <Button variant="ghost" className="trust-info-trigger"><Info size={12} />Πώς λειτουργεί;</Button>
    </DialogTrigger>
    <DialogContent className="modal-content trust-info-modal">
      <DialogTitle>Πώς λειτουργεί;</DialogTitle>
      <DialogDescription>Μια μικρή κίνηση. Με ξεκάθαρους όρους.</DialogDescription>
      <ol className="trust-steps">
        {steps.map(({ icon: Icon, status, title, description }, index) => <li key={title}>
          <span className="trust-step-icon"><Icon size={18} /></span>
          <div><span className="trust-step-number">0{index + 1} · {status}</span><h3>{title}</h3><p>{description}</p></div>
        </li>)}
      </ol>
    </DialogContent>
  </Dialog>;
}