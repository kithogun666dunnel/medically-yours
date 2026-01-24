import { registerInboundMessage } from "../../services/whatsapp/idempotency.service.ts";
import { handleInboundMessage } from "../../services/whatsapp/inbound.service.ts";

const whatsappWebhookController = async (req, res) => {
  try {
    // 🔒 Normalize at boundary
    const rawFrom = req.body.From;
    const phone = rawFrom.startsWith("whatsapp:")
      ? rawFrom
      : `whatsapp:${rawFrom}`;

    const inboundMessage = {
      phone,
      text: req.body.Body,
      messageId: req.body.MessageSid,
      timestamp: new Date(),
    };

    const { isDuplicate } = await registerInboundMessage(
      inboundMessage.messageId,
      inboundMessage.phone,
    );

    // 🔒 Hard guard: inbound only for new messages
    if (!isDuplicate) {
      await handleInboundMessage(inboundMessage);
    }

    return res.status(200).send("OK");
  } catch (error) {
    console.error("[WHATSAPP WEBHOOK ERROR]", error);
    return res.status(200).send("OK");
  }
};

export default whatsappWebhookController;
