/* -------------------- CASE EVENT TYPES --------------------
   Centralized list of all allowed case lifecycle
   event identifiers used across the system.
---------------------------------------------------------- */


export enum CASE_EVENT_TYPE {
  CASE_CREATED = "CASE_CREATED",
  CASE_CLOSED = "CASE_CLOSED",
}



/*
✅ What this file does

Case lifecycle ke allowed event types define karta hai

Audit trail (CaseEvent) ke liye vocabulary fix karta hai

Instead of:

type: "CASE_CLOSED"


You want:

type: CASE_EVENT_TYPE.CASE_CLOSED

🧠 Why this matters (future-proofing)

Aaj sirf 2 events hain:

CASE_CREATED

CASE_CLOSED

Kal ho sakte hain:

CASE_REOPENED

CASE_ESCALATED

CASE_ASSIGNED

Agar strings scattered hoti:

koi "case_closed"

koi "CASE-CLOSED"

analytics toot jaata

Enum ensures:

one spelling

one meaning

one upgrade path

🔒 Boundary rule

❌ Business logic yahan nahi

❌ Event creation yahan nahi

✅ Sirf allowed values

*/