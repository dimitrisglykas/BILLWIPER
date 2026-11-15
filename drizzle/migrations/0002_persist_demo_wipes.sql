ALTER TABLE public.bills ADD COLUMN demo_remaining numeric;
CREATE TABLE public.wipes (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), bill_id uuid NOT NULL REFERENCES public.bills(id), user_id uuid NOT NULL, amount numeric NOT NULL CHECK (amount > 0), request_id uuid NOT NULL UNIQUE, is_demo boolean NOT NULL DEFAULT true CHECK (is_demo), created_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT ON public.wipes TO authenticated;
GRANT ALL ON public.wipes TO service_role;
ALTER TABLE public.wipes ENABLE ROW LEVEL SECURITY;
CREATE POLICY own_demo_wipes ON public.wipes FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE OR REPLACE FUNCTION public.record_demo_wipe(p_bill_id uuid,p_amount numeric,p_request_id uuid) RETURNS numeric LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE b public.bills; remaining numeric; previous public.wipes;
BEGIN
IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Sign in required'; END IF;
SELECT * INTO b FROM public.bills WHERE id=p_bill_id FOR UPDATE;
SELECT * INTO previous FROM public.wipes WHERE request_id=p_request_id;
IF FOUND THEN
IF previous.user_id<>auth.uid() OR previous.bill_id<>p_bill_id OR previous.amount<>p_amount THEN RAISE EXCEPTION 'Invalid repeated request'; END IF;
RETURN coalesce(b.demo_remaining,b.amount);
END IF;
IF b.id IS NULL OR NOT b.is_demo OR b.status<>'OPEN' THEN RAISE EXCEPTION 'Demo bill unavailable'; END IF;
remaining:=coalesce(b.demo_remaining,b.amount);
IF p_amount IS NULL OR p_amount<=0 OR p_amount<>round(p_amount,2) OR p_amount>remaining THEN RAISE EXCEPTION 'Invalid contribution amount'; END IF;
INSERT INTO public.wipes(bill_id,user_id,amount,request_id) VALUES(p_bill_id,auth.uid(),p_amount,p_request_id);
remaining:=remaining-p_amount;
UPDATE public.bills SET demo_remaining=remaining,status=CASE WHEN remaining=0 THEN 'PAID' ELSE 'OPEN' END WHERE id=p_bill_id AND is_demo;
RETURN remaining;
END; $$;
REVOKE ALL ON FUNCTION public.record_demo_wipe(uuid,numeric,uuid) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.record_demo_wipe(uuid,numeric,uuid) TO authenticated;
CREATE OR REPLACE FUNCTION public.demo_wipe_rankings() RETURNS TABLE(username text,total_amount numeric,weekly_amount numeric,bill_count bigint) LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$ SELECT 'demo_'||substr(md5(user_id::text),1,8),sum(amount),coalesce(sum(amount) FILTER (WHERE created_at>=date_trunc('week',now())),0),count(DISTINCT bill_id) FROM public.wipes WHERE is_demo GROUP BY user_id ORDER BY sum(amount) DESC LIMIT 100; $$;
REVOKE ALL ON FUNCTION public.demo_wipe_rankings() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.demo_wipe_rankings() TO anon,authenticated,service_role;
CREATE OR REPLACE FUNCTION public.demo_wipe_total() RETURNS numeric LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$ SELECT coalesce(sum(amount),0) FROM public.wipes WHERE is_demo; $$;
REVOKE ALL ON FUNCTION public.demo_wipe_total() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.demo_wipe_total() TO anon,authenticated,service_role;
DO $$ BEGIN IF NOT EXISTS(SELECT 1 FROM pg_publication_tables WHERE pubname='supabase_realtime' AND schemaname='public' AND tablename='bills') THEN ALTER PUBLICATION supabase_realtime ADD TABLE public.bills; END IF; END $$;