Models answer one question only:

“System kis type ka data maanta hai,
aur us data par kaunse rules kabhi break nahi hone chahiye?”

Important distinction:

❌ Models logic nahi chalate

❌ Models decisions nahi lete

✅ Models truth define karte hain

Services act on models,
models never depend on services.

---in this project

“Models define the data contracts and invariants of the system.
Case and CaseEvent are canonical.
PatientCase and related schemas are legacy and UI-facing.
WhatsappMessage exists purely for idempotency guarantees.”
