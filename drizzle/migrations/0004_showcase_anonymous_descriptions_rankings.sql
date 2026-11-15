ALTER TABLE public.bills ADD COLUMN public_description text NOT NULL DEFAULT 'Λογαριασμός κοινής ωφέλειας — κάθε βοήθεια μετράει.';
GRANT SELECT (public_description) ON public.bills TO anon, authenticated;
ALTER TABLE public.bills DROP CONSTRAINT bills_provider_check;
ALTER TABLE public.bills ADD CONSTRAINT bills_provider_check CHECK (provider IN ('ΔΕΗ','ΕΥΔΑΠ','Cosmote','Protergia','Φυσικό Αέριο'));
CREATE OR REPLACE FUNCTION public.demo_wipe_rankings() RETURNS TABLE(username text,total_amount numeric,weekly_amount numeric,bill_count bigint) LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
SELECT username,total_amount,weekly_amount,bill_count FROM (
SELECT d.username,d.total_amount,d.weekly_amount,d.bill_count::bigint FROM public.demo_leaders d WHERE d.is_public_demo
UNION ALL
SELECT 'Ανώνυμος Wiper #'||substr(md5(w.user_id::text),1,6),sum(w.amount),coalesce(sum(w.amount) FILTER (WHERE w.created_at>=date_trunc('week',now())),0),count(DISTINCT w.bill_id) FROM public.wipes w JOIN public.bills b ON b.id=w.bill_id WHERE w.is_demo AND b.is_demo AND b.status IN ('OPEN','PAID') GROUP BY w.user_id
) ranks ORDER BY total_amount DESC LIMIT 100;
$$;
CREATE OR REPLACE FUNCTION public.demo_wipe_total() RETURNS numeric LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
SELECT coalesce((SELECT sum(total_amount) FROM public.demo_leaders WHERE is_public_demo),0)+coalesce((SELECT sum(w.amount) FROM public.wipes w JOIN public.bills b ON b.id=w.bill_id WHERE w.is_demo AND b.is_demo AND b.status IN ('OPEN','PAID')),0);
$$;