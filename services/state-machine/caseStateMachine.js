// services/state-machine/caseStateMachine.js

const handleInboundMessage = async (message) => {
  const { phone } = message;

  // TEMP: just log, no DB yet
  console.log("[STATE MACHINE] inbound message from:", phone);

  // Later:
  // 1. find open case
  // 2. if none → create
  // 3. else → append
};

export default {
  handleInboundMessage,
};
