import "dotenv/config";

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import twilio from "twilio";
import { initIndexes } from "./db/initIndexes";

import Patient from "./models/Patient.model";
import webhookRoutes from "./routes/webhook.routes";
import doctorRoutes from "./routes/doctor.routes";
import caseRoutes from "./routes/case.routes";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

/* -------------------- MIDDLEWARES -------------------- */
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* -------------------- ROUTES -------------------- */
app.use("/webhook", webhookRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api", caseRoutes);

app.get("/", (req, res) => {
  res.send("WhatsApp Bot Backend Running 🚀");
});

/* -------------------- ERROR HANDLER -------------------- */
app.use(errorHandler);

/* -------------------- DB -------------------- */

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(async () => {
    console.log("MongoDB connected ✅");

    await initIndexes();
    console.log("Indexes synced ✅");
  })
  .catch((err) => {
    console.error("Mongo error ❌", err);
    process.exit(1);
  });

/* -------------------- TWILIO -------------------- */
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

/* -------------------- SERVER -------------------- */
app.listen(3000, () => {
  console.log("Server running on port 3000 🚀");
});
