🟢 ENTRY POINTS (2 worlds) -- high level view --

Your backend has two entry worlds:

1️⃣ WhatsApp (machine → system)
2️⃣ Doctor Dashboard (human → system)

They are intentionally separate.

🌍 WORLD 1: WhatsApp → Case Lifecycle (CANONICAL)
Step 1: WhatsApp hits webhook
POST /webhook/whatsapp

→ webhook.routes.ts
→ controllers/whatsapp/whatsappWebhook.controller.ts

Step 2: Boundary normalization

Controller:

normalizes phone (whatsapp:+91…)

extracts MessageSid

builds InboundMessage

Why?

Twilio payload ≠ internal contract

Step 3: Idempotency gate
registerInboundMessage()

tries to insert MessageSid

duplicate → ignored

new → allowed

Why?

Twilio retries are guaranteed.

This protects the entire system.

Step 4: Inbound message handling
handleInboundMessage()

Service guarantees:

one OPEN case per phone

race-safe creation

DB-enforced invariant

This is where:

“a patient conversation becomes a Case”

Step 5: Case lifecycle evolves

Later:

POST /cases/:id/close

→ case.controller.ts
→ closeCase() service

Service guarantees:

atomic OPEN → CLOSED

idempotency

audit event creation

Step 6: Audit trail
CaseEvent.create({ CASE_CLOSED })

Now you have:

current state (Case)

historical truth (CaseEvent)

This is real backend maturity.

🌍 WORLD 2: Doctor Dashboard (LEGACY / UI-centric)

Routes:

GET /api/doctor/dashboard
PATCH /api/doctor/cases/:id/close
GET /api/doctor/cases/closed

These:

use PatientCase model

do severity sorting

embed messages

are CRUD-ish

Why still here?

Migration is incremental, production-safe.

Rule:

No new logic goes here.

🧠 SYSTEM GUARANTEES (VERY IMPORTANT)

Your backend guarantees:

1️⃣ One OPEN case per patient
2️⃣ Exactly-once WhatsApp processing
3️⃣ Idempotent case closing
4️⃣ Immutable audit trail
5️⃣ Safe under retries & concurrency

These are not accidental — they are enforced at DB + service level.

---

Bilkul bhai. Ab **same end-to-end flow**, **lekin files ke order me**, taaki tum kisi ko repo open karwao aur bolo:

> “Chal, is repo ko files ke hisaab se padhte hain.”

Main isko **guided walkthrough** jaisa likh raha hoon — exactly _how a strong backend engineer reads a codebase_.

---

# 🧭 END-TO-END FLOW — **FILE BY FILE**

Think of this as:
**“Repo reading order + mental execution order”**

---

## 1️⃣ `src/index.ts` — **Application Bootstrap**

### Ye file kya karti hai

- Express app create karti hai
- Global middlewares register karti hai
- Routes mount karti hai
- MongoDB se connect karti hai
- Server start karti hai

### Flow yahin se start hota hai

```ts
const app = express();
```

### Important baat samajhne wali

Is file me:

- ❌ business logic nahi
- ❌ WhatsApp logic nahi
- ❌ Case lifecycle nahi

Iska kaam sirf:

> “System ko zinda karna”

Isliye isko **thin & boring rehna chahiye** — which is good.

---

## 2️⃣ `src/routes/*` — **System ke Doors**

### 2.1 `routes/webhook.routes.ts`

```ts
POST / webhook / whatsapp;
```

- External world (Twilio) ka entry point
- Machine → system traffic
- Auth, UI, session kuch nahi

Is route ka kaam:

> “Is request ko WhatsApp controller tak pahunchana”

---

### 2.2 `routes/case.routes.ts`

```ts
POST /cases/:id/close
```

- Canonical case lifecycle ka API
- Clean, minimal, scoped

Comment batata hai:

```ts
// ONLY case close is enabled
```

Meaning:

> System abhi deliberately limited hai

---

### 2.3 `routes/doctor.routes.ts` (LEGACY)

```ts
GET  /dashboard
PATCH /cases/:id/close
GET  /cases/closed
```

- Old doctor dashboard ke liye
- PatientCase based
- CRUD-ish

Important mental note:

> Ye routes **future design ka reference nahi** hain

---

## 3️⃣ `src/controllers/*` — **HTTP Adapters**

Controllers ka golden rule:

> HTTP samjho, business mat samjho

---

### 3.1 `controllers/whatsapp/whatsappWebhook.controller.ts`

#### Ye controller kya karta hai

1. Twilio payload receive karta hai
2. Phone normalize karta hai
3. MessageSid extract karta hai
4. InboundMessage object banata hai

```ts
const inboundMessage = {
  phone,
  text,
  messageId,
  timestamp,
};
```

#### Phir kya hota hai

- `registerInboundMessage()` call
- duplicate hai? → ignore
- new hai? → process

Ye controller:

- ❌ DB rules nahi jaanta
- ❌ Case kaise banta hai nahi jaanta

Bas bolta hai:

> “Service bhai, ye message dekh lo”

---

### 3.2 `controllers/case.controller.ts`

```ts
POST /cases/:id/close
```

Controller:

- URL se `id` nikaalta hai
- `closeCase()` service ko call karta hai
- Response bhej deta hai

Important:

- ❌ “case exist karta hai?” check nahi
- ❌ “already closed?” check nahi

Kyun?

> Kyunki ye **business rules** hain, HTTP rules nahi

---

### 3.3 `controllers/doctor.controller.ts` (LEGACY)

Yahan:

- DB queries controller me hain
- severity sorting hai
- pagination hai

Ye intentionally “thick” hai because:

> Ye purana codepath hai

Rule:

> Isse naya pattern seekhna mana hai 😄

---

### 3.4 `controllers/webhook.controller.ts` (LEGACY FROZEN)

- Old WhatsApp logic
- Ab sirf “ignored” response deta hai
- Reference ke liye rakha gaya

---

## 4️⃣ `src/services/*` — **System ka Dimaag**

Yahin se **real backend engineering** shuru hoti hai.

---

### 4.1 `services/whatsapp/idempotency.service.ts`

```ts
registerInboundMessage(messageSid);
```

Ye service bolti hai:

> “Is message ko pehle dekha hai ya nahi?”

- Mongo me insert try
- duplicate key error → already processed

Guarantee:

> **Exactly once processing**

Iske bina:

- WhatsApp retries = duplicate cases = chaos

---

### 4.2 `services/whatsapp/inbound.service.ts`

```ts
handleInboundMessage(message);
```

Ye service ka question:

> “Is message ko kaunsa case mile?”

Steps:

1. Is phone ka OPEN case dhundo
2. Nahi mila? → naya banao
3. Race condition? → DB handle karega
4. Case return karo

Invariant:

> Ek phone = ek OPEN case

Controller ko farq nahi padta _kaise_ — bas kaam ho jaye.

---

### 4.3 `services/cases/closure.service.ts`

```ts
closeCase({ caseId });
```

Ye service:

- Atomic OPEN → CLOSED transition karti hai
- Idempotent hai
- Audit event create karti hai

Important query:

```ts
findOneAndUpdate({ _id, status: "OPEN" });
```

Iska matlab:

- Already closed? → kuch nahi
- Invalid id? → kuch nahi
- Retry? → safe

Yeh **distributed-system grade logic** hai.

---

### 4.4 `services/state-machine/*` (LEGACY)

- Intentionally broken
- Agar koi use kare → error mile

Iska purpose:

> “Galti se bhi purana flow mat use karo”

---

## 5️⃣ `src/models/*` — **Truth & Invariants**

Models batate hain:

> “Data ka structure kya hai aur kya kabhi nahi tootna chahiye”

---

### 5.1 `Case.model.ts` (CANONICAL)

- One case per patient
- Lifecycle: OPEN → CLOSED

Critical invariant:

```ts
unique index where status = OPEN
```

System ka backbone yahi hai.

---

### 5.2 `CaseEvent.model.ts`

- Immutable audit log
- Har important action ka record

So you have:

- Current state → `Case`
- History → `CaseEvent`

---

### 5.3 `WhatsappMessage.model.ts`

- Idempotency ke liye infra model
- MessageSid unique

Ye model:

> “System ko reliable banata hai”

---

### 5.4 `PatientCase.model.ts`, `CaseSchema.model.ts`, `Patient.model.ts`

- Legacy / experimental
- UI-centric
- Canonical nahi

Rule:

> New logic yahan add nahi hota

---

## 6️⃣ `src/constants/*` — **Shared Vocabulary**

### `severity.ts`

- UI sorting ke liye numeric severity

### `caseEvents.ts`

- Allowed event names

Purpose:

> Magic strings / numbers ko control me rakhna

---

## 7️⃣ `src/validators/*` — **Trust Boundary**

### `webhook.schema.ts`

- External input validate karta hai
- Zod schema

Flow:

```
External world → validator → controller → service
```

Iske baad system **trusted data** pe kaam karta hai.

---

## 8️⃣ `src/middlewares/error.middleware.ts`

- Central error handler
- Consistent error responses
- Future-ready (`err.statusCode`)

Controllers clean rehte hain is wajah se.

---

## 9️⃣ `src/db/initIndexes.ts`

- Startup pe indexes sync karta hai
- Mongo migrations ka light substitute

Guarantee:

- Invariants actually DB me exist karte hain

---

# 🧠 FINAL ONE-LINE SUMMARY (files ke context me)

Tum apne peer ko aise samjha sakte ho:

> “index.ts app boot karta hai,
> routes system ke doors hain,
> controllers HTTP adapters hain,
> services system ka dimaag hain,
> models invariants enforce karte hain,
> aur legacy code intentionally isolated hai.”
