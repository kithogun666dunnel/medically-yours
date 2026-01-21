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
  },
  { timestamps: true },
);

const Case = mongoose.model("Case", caseSchema);

export default Case;
