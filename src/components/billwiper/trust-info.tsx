import { Info, ScanLine, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useLang } from '@/lib/i18n';

const steps = [
  { icon: ScanLine, status: 'Ανενεργό στο prototype', title: 'Ανάγνωση λογαριασμού με AI', description: 'Στην παρουσίαση χρησιμοποιούμε μόνο συνθετικούς λογαριασμούς. Δεν επεξεργαζόμαστε πραγματικά έγγραφα. Η επαλήθευση γνησιότητας και οφειλής από τον πάροχο δεν είναι ενεργή.', en: { status: 'Off in this prototype', title: 'AI bill reading', description: 'The showcase uses synthetic bills only. We do not process real documents. Provider verification of authenticity and debt is not active.' } },
  { icon: ArrowUpRight, status: 'Σχεδιαζόμενο · δεν είναι ενεργό', title: 'Απευθείας πληρωμές στον πάροχο', description: 'Η σύνδεση για πραγματικές μικρο-πληρωμές και επιβεβαίωση από τον πάροχο δεν έχει ενεργοποιηθεί. Σήμερα οι συνεισφορές είναι μόνο προσομοιώσεις: ενημερώνουν δοκιμαστικά υπόλοιπα και κατάταξη, χωρίς χρέωση ή μεταφορά χρημάτων.', en: { status: 'Planned · not active', title: 'Direct payments to the provider', description: 'Real micro-payments and provider confirmation are not switched on. Today contributions are simulations only: they update example balances and rankings, with no charge or money moved.' } },
  { icon: ShieldCheck, status: 'Ισχύει σήμερα', title: '0% Προμήθεια & Διαφάνεια', description: 'Το BILLWIPER δεν εισπράττει χρήματα ή προμήθεια. Τυχόν πραγματικά αποδεικτικά παραμένουν σε αναμονή και δεν αλλάζουν πραγματικά υπόλοιπα χωρίς ανεξάρτητη επιβεβαίωση.', en: { status: 'True today', title: '0% fees & transparency', description: 'BILLWIPER collects no money or fees. Any real receipts stay pending and never change real balances without independent confirmation.' } },
];

export function TrustInfo() {
  const { tr, lang } = useLang();
  return <Dialog>
    <DialogTrigger asChild>
      <Button variant="ghost" className="trust-info-trigger"><Info size={12} />{tr('Πώς λειτουργεί;', 'How it works?')}</Button>
    </DialogTrigger>
    <DialogContent className="modal-content trust-info-modal">
      <DialogTitle>{tr('Πώς λειτουργεί;', 'How it works?')}</DialogTitle>
      <DialogDescription>{tr('Μια μικρή κίνηση. Με ξεκάθαρους όρους.', 'A small move. On clear terms.')}</DialogDescription>
      <ol className="trust-steps">
        {steps.map((step, index) => { const Icon = step.icon; const { status, title, description } = lang === 'en' ? step.en : step; return <li key={step.title}>
          <span className="trust-step-icon"><Icon size={18} /></span>
          <div><span className="trust-step-number">0{index + 1} · {status}</span><h3>{title}</h3><p>{description}</p></div>
        </li>; })}
      </ol>
    </DialogContent>
  </Dialog>;
}