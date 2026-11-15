ALTER TABLE public.demo_leaders ADD COLUMN is_public_demo boolean NOT NULL DEFAULT false;
COMMENT ON COLUMN public.demo_leaders.is_public_demo IS 'Explicit approval for public display of fictional demo data; private by default and writable only by service_role.';
UPDATE public.demo_leaders SET is_public_demo = true WHERE (id, username) IN ((1, 'kostas.g'), (2, 'maria.k'), (3, 'theo.p'), (4, 'eleni.v'), (5, 'nikos.a'), (6, 'georgia.s'), (7, 'alex.d'), (8, 'sofia.m'));
ALTER POLICY demo_leaders_read ON public.demo_leaders USING (is_public_demo = true);