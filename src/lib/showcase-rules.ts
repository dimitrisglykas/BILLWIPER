export const PROTOTYPE_ONLY = true;
export function assertRealProcessingAllowed() {
  if (PROTOTYPE_ONLY) throw new Error('Η επεξεργασία πραγματικών λογαριασμών και αποδεικτικών δεν είναι ενεργή στο prototype.');
}
export function participationXP(supportedBills: number) {
  return Math.max(0, Math.floor(Number.isFinite(supportedBills) ? supportedBills : 0)) * 100;
}
export function participationLevel(xp: number) { return Math.floor(Math.max(0, xp) / 300) + 1; }
export function syntheticCity(provider: string) {
  return provider === 'ΕΥΔΑΠ' ? 'Πειραιάς' : provider === 'Cosmote' ? 'Πάτρα' : provider === 'Φυσικό Αέριο' ? 'Θεσσαλονίκη' : 'Αθήνα';
}
export function campaignProjection(budget: number) {
  const safe = Math.max(0, Number.isFinite(budget) ? budget : 0);
  return { budget: safe, supportedBills: Math.floor(safe / 40), cities: safe > 0 ? Math.min(5, Math.ceil(safe / 1000)) : 0 };
}