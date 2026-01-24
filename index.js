import "dotenv/config";
import twilio from "twilio";
import express from "express";
import mongoose from "mongoose";
import Patient from "./models/Patient.model.js";
import webhookRoutes from "./routes/webhook.routes.js";
import doctorRoutes from "./routes/doctor.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import cors from "cors";
import bodyParser from "body-parser";
import caseRoutes from "./routes/case.routes.js";

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json()); // ✅ PEHLE body parser
app.use("/webhook", webhookRoutes); // ✅ PHIR routes
app.use("/api/doctor", doctorRoutes);
app.use(errorHandler);

app.use("/api", caseRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.error("Mongo error ❌", err));

// 🔥 THIS WAS MISSING
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

// IMPORTANT: use express built-in parser
app.use(express.urlencoded({ extended: false }));
app.get("/", (req, res) => {
  res.send("WhatsApp Bot Backend Running 🚀");
});

const userState = {};

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
