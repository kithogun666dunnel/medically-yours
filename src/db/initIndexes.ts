import { Case } from "../models/Case.model";
import { WhatsappMessage } from "../models/WhatsappMessage.model";

/**
 * MongoDB migration substitute.
 * Ensures all critical indexes are created at startup.
 */
export async function initIndexes(): Promise<void> {
  await Case.syncIndexes();
  await WhatsappMessage.syncIndexes();
}


/*

✅ What this file does

This file ensures that critical database invariants actually exist when the app runs.

Specifically:

Ensures Case partial unique index exists
→ one OPEN case per patient

Ensures WhatsappMessage unique index exists
→ idempotency guarantee

This runs at startup and makes sure MongoDB schema is not silently wrong.

🧠 Why this is important (very underrated)

MongoDB does not auto-create indexes reliably in prod-like setups.

If indexes are missing:

idempotency breaks

race conditions leak

system becomes “randomly buggy”

This file acts as:

a lightweight migration system

No heavy migration framework, but critical invariants are enforced.

🔒 Boundary rule

❌ No business logic

❌ No data mutation

✅ Only schema/index correctness
*/