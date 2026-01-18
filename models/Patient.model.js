import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  whatsapp: {
    type: String,
    required: true,
  },
  symptoms: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["NORMAL", "EMERGENCY"],
    default: "NORMAL",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Patient = mongoose.model("Patient", patientSchema);

export default Patient;
