const whatsappWebhookController = async (req, res) => {
  try {
    const inboundMessage = {
      phone: req.body.From,
      text: req.body.Body,
      messageId: req.body.MessageSid,
      timestamp: new Date(),
    };

    const { isDuplicate } = await registerInboundMessage(
      inboundMessage.messageId,
      inboundMessage.phone,
    );

    if (isDuplicate) {
      return res.status(200).send("OK");
    }

    await handleInboundMessage(inboundMessage);

    return res.status(200).send("OK");
  } catch (error) {
    console.error("[WHATSAPP WEBHOOK ERROR]", error);
    return res.status(200).send("OK");
  }
};

export default whatsappWebhookController;
