import { Case } from "../../models/Case.model";
import { CaseEvent } from "../../models/CaseEvent.model";
import { reactionDispatcher } from "../../reactions";
import { recordCaseActivity } from "./recordCaseActivity.service";

export async function createCase({
  patientPhone,
  actor = "system",
}) {
  let openCase;

  try {
    openCase = await Case.create({
      patientPhone,
      status: "OPEN",
      openedAt: new Date(),
    });
  } catch (error: any) {
    if (error?.code === 11000) {
      openCase = await Case.findOne({
        patientPhone,
        status: "OPEN",
      });
    } else {
      throw error;
    }
  }

  if (!openCase) return;

  // 1️⃣ audit event (system memory)
  const event = await CaseEvent.create({
    caseId: openCase._id,
    type: "CASE_CREATED",
    actorType: actor,
  });

  // 2️⃣ activity (human timeline)
  await recordCaseActivity({
    caseId: openCase._id,
    type: "CASE_CREATED",
    source: "system",
  });

  // 3️⃣ reaction announcement (nervous system)
  await reactionDispatcher.dispatch({
    _id: event._id.toString(),
    type: event.type,
  });

  return openCase;
}
