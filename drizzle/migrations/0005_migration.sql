CREATE TABLE public.sponsor_inquiries(
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 company text NOT NULL CHECK (char_length(company) BETWEEN 2 AND 120),
 contact_name text NOT NULL CHECK (char_length(contact_name) BETWEEN 2 AND 100),
 email text NOT NULL CHECK (char_length(email) <= 255),
 budget_range text NOT NULL CHECK (budget_range IN ('lt1000','1000-5000','5000-20000','gt20000')),
 message text NOT NULL DEFAULT '' CHECK (char_length(message) <= 1000),
 privacy_consent boolean NOT NULL CHECK (privacy_consent),
 created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.sponsor_inquiries TO anon, authenticated;
GRANT ALL ON public.sponsor_inquiries TO service_role;
ALTER TABLE public.sponsor_inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY sponsor_inquiries_insert_only ON public.sponsor_inquiries FOR INSERT TO anon, authenticated WITH CHECK (privacy_consent = true);