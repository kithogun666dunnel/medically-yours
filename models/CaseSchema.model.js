import mongoose from "mongoose";

const caseSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["OPEN", "CLOSED"],
      default: "OPEN",
      index: true,
    },
    closedAt: {
      type: Date,
    },
    notes: {
      type: String,
      default: "",
    },
    overrideSeverity: {
      type: String,
      enum: ["EMERGENCY", "NORMAL", null],
      default: null,
    },
  },
  { timestamps: true },
);

const Case = mongoose.model("Case", caseSchema);

export default Case;
