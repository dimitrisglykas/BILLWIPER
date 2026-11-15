export type Lang='el'|'en';
export const LANG_STORAGE_KEY='billwiper-lang';
export function parseLang(value:string|null|undefined):Lang{return value==='en'?'en':'el';}
// Shared English strings for module-level data, database sample stories and server messages.
export const EN:Record<string,string>={
 'Οικογένεια με δύο μικρά παιδιά — εκκαθαριστικός λογαριασμός ρεύματος.':'Family with two young children — final electricity bill.',
 'Συνταξιούχος στον Πειραιά — λογαριασμός νερού τριμήνου.':'Pensioner in Piraeus — quarterly water bill.',
 'Άνεργος νέος — βασικός λογαριασμός ρεύματος.':'Unemployed young person — basic electricity bill.',
 'Φοιτητής — σύνδεση ίντερνετ για παρακολούθηση μαθημάτων.':'Student — internet connection for attending classes.',
 'Μονογονεϊκή οικογένεια — λογαριασμός θέρμανσης χειμώνα.':'Single-parent family — winter heating bill.',
 'Λογαριασμός κοινής ωφέλειας — κάθε βοήθεια μετράει.':'Utility bill — every bit of help counts.',
 'Αθήνα':'Athens','Πειραιάς':'Piraeus','Πάτρα':'Patras','Θεσσαλονίκη':'Thessaloniki',
 'Η δοκιμαστική συνεισφορά δεν αποθηκεύτηκε. Έλεγξε το υπόλοιπο.':'The simulated contribution was not saved. Check the remaining balance.',
 'Μη έγκυρο ποσό δοκιμαστικής συνεισφοράς.':'Invalid simulated contribution amount.',
 'Ο λογαριασμός δεν είναι διαθέσιμος.':'This bill is not available.',
 'Δεν αποθηκεύτηκε ο δοκιμαστικός λογαριασμός.':'The example bill was not saved.',
 'Έχεις ήδη 3 ενεργά παραδείγματα στη ροή. Δοκίμασε ξανά όταν σβηστεί κάποιο.':'You already have 3 active examples in the feed. Try again once one is wiped.',
};
export function translate(lang:Lang,el:string,en?:string){return lang==='en'?(en??EN[el]??el):el;}
