/* -------------------- WHATSAPP WEBHOOK CONTROLLER --------------------
   Entry point for inbound WhatsApp messages.
   Ensures normalization, idempotency, and
   safe delegation to business services.
-------------------------------------------------------------------- */


import { registerInboundMessage } from "../../services/whatsapp/idempotency.service";
import { handleInboundMessage } from "../../services/whatsapp/inbound.service";

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


/*

✅ What this controller does

This is the real WhatsApp entry point.

It:

Normalizes inbound Twilio payload

Builds a canonical InboundMessage

Enforces idempotency

Delegates message handling to service

Always returns 200 OK

🧠 Why this controller is special

WhatsApp/Twilio has strict rules:

If webhook fails → Twilio retries

Retries cause duplicate messages

Duplicates cause duplicate cases (disaster)

So this controller:

must never throw

must always ACK

must be idempotent

That’s why error handling looks like this:

catch (error) {
  console.error(...)
  return res.status(200).send("OK");
}


This is intentional, not sloppy.

🔒 Boundary rule

This controller:

❌ does not persist messages itself

❌ does not decide case lifecycle

✅ only coordinates services
*/