import { z } from "zod";

export const whatsappWebhookSchema = z.object({
  from: z.string().min(5),
  message: z.string().min(1),
});
