// LEGACY FILE — DO NOT USE
// This file is kept ONLY to satisfy existing imports.
// Real case lifecycle is being rebuilt in Layer 6 (TypeScript).

export async function handleIncomingMessage() {
  throw new Error(
    "caseStateMachine.handleIncomingMessage is deprecated. Use Layer-6 services.",
  );
}


/*
✅ What this file does

Nothing useful

Throws error on usage

🧠 Why this file exists

This file exists on purpose:

Older code imported it

Removing it would break runtime

Keeping it prevents accidental use

This is called a poison pill pattern:

“If you touch this, it will scream.”

🔒 Boundary rule

❌ Never import this

❌ Never add logic here

✅ Delete only when legacy fully removed

*/