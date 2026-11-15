<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## App architecture
- Keep the compact swipe trust dialog in a presentation-only component; explain OCR limitations and simulated payments without changing payment logic.
- Public content uses TanStack content routes with a shared shell; keep protected mutations in authenticated server functions.
- Store anonymous bill fields separately from RF codes and private receipt files; public reads must never expose originals or private identifiers.
- Receipt uploads remain pending until authoritative payment confirmation; demo completion must not modify real payments or rankings.
- Public demo rankings require explicit is_public_demo approval; default new entries to private so future rows cannot leak through the example-data policy.
- Use manifest-only installability without offline caching, so financial data cannot be served from a stale app shell.
- Use session-scoped CSS perspective intro and transform/opacity motion without WebGL; keep deck progression in tested browser-safe helpers and demo completion isolated from real totals.
- AI extraction uses the generated Google chat contract through Lovable Gateway inside a server function; validate extracted RF checksums before publishing.

- Serve the brand logo as an actual PNG at /billwiper-logo.png for all logo displays, so it works independently of Lovable asset serving.

- Persist simulated contributions through an authenticated atomic database function with row locking and idempotency; expose only anonymous aggregates and refresh the shared feed on bill change events.

- Keep bill goals separate from remaining amounts in presentation data; render provider badges and funded progress in a shared card with opacity-only lighting and transform-only motion.
- Public stories use a dedicated anonymous description, never private notes; showcase totals and rankings share approved sample amounts plus recorded simulations, excluding retired test bills.
- Gate existing real-document and receipt handlers with a shared prototype guard while retaining their implementation and historical data; the public feed includes only synthetic rows to avoid reactivating real processing.
- Derive demo XP from recorded distinct bill participation, never contributed amounts; keep verified-impact rankings empty until authoritative verification exists.
- Keep fictional sponsor scenarios and share cards in client-safe presentation modules; projected budgets must never enter contribution totals or persisted payment records.
- Cap open example bills per user in the authenticated create function, so the shared showcase feed cannot be flooded.
- Translate UI through the shared language context (inline Greek/English pairs, shared dictionary for module data, sample stories and server messages); Greek stays the server-rendered default to avoid hydration mismatches.

- Sponsor interest submissions go through a validated server function into an insert-only table; no public read policy, so contact details stay private.
- Admin access uses a separate roles table checked by a security-definer has_role function; never store roles on profiles.
- /admin is client-only and noindex; its data comes only from authenticated server functions that re-check has_role, backed by admin-only RLS on sponsor_inquiries.
- Personal impact reads only the signed-in user's simulated wipe projection through existing own-row RLS; never infer verified results from historical payment statuses without authoritative confirmation.
- Apply the shared luxury presentation layer through global semantic tokens and existing controls, leaving server functions, contribution rules and database policies unchanged.
- Password recovery is a public client-only route authorized only by the SDK recovery event and revalidated user; keep recovery authorization in memory, never infer it from ordinary sessions or editable storage.
- Retire unused real-payment ranking functions by removing visitor/member execution, preserving definitions and historical rows; public rankings remain synthetic-only.
- Resolve the shared validation dependency to the patched version across tooling and application schemas; keep concrete rule tests to prevent validation changes during security updates.
