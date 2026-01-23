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
