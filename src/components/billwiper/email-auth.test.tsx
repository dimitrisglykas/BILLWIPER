import {cleanup,fireEvent,render,screen,waitFor} from '@testing-library/react';
import {afterEach,beforeEach,describe,expect,it,vi} from 'vitest';
import {EmailAuth} from './email-auth';

const auth=vi.hoisted(()=>({signUp:vi.fn(),signInWithPassword:vi.fn(),resetPasswordForEmail:vi.fn()}));
vi.mock('@/integrations/supabase/client',()=>({supabase:{auth}}));
afterEach(cleanup);
beforeEach(()=>{vi.clearAllMocks();auth.signUp.mockResolvedValue({data:{session:null},error:null});auth.signInWithPassword.mockResolvedValue({error:null});});

describe('email authentication mode switching',()=>{
  it('submits registration with a password after leaving password reset',async()=>{
    render(<EmailAuth onSignedIn={vi.fn()}/>);
    fireEvent.click(screen.getByRole('button',{name:'Ξέχασες τον κωδικό;'}));
    fireEvent.click(screen.getByRole('button',{name:'Εγγραφή',exact:true}));
    fireEvent.change(screen.getByLabelText('Email'),{target:{value:'qa@example.com'}});
    fireEvent.change(screen.getByLabelText('Κωδικός'),{target:{value:'test-password'}});
    fireEvent.click(screen.getByRole('button',{name:'Δημιουργία λογαριασμού'}));
    await waitFor(()=>expect(auth.signUp).toHaveBeenCalledWith({email:'qa@example.com',password:'test-password',options:{emailRedirectTo:window.location.origin}}));
    expect(auth.resetPasswordForEmail).not.toHaveBeenCalled();
    expect(auth.signInWithPassword).not.toHaveBeenCalled();
  });
  it('submits sign-in rather than a reset after selecting Sign in',async()=>{
    render(<EmailAuth onSignedIn={vi.fn()}/>);
    fireEvent.click(screen.getByRole('button',{name:'Ξέχασες τον κωδικό;'}));
    fireEvent.click(screen.getByRole('button',{name:'Σύνδεση',exact:true}));
    fireEvent.change(screen.getByLabelText('Email'),{target:{value:'qa@example.com'}});
    fireEvent.change(screen.getByLabelText('Κωδικός'),{target:{value:'test-password'}});
    fireEvent.click(screen.getByRole('button',{name:'Σύνδεση με email'}));
    await waitFor(()=>expect(auth.signInWithPassword).toHaveBeenCalledWith({email:'qa@example.com',password:'test-password'}));
    expect(auth.resetPasswordForEmail).not.toHaveBeenCalled();
  });
});