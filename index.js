import "dotenv/config";
import twilio from "twilio";
import express from "express";
import mongoose from "mongoose";
import Patient from "./models/Patient.model.js";

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.error("Mongo error ❌", err));

const app = express();

// 🔥 THIS WAS MISSING
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

// IMPORTANT: use express built-in parser
app.use(express.urlencoded({ extended: false }));
app.get("/", (req, res) => {
  res.send("WhatsApp Bot Backend Running 🚀");
});

const userState = {};

app.post("/webhook/whatsapp", async (req, res) => {
  try {
    const from = req.body?.From;
    const msgRaw = req.body?.Body || "";
    const msg = msgRaw.trim().toLowerCase();

    if (!from || !msg) {
      return res.status(200).type("text/xml").send(`
        <Response><Message>Invalid input</Message></Response>
      `);
    }

    // 🚨 ABSOLUTE EMERGENCY OVERRIDE (STATE RESET)

    if (msg.includes("emergency")) {
      userState[from] = { step: "EMERGENCY" };

      // 🔥 YAHAN SAVE KAR DB ME
      await Patient.create({
        whatsapp: from,
        symptoms: msgRaw,
        status: "EMERGENCY",
      });
      // 📲 Notify doctor
      await client.messages.create({
        from: process.env.TWILIO_WHATSAPP_FROM,
        to: process.env.DOCTOR_WHATSAPP,
        body: `🚨 EMERGENCY ALERT
Patient: ${from}
Message: "${msgRaw}"`,
      });

      return res.status(200).type("text/xml").send(`
    <Response>
      <Message>🚨 Emergency noted.</Message>
    </Response>
  `);
    }

    // 🟢 NORMAL FLOW (only if NOT emergency)
    if (!userState[from]) {
      userState[from] = { step: "IDLE" };
    }

    let reply = "";

    if (userState[from].step === "IDLE") {
      userState[from].step = "COLLECT_SYMPTOMS";
      reply = "Please describe your symptoms.";
    } else if (userState[from].step === "COLLECT_SYMPTOMS") {
      userState[from].symptoms = msgRaw;
      userState[from].step = "DONE";

      // 🔥 YAHAN SAVE KAR DB ME
      await Patient.create({
        whatsapp: from,
        symptoms: msgRaw,
        status: "NORMAL",
      });

      reply = `Thanks 🙏
Your symptoms have been noted:
"${msgRaw}"
Doctor will review shortly.`;
    } else {
      reply = "We already have your details. Doctor will get back to you.";
    }

    res.status(200).type("text/xml").send(`
      <Response><Message>${reply}</Message></Response>
    `);
  } catch (err) {
    console.error("WEBHOOK ERROR:", err);
    res.status(200).type("text/xml").send(`
      <Response><Message>Received</Message></Response>
    `);
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
