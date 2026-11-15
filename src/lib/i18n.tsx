import {createContext,useCallback,useContext,useEffect,useMemo,useState,type ReactNode} from 'react';
import {parseLang,translate,LANG_STORAGE_KEY,type Lang} from './i18n-rules';
type Ctx={lang:Lang;setLang:(l:Lang)=>void;tr:(el:string,en?:string)=>string};
const LangContext=createContext<Ctx>({lang:'el',setLang:()=>{},tr:(el)=>el});
export function LangProvider({children}:{children:ReactNode}){
 const [lang,setLangState]=useState<Lang>('el');
 useEffect(()=>{try{setLangState(parseLang(localStorage.getItem(LANG_STORAGE_KEY)));}catch{/* storage disabled */}},[]);
 useEffect(()=>{document.documentElement.lang=lang;},[lang]);
 const setLang=useCallback((l:Lang)=>{setLangState(l);try{localStorage.setItem(LANG_STORAGE_KEY,l);}catch{/* storage disabled */}},[]);
 const tr=useCallback((el:string,en?:string)=>translate(lang,el,en),[lang]);
 const value=useMemo(()=>({lang,setLang,tr}),[lang,setLang,tr]);
 return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}
export const useLang=()=>useContext(LangContext);
