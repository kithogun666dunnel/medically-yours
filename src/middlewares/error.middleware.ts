
/* -------------------- GLOBAL ERROR HANDLER --------------------
   Centralized error handling middleware.
   Ensures consistent error responses and logging
   across the entire application.
-------------------------------------------------------------- */


export const errorHandler = (err, req, res, next) => {
  console.error("❌ ERROR:", err.message);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    status: "error",
    message: err.message || "Something went wrong",
  });
};


/*
✅ What this middleware does

This is the global error sink.

Jo bhi error:

controller me throw ho

service se bubble ho

async handler me fail ho

👉 sab yahin land karta hai.

Instead of:

har controller me try/catch + response

inconsistent error formats

You get:

single place

consistent error shape

🧠 Why this is important (design reason)

Without global error middleware:

koi controller res.json({error})

koi res.send("fail")

koi silently crash

With this:

{
  "status": "error",
  "message": "Case not found"
}


Always predictable.

This is API contract discipline.

🔒 Important boundary rule

Middleware:

❌ business decisions nahi leta

❌ retry logic nahi karta

❌ DB touch nahi karta

It only:

logs

formats

responds

🧠 Why err.statusCode || 500

This allows:

services / controllers to throw typed errors later

Example (future):

const err = new Error("Unauthorized");
err.statusCode = 401;
throw err;


Middleware already supports this pattern.

That’s forward-compatible design.

*/