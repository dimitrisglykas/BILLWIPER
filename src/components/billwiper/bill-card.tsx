import {useEffect} from 'react';
import {motion,animate,useMotionValue,useTransform,useReducedMotion} from 'framer-motion';
import {Zap,Droplets,Wifi,Flame,ShieldCheck,ArrowRight,Check,MapPin} from 'lucide-react';
import type {Bill} from '@/lib/feed-query';
import {euros} from '@/lib/bill-rules';
import {syntheticCity} from '@/lib/showcase-rules';
import {fundingProgress,providerCategory} from '@/lib/card-presentation';
export function BillCard({bill,onSkip,onPay,exiting=false}:{bill:Bill;onSkip:()=>void;onPay:()=>void;exiting?:boolean}){
 const x=useMotionValue(0),rotate=useTransform(x,[-200,200],[-9,12]),wipeOpacity=useTransform(x,[20,120],[0,1]),skipOpacity=useTransform(x,[-120,-20],[1,0]);const reduced=useReducedMotion();
 const category=providerCategory(bill.provider),Icon=category==='water'?Droplets:category==='telecom'?Wifi:category==='heating'?Flame:Zap;
 const progress=fundingProgress(bill.goal_amount,bill.amount);
 useEffect(()=>{if(exiting){const control=animate(x,reduced?0:650,{duration:reduced?0:.38,ease:[.2,.7,.2,1]});return ()=>control.stop();}return undefined;},[exiting,reduced,x]);
 return <motion.article className={`bill-card polished-card provider-${category}`} drag={exiting?false:'x'} dragConstraints={{left:0,right:0}} dragElastic={.65} style={{x,rotate}} onDragEnd={(_,info)=>{if(info.offset.x>90){void animate(x,0,{type:'spring',stiffness:380,damping:28});onPay();}else if(info.offset.x< -90){void animate(x,0,{type:'spring',stiffness:380,damping:28});onSkip();}else void animate(x,0,{type:'spring',stiffness:380,damping:28});}} initial={{opacity:0,scale:reduced?1:.96,y:reduced?0:18}} animate={{opacity:exiting?0:1,scale:1,y:0}} transition={{type:'spring',stiffness:340,damping:30}} aria-label={`${bill.provider}, ${euros(bill.amount)}`}>
 <div className="card-ambient" aria-hidden="true"/><motion.div className="swipe-border swipe-border-wipe" style={{opacity:wipeOpacity}} aria-hidden="true"/><motion.div className="swipe-border swipe-border-next" style={{opacity:skipOpacity}} aria-hidden="true"/>
 <div className="bill-top"><div className="provider"><span className="provider-badge"><Icon size={22} strokeWidth={1.8}/></span><div>{bill.provider}<span className="provider-subtitle">{category==='water'?'ΥΔΡΕΥΣΗ':category==='telecom'?'ΤΗΛΕΠΙΚΟΙΝΩΝΙΕΣ':category==='heating'?'ΘΕΡΜΑΝΣΗ':'ΗΛΕΚΤΡΙΚΗ ΕΝΕΡΓΕΙΑ'}</span></div></div><span className="bill-type-label">Παράδειγμα</span></div>
 <div className="amount-section"><span className="amount-label">Υπόλοιπο λογαριασμού</span><div className="bill-amount tabular-nums">{bill.amount.toFixed(2).replace('.',',')}<span className="currency">€</span></div></div>
 <div className="bill-city"><MapPin size={12}/>{syntheticCity(bill.provider)}<span>Συνθετική τοποθεσία</span></div><p className="bill-note">{bill.note}</p>
 <div className="funding-section"><div className="funding-label"><span>{euros(progress.wiped)} <span className="text-muted-foreground">/ {euros(progress.goal)} σβησμένα</span></span><span className="funding-percent">{Math.round(progress.fraction*100)}%</span></div><div className="funding-track" role="progressbar" aria-label="Πρόοδος εξόφλησης" aria-valuemin={0} aria-valuemax={progress.goal} aria-valuenow={progress.wiped}><motion.div className="funding-fill" initial={false} animate={{scaleX:progress.fraction}} transition={{duration:reduced?0:.35}}/></div></div>
 <div className="bill-footer"><span className="verified"><ShieldCheck size={13}/>Συνθετικά · χωρίς προσωπικά στοιχεία</span><span className="due">{bill.due_date?`Λήξη ${bill.due_date.split('-').reverse().slice(0,2).join('/')}`:''}</span></div>
 <motion.div className="stamp" style={{opacity:wipeOpacity}}><Check size={21}/>ΣΒΗΣΕ</motion.div><motion.div className="stamp skip" style={{opacity:skipOpacity}}>ΕΠΟΜΕΝΟ<ArrowRight size={20}/></motion.div>
 </motion.article>;
}