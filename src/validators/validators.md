Validators ka kaam hota hai:

“System ke andar sirf clean, expected data hi aane dena.”

Ye folder:

❌ business logic nahi rakhta

❌ DB touch nahi karta

✅ external input ko sanitize & validate karta hai

Simple rule:

Garbage in = garbage everywhere
Validators usko gate pe hi rok dete hain.

Validators define the trust boundary.
External inputs are validated once at the edge, so internal code stays clean.”
