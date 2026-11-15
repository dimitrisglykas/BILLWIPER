REVOKE SELECT ON public.bills FROM anon,authenticated;
GRANT SELECT(id,provider,amount,due_date,status,is_demo,created_at,demo_remaining) ON public.bills TO anon,authenticated;