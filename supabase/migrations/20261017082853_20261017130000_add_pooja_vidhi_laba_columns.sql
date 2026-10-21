/*
# Add scriptural procedure and benefits to poojas

1. Purpose
- Store the scripturally prescribed procedure (शास्त्रोक्त विधि) and the scriptural benefits/perks (शास्त्रोक्त लाभ) for each pooja so they can be displayed on the pooja detail page.

2. Modified Tables
- `poojas`: add two new nullable text columns — `vidhi` (procedure) and `laba` (benefits). Existing rows keep their current values; only newly-inserted or updated rows receive content.

3. Security
- No new tables or policies. Existing RLS on `poojas` continues to protect the table.
- Public read access is unchanged — the new columns are readable by anon + authenticated through the existing `public_read_poojas` policy.

4. Important Notes
- Non-destructive: no existing columns are dropped or renamed.
- All existing pooja data is preserved.
*/

ALTER TABLE poojas
  ADD COLUMN IF NOT EXISTS vidhi text DEFAULT '',
  ADD COLUMN IF NOT EXISTS laba text DEFAULT '';