import {describe,it,expect} from 'vitest';
// Run with Cloud public URL/key and a QA ordinary-member token supplied to the
// test process, never embedded in code. No private response body is logged.
const url=process.env['RANKINGS_TEST_URL'];
const key=process.env['RANKINGS_TEST_KEY'];
const token=process.env['RANKINGS_TEST_MEMBER_TOKEN'];
describe.skipIf(!url||!key||!token)('live legacy-ranking privacy regression',()=>{
 for(const weekly of [false,true]){
  it(`anonymous users cannot retrieve ${weekly?'weekly':'all-time'} private payment rankings`,async()=>{
   if(!url||!key)throw new Error('Missing test configuration');
   const response=await fetch(url+'/rest/v1/rpc/billwiper_leaders',{method:'POST',headers:{apikey:key,'Content-Type':'application/json'},body:JSON.stringify({weekly})});
   expect(response.status).toBe(401);
   expect((await response.json()).code).toBe('42501');
  });
  it(`ordinary members cannot retrieve ${weekly?'weekly':'all-time'} private payment rankings`,async()=>{
   if(!url||!key||!token)throw new Error('Missing test configuration');
   const response=await fetch(url+'/rest/v1/rpc/billwiper_leaders',{method:'POST',headers:{apikey:key,Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify({weekly})});
   expect(response.status).toBe(403);
   expect((await response.json()).code).toBe('42501');
  });
 }
});