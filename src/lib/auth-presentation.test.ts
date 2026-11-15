import {describe,expect,it} from 'vitest';
import {supportsManagedGoogle} from './auth-presentation';

describe('managed Google button availability',()=>{
  it('allows lovable.app and its app/preview subdomains',()=>{
    for(const host of ['lovable.app','billwiper.lovable.app','id-preview--example.lovable.app']){
      expect(supportsManagedGoogle(host)).toBe(true);
    }
  });
  it('hides Google on the external production domain and other hosts',()=>{
    for(const host of ['billwiper.dimitrisglykas.gr','example.vercel.app','localhost','notlovable.app','lovable.app.example.com']){
      expect(supportsManagedGoogle(host)).toBe(false);
    }
  });
});