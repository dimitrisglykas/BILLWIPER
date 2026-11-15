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
- Public content lives on three TanStack routes with a shared shell; keep protected mutations in authenticated server functions.
- Store anonymous bill fields separately from RF codes and private receipt files; public reads must never expose originals or private identifiers.
- Receipt uploads remain pending until authoritative payment confirmation; demo completion must not modify real payments or rankings.
- Public demo rankings require explicit is_public_demo approval; default new entries to private so future rows cannot leak through the example-data policy.
- Use manifest-only installability without offline caching, so financial data cannot be served from a stale app shell.
- Use session-scoped CSS perspective intro and transform/opacity motion without WebGL; keep deck progression in tested browser-safe helpers and demo completion isolated from real totals.
- AI extraction uses the generated Google chat contract through Lovable Gateway inside a server function; validate extracted RF checksums before publishing.

- Serve the brand logo as an actual PNG at /billwiper-logo.png for all logo displays, so it works independently of Lovable asset serving.
