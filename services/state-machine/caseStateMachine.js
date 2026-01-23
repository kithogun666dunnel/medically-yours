// services/state-machine/caseStateMachine.js

import PatientCase from "../../models/PatientCase.model.js";

const handleInboundMessage = async (message) => {
  const { phone, text, messageId, timestamp } = message;

  // 1️⃣ Find open case for this phone
  let openCase = await PatientCase.findOne({
    patientPhone: phone,
    status: "OPEN",
  });

  // 2️⃣ If no open case → create one
  if (!openCase) {
    openCase = await PatientCase.create({
      patientPhone: phone,
      status: "OPEN",
      messages: [
        {
          text,
          messageId,
          timestamp,
        },
      ],
      createdAt: new Date(),
    });

    console.log("[STATE MACHINE] New case created:", openCase._id);
    return;
  }

  // 3️⃣ Else → append message
  openCase.messages.push({
    text,
    messageId,
    timestamp,
  });

  await openCase.save();

  console.log("[STATE MACHINE] Message appended to case:", openCase._id);
};

export default {
  handleInboundMessage,
};
