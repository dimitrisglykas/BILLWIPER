import {supabase} from '@/integrations/supabase/client';
import {privateFile} from './rf-rules';
export async function uploadRFFile(file:File,userId:string,kind:'bills'|'receipts'){
 privateFile.parse({name:file.name,size:file.size,type:file.type});
 const ext=file.type==='application/pdf'?'pdf':file.type==='image/png'?'png':file.type==='image/webp'?'webp':'jpg';
 const path=`${userId}/${kind}/${crypto.randomUUID()}.${ext}`;
 const {error}=await supabase.storage.from('rf-documents').upload(path,file,{contentType:file.type,upsert:false});if(error)throw new Error('UPLOAD_FAILED');return path;
}
