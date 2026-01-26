/* -------------------- CASE CONTROLLER --------------------
   HTTP adapter for case lifecycle actions.
   This controller intentionally delegates all
   business logic to the service layer.
--------------------------------------------------------- */


import { closeCase } from "../services/cases/closure.service";

export const closeCaseController = async (req, res, next) => {
  try {
    const { id } = req.params;

    await closeCase({
      caseId: id,
      actor: "doctor",
    });

    return res.json({
      status: "success",
      message: "Case closed",
    });
  } catch (err) {
    next(err);
  }
};



/*

✅ What this controller does

Handles HTTP request for closing a case

Extracts caseId from URL params

Delegates entire business decision to closeCase service

Returns a simple success response

That’s it.

🧠 Why this controller is designed this way

Important design decision here 👇

await closeCase({
  caseId: id,
  actor: "doctor",
});


Controller:

❌ does NOT check if case exists

❌ does NOT check if already closed

❌ does NOT create audit events

All of that happens in service layer.

👉 Reason:

Same service can later be used by:

system jobs

WhatsApp automation

admin tools

Controller is just one of many entry points.

🔒 Boundary rule (this is critical)

If you ever see code like this inside controller:

Case.findById(...)


👉 that’s a violation.

Controller should only know:

request

response

service contract

*/