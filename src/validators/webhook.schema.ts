/* -------------------- WEBHOOK VALIDATION SCHEMA --------------------
   Validates and sanitizes inbound WhatsApp webhook payloads.
   Ensures controllers and services receive trusted input.
------------------------------------------------------------------ */


import { z } from "zod";

export const whatsappWebhookSchema = z.object({
  from: z.string().min(5),
  message: z.string().min(1),
});


/*
✅ What this validator does

Ye schema validate karta hai:

WhatsApp webhook se aane wala sender

aur message body

Specifically:

from → non-empty, reasonable length

message → empty message reject

Iska matlab:

Controller assume kar sakta hai ki:

from string hai

message string hai

dono non-empty hain

🧠 Why validation happens HERE (not in service)

Ye decision bahut important hai 👇

Validation:

✅ controller boundary pe hoti hai

❌ service ke andar nahi

Reason:

Services assume trusted input

Services reusable hote hain (cron, jobs, system calls)

HTTP-specific validation services ko pollute karega

So flow becomes:

HTTP → Validator → Controller → Service


Clean separation.

🔒 Error-handling design

Jab schema fail hota hai:

Zod throws error

Controller catch karta hai

400 response bhejta hai

Service tak:

kabhi invalid data pahunchta hi nahi

This reduces defensive code everywhere else.

*/