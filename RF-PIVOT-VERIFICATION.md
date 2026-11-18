# BILLWIPER RF facilitation pivot

## Delivered
- Real bill submission: provider, amount up to €100, due date, city, 140-character story, checksum-validated 25-character RF, private PDF/image and consent.
- Administrator review publishes only approved anonymous story/city/RF. Original documents never appear publicly; no automatic redaction or provider verification is claimed.
- Active-only deck; direct bill links and native share/copy. Availability is refreshed, but opening bank payments cannot be locked or reversed by this app.
- RF instructions direct users to their own bank. No card collection, wallet or fund transfer.
- Optional private receipt, atomic payment claim and pending-verification state. Administrator confirmation requires an independent-confirmation note.
- Existing sponsor management preserved; historical simulations retained but removed from current flows and totals.
- Existing bills use additive rf_status/rf_provider/public_city fields because their legacy status/provider constraints and historical rows must remain compatible. verifications.receipt_image_url stores a private object path, not a publicly exposed URL.

## Executed checks
- 64 tests passed; four legacy ranking integration tests skipped because their separate token configuration was absent.
- Signed-in UI: temporary image submission → pending review → existing admin approval → active card → RF modal → cancellation → payment claim without receipt → pending state and removal from deck → private history readback → admin paid transition.
- No money was sent and no provider confirmation occurred. The paid transition was a QA state test, not a real settlement.
- Phone 360×559: card footer inside card bounds, no internal overflow. Seven public/account/admin/detail surfaces checked at 360×559 and 1280×1800 without horizontal overflow or page exceptions.
- Anonymous private submission and verification reads returned zero rows; anonymous claim denied.
- Latest preview compilation reported build OK.
- Temporary QA bills, claims and unattached uploaded files removed. No admin roles created or changed.

## Remaining before real operation
- Legal review: zero fund handling is not a guarantee of exemption from financial or privacy regulation. Establish controller details and retention rules.
- Staff must actually inspect documents, ensure anonymous copy and independently confirm settlement. No provider API or automatic redaction exists.
- Receipt-file submission with a genuine bank receipt, bank RF acceptance, native shares in installed TikTok/Instagram/WhatsApp and physical-device/PWA behavior require manual testing.
- Concurrent bank payments remain possible before claims arrive. A claim hides a bill, but cannot undo a bank transfer. Pending claims need operational follow-up; no rejection/reopening workflow was requested.
- Existing custom-domain Google and genuine recovery issues remain outside this pivot. No auth/DNS/provider settings were changed.
- Deploy the new code to Vercel before using the changed database workflow on production. Old simulation calls are intentionally no longer executable.
