// controllers/whatsapp/whatsappWebhook.controller.js

// import caseStateMachine from "../../services/state-machine/caseStateMachine.js";
// import { handleIncomingMessage } from "../../services/state-machine/caseStateMachine.js";

const whatsappWebhookController = async (req, res) => {
  try {
    /**
     * STEP 1: Normalize inbound payload
     */
    const inboundMessage = {
      phone: req.body.From, // whatsapp:+91xxxx
      text: req.body.Body,
      messageId: req.body.MessageSid,
      timestamp: new Date(),
    };

    /**
     * STEP 2: Legacy state machine bypassed
     * Layer-6 inbound flow will replace this
     */
    console.log(
      "[LEGACY] Inbound WhatsApp message ignored during Layer-6 migration",
      inboundMessage,
    );

    /**
     * STEP 3: Respond immediately
     */
    return res.status(200).send("OK");
  } catch (error) {
    console.error("[WHATSAPP WEBHOOK ERROR]", error);
    return res.status(500).send("Internal Server Error");
  }
};

export default whatsappWebhookController;
