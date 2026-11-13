CREATE TABLE public.profiles (id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE, username text NOT NULL, city text NOT NULL DEFAULT 'Αθήνα');
GRANT SELECT ON public.profiles TO authenticated; GRANT UPDATE(username, city) ON public.profiles TO authenticated; GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY own_profile_read ON public.profiles FOR SELECT TO authenticated USING(id = auth.uid());
CREATE POLICY own_profile_update ON public.profiles FOR UPDATE TO authenticated USING(id = auth.uid()) WITH CHECK(id = auth.uid());
CREATE FUNCTION public.create_billwiper_profile() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$ BEGIN INSERT INTO public.profiles(id,username) VALUES(NEW.id,'wiper_' || substr(replace(NEW.id::text,'-',''),1,8)); RETURN NEW; END; $$;
CREATE TRIGGER billwiper_signup AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.create_billwiper_profile();
CREATE TABLE public.bills(id uuid PRIMARY KEY DEFAULT gen_random_uuid(), owner_id uuid, provider text NOT NULL CHECK(provider IN ('ΔΕΗ','ΕΥΔΑΠ','Cosmote','Protergia')), first_name text NOT NULL, city text NOT NULL, note text NOT NULL CHECK(char_length(note)<=80), amount numeric(10,2) NOT NULL CHECK(amount>0), due_date date, status text NOT NULL DEFAULT 'OPEN' CHECK(status IN ('OPEN','PENDING','PAID')), is_demo boolean NOT NULL DEFAULT false, created_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT ON public.bills TO anon, authenticated; GRANT ALL ON public.bills TO service_role;
ALTER TABLE public.bills ENABLE ROW LEVEL SECURITY;
CREATE POLICY public_open_bills ON public.bills FOR SELECT TO anon,authenticated USING(status IN ('OPEN','PAID'));
CREATE POLICY own_bills ON public.bills FOR SELECT TO authenticated USING(owner_id=auth.uid());
CREATE TABLE public.bill_codes(bill_id uuid PRIMARY KEY REFERENCES public.bills(id) ON DELETE CASCADE, owner_id uuid NOT NULL, rf_code text UNIQUE NOT NULL CHECK(rf_code ~ '^RF[0-9]{23}$'));
GRANT SELECT ON public.bill_codes TO authenticated; GRANT ALL ON public.bill_codes TO service_role;
ALTER TABLE public.bill_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY signed_in_bill_codes ON public.bill_codes FOR SELECT TO authenticated USING(EXISTS(SELECT 1 FROM public.bills WHERE id=bill_id AND NOT is_demo AND (status='OPEN' OR owner_id=auth.uid())));
CREATE TABLE public.payments(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),bill_id uuid NOT NULL REFERENCES public.bills(id),payer_id uuid NOT NULL,receipt_path text NOT NULL,status text NOT NULL DEFAULT 'PENDING' CHECK(status IN ('PENDING','PAID','REJECTED')),amount numeric(10,2) NOT NULL,created_at timestamptz NOT NULL DEFAULT now(),UNIQUE(bill_id,payer_id));
GRANT SELECT ON public.payments TO authenticated; GRANT ALL ON public.payments TO service_role;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY own_payments ON public.payments FOR SELECT TO authenticated USING(payer_id=auth.uid());
CREATE TABLE public.demo_leaders(id integer PRIMARY KEY,username text NOT NULL,city text NOT NULL,total_amount numeric(10,2) NOT NULL,weekly_amount numeric(10,2) NOT NULL,bill_count integer NOT NULL);
GRANT SELECT ON public.demo_leaders TO anon, authenticated; GRANT ALL ON public.demo_leaders TO service_role;
ALTER TABLE public.demo_leaders ENABLE ROW LEVEL SECURITY;
CREATE POLICY demo_leaders_read ON public.demo_leaders FOR SELECT TO anon,authenticated USING(true);
CREATE FUNCTION public.billwiper_leaders(weekly boolean DEFAULT false) RETURNS TABLE(username text,city text,total_amount numeric,bill_count bigint) LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$ SELECT p.username,p.city,sum(y.amount),count(*) FROM public.payments y JOIN public.profiles p ON p.id=y.payer_id WHERE y.status='PAID' AND (NOT weekly OR y.created_at>=date_trunc('week',now())) GROUP BY p.id,p.username,p.city ORDER BY sum(y.amount) DESC LIMIT 20; $$;
REVOKE ALL ON FUNCTION public.billwiper_leaders(boolean) FROM PUBLIC; GRANT EXECUTE ON FUNCTION public.billwiper_leaders(boolean) TO anon,authenticated;
CREATE POLICY receipt_insert ON storage.objects FOR INSERT TO authenticated WITH CHECK(bucket_id='receipts' AND (storage.foldername(name))[1]=auth.uid()::text);
CREATE POLICY receipt_read ON storage.objects FOR SELECT TO authenticated USING(bucket_id='receipts' AND (storage.foldername(name))[1]=auth.uid()::text);
INSERT INTO public.bills(id,provider,first_name,city,note,amount,due_date,is_demo) VALUES
('10000000-0000-0000-0000-000000000001','ΔΕΗ','Ελένη','Πάτρα','Λίγη βοήθεια για το ρεύμα αυτού του μήνα.',38.20,'2026-11-16',true),
('10000000-0000-0000-0000-000000000002','ΕΥΔΑΠ','Μαρία','Αθήνα','Ένας μικρός λογαριασμός, μια μεγάλη ανάσα.',24.00,'2026-11-20',true),
('10000000-0000-0000-0000-000000000003','Cosmote','Νίκος','Θεσσαλονίκη','Για να μείνουμε συνδεδεμένοι.',29.90,'2026-11-19',true),
('10000000-0000-0000-0000-000000000004','Protergia','Γιώργος','Κόρινθος','Ρεύμα σπιτιού — κάθε βοήθεια μετράει.',51.40,'2026-11-18',true),
('10000000-0000-0000-0000-000000000005','ΔΕΗ','Άννα','Ηράκλειο','Μια ανάσα για την οικογένειά μας.',44.00,'2026-11-22',true);
INSERT INTO public.demo_leaders VALUES(1,'kostas.g','Αθήνα',4250,1240,38),(2,'maria.k','Θεσσαλονίκη',3120,890,29),(3,'theo.p','Πάτρα',2680,645,24),(4,'eleni.v','Αθήνα',1420,420,17),(5,'nikos.a','Ηράκλειο',980,315,12),(6,'georgia.s','Κόρινθος',760,240,10),(7,'alex.d','Βόλος',590,190,8),(8,'sofia.m','Λάρισα',450,150,6);