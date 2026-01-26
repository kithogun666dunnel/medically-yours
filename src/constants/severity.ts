/* -------------------- SEVERITY LEVELS --------------------
   Numeric severity levels used primarily for
   legacy dashboard sorting and triage.
---------------------------------------------------------- */


export const SEVERITY = {
  NORMAL: 1,
  EMERGENCY: 2,
};


/*
✅ What this file does

Severity levels ke numeric representation define karta hai

Legacy dashboard + triage logic ko support karta hai

🧠 Why numbers (not strings)

Numbers are used because:

DB sorting fast hoti hai

2 > 1 naturally emergency-first

indexes simple hote hain

This is especially useful in:

.sort({ severity: -1 })

⚠️ Important architectural context

Severity:

❌ canonical Case model ka core nahi hai

✅ legacy dashboard ka concept hai

future me ML / rules-based severity aa sakta hai

Isliye:

severity ko constant rakha gaya

service me hardcode nahi kiya

Good call.

🔒 Boundary rule

❌ New lifecycle logic severity pe mat banao

❌ WhatsApp core flow ispe depend na kare

✅ Dashboard / triage ke liye OK

*/