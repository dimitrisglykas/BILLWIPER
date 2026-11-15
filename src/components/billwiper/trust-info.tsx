import { Info, ScanLine, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const steps = [
  { icon: ScanLine, title: 'AI OCR Επιβεβαίωση Λογαριασμού', description: 'Η AI διαβάζει τα στοιχεία και ελέγχει τη μορφή και το ψηφίο ελέγχου RF — όχι την οφειλή στον πάροχο.' },
  { icon: ArrowUpRight, title: 'Απευθείας Μικρο-πληρωμές στον Πάροχο', description: 'Οι πραγματικές πληρωμές γίνονται στον επίσημο RF του παρόχου. Τα αποδεικτικά παραμένουν σε αναμονή μέχρι την επιβεβαίωση.' },
  { icon: ShieldCheck, title: '0% Προμήθεια & Απόλυτη Διαφάνεια', description: 'Το BILLWIPER δεν εισπράττει χρήματα ή προμήθεια. Οι συνεισφορές της παρουσίασης είναι προσομοιώσεις, χωρίς πραγματική χρέωση.' },
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
        {steps.map(({ icon: Icon, title, description }, index) => <li key={title}>
          <span className="trust-step-icon"><Icon size={18} /></span>
          <div><span className="trust-step-number">0{index + 1}</span><h3>{title}</h3><p>{description}</p></div>
        </li>)}
      </ol>
    </DialogContent>
  </Dialog>;
}