/* -------------------- CASE CLOSURE SERVICE --------------------
   Owns the invariant for closing a case.
   Guarantees idempotency, atomic state transition,
   and audit event emission.
------------------------------------------------------------- */

import { Case } from "../../models/Case.model";
import { CaseEvent } from "../../models/CaseEvent.model";
import { reactionDispatcher } from "../../reactions";


/**
 * Closes an OPEN case.
 * Idempotent operation.
 */
export async function closeCase({ caseId, reason, actor = "doctor" }) {
  const updatedCase = await Case.findOneAndUpdate(
    { _id: caseId, status: "OPEN" },
    {
      $set: {
        status: "CLOSED",
        closedAt: new Date(),
        closedBy: actor,
        closedReason: reason,
      },
    },
    { new: true }
  );

  // idempotency guard
  if (!updatedCase) return;
  
  // create audit event
  const event = await CaseEvent.create({
    caseId: updatedCase._id,
    type: "CASE_CLOSED",
    actorType: actor,
    meta: reason ? { reason } : undefined,
  });
  console.log("CASE EVENT CREATED:", event._id.toString());

  // 🔔 announce event to reaction layer
  await reactionDispatcher.dispatch({
    _id: event._id.toString(),
    type: event.type,
  });
}


/*
✅ What this service does

Attempts to close a case

Only if case is currently OPEN

Emits an immutable audit event

Does nothing if case is already closed

This is a pure domain operation:

“Close a case if possible.”

🧠 Why this logic lives in a service (not controller)

Look carefully at this query 👇

Case.findOneAndUpdate(
  { _id: caseId, status: "OPEN" },
  { $set: { status: "CLOSED", ... } }
)


This single line guarantees:

❌ No double close

❌ No race condition

❌ No need for manual checks

This is a business invariant, not HTTP logic.

If this lived in controller:

every entry point would reimplement it

bugs would multiply

🔒 Idempotency (VERY important concept)
if (!updatedCase) return;


Meaning:

case doesn’t exist OR

case already closed

👉 both treated the same
👉 no error thrown
👉 safe for retries

This is intentional and critical for distributed systems.

🧾 Audit trail responsibility
await CaseEvent.create({
  caseId: updatedCase._id,
  type: "CASE_CLOSED",
  actorType: actor,
  meta: reason ? { reason } : undefined,
});


Why service creates events:

Event must exist only if state actually changed

Controller can’t guarantee that

Service knows the truth

*/