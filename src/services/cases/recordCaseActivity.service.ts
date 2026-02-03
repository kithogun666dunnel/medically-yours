import { Types } from "mongoose";
import { CaseActivity } from "../../models/CaseActivity.model";

export interface RecordCaseActivityInput {
  caseId: Types.ObjectId;
  type:
    | "CASE_CREATED"
    | "CASE_CLOSED"
    | "MESSAGE_RECEIVED"
    | "SYSTEM_NOTE"
    | "DOCTOR_NOTE";
  source: "whatsapp" | "doctor" | "system";
  payload?: Record<string, any>;
}

/**
 * Records a human-readable activity against a case.
 * This service NEVER mutates case state.
 */
export async function recordCaseActivity({
  caseId,
  type,
  source,
  payload,
}: RecordCaseActivityInput) {
  await CaseActivity.create({
    caseId,
    type,
    source,
    payload,
    createdAt: new Date(),
  });
}
