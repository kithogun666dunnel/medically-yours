import { Case } from "../../models/Case.model";
import { CaseEvent } from "../../models/CaseEvent.model";

export interface CloseCaseInput {
  caseId: string;
  reason?: string;
  actor?: "doctor" | "system";
}

/**
 * Closes an OPEN case.
 * Operation is idempotent: closing an already CLOSED case is a no-op.
 */
export async function closeCase({
  caseId,
  reason,
  actor = "doctor",
}: CloseCaseInput): Promise<void> {
  // 1️⃣ Try to transition OPEN → CLOSED atomically
  const updatedCase = await Case.findOneAndUpdate(
    {
      _id: caseId,
      status: "OPEN",
    },
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

  // 2️⃣ If no case was updated, it was either:
  // - already CLOSED
  // - or invalid ID
  // In both cases, we do nothing (idempotent behavior)
  if (!updatedCase) {
    return;
  }

  // 3️⃣ Emit audit event
  await CaseEvent.create({
    caseId: updatedCase._id,
    eventType: "CASE_CLOSED",
    actorType: actor,
    metadata: {
      reason,
    },
    createdAt: new Date(),
  });
}
