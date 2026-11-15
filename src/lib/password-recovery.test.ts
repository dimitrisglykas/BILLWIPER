import {describe,it,expect} from 'vitest';
import {hasRecoveryError,passwordIssue,setRecovery,recoveryState} from './password-recovery';
describe('password recovery',()=>{
 it('enforces the existing six-character minimum',()=>{expect(passwordIssue('12345','12345')).toBe('short');expect(passwordIssue('123456','123456')).toBe(null);});
 it('rejects mismatched confirmation',()=>{expect(passwordIssue('abcdef','abcdeg')).toBe('mismatch');});
 it('recognizes rejected recovery callbacks',()=>{expect(hasRecoveryError('#error_code=otp_expired','')).toBe(true);expect(hasRecoveryError('','?error=access_denied')).toBe(true);expect(hasRecoveryError('#type=recovery','')).toBe(false);});
 it('ordinary sessions do not create recovery authorization',()=>{setRecovery(null);expect(recoveryState().userId).toBe(null);});
 it('consumes in-memory recovery authorization',()=>{setRecovery('qa-user');expect(recoveryState().userId).toBe('qa-user');setRecovery(null);expect(recoveryState().userId).toBe(null);});
});