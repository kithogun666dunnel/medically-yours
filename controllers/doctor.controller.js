import PatientCase from "../models/PatientCase.model.js";
import { SEVERITY } from "../constants/severity.js";

export const getDoctorDashboard = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // 🔥 DB does the real work
  const cases = await PatientCase.find({ status: "OPEN" })
    .sort({ severity: -1, createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await PatientCase.countDocuments({ status: "OPEN" });

  // 🧠 Controller sirf data ko shape de raha hai
  const emergencyCases = cases.filter((c) => c.severity === SEVERITY.EMERGENCY);

  const normalCases = cases.filter((c) => c.severity === SEVERITY.NORMAL);

  res.json({
    status: "success",
    data: {
      emergencyCases,
      normalCases,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    },
  });
};

export const closePatientCase = async (req, res) => {
  const { id } = req.params;

  const caseDoc = await PatientCase.findById(id);

  if (!caseDoc) {
    return res.status(404).json({
      status: "error",
      message: "Case not found",
    });
  }

  if (caseDoc.status === "CLOSED") {
    return res.status(400).json({
      status: "error",
      message: "Case already closed",
    });
  }

  caseDoc.status = "CLOSED";
  await caseDoc.save();

  res.json({
    status: "success",
    message: "Case closed successfully",
  });
};

//
