import {useEffect,useState} from 'react';
import {AnimatePresence,motion,useReducedMotion} from 'framer-motion';
import {Zap} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {useLang} from '@/lib/i18n';
export function Intro(){
 const [visible,setVisible]=useState(false);const reduced=useReducedMotion();const {tr}=useLang();
 useEffect(()=>{try{if(sessionStorage.getItem('billwiper-intro'))return;sessionStorage.setItem('billwiper-intro','seen');}catch{/* Storage can be disabled. */}setVisible(true);const timer=setTimeout(()=>setVisible(false),reduced?700:2200);return()=>clearTimeout(timer);},[reduced]);
 return <AnimatePresence>{visible&&<motion.div className="intro-stage" initial={{opacity:1}} exit={{opacity:0}} transition={{duration:.2}} onClick={()=>setVisible(false)} aria-label={tr('Εισαγωγή Billwiper','Billwiper intro')}><div className="intro-scene"><div className="intro-bill"><Zap size={28}/><span>{tr('ΛΟΓΑΡΙΑΣΜΟΣ','BILL')}</span><strong>38,20 €</strong><i/><i/><i/></div><div className="intro-streak"/><div className="intro-logo"><img src="/billwiper-logo.png" alt="BILLWIPER"/><span className="intro-specular"/></div><div className="intro-tagline"><span>Swipe.</span> <span>Wipe.</span> <span>Change Lives.</span></div><p className="intro-subtitle">Σύρε. Σβήσε. Άλλαξε ζωές.</p></div><Button variant="ghost" className="intro-skip" onClick={()=>setVisible(false)}>{tr('Παράλειψη','Skip')}</Button></motion.div>}</AnimatePresence>;
}