import PatientCase from "../models/PatientCase.model.js";

export const getDoctorDashboard = async (req, res) => {
  const cases = await PatientCase.find({ status: "OPEN" }).sort({
    severity: -1,
    createdAt: -1,
  });

  const emergencyCases = cases.filter((c) => c.severity === 2);
  const normalCases = cases.filter((c) => c.severity === 1);

  res.json({
    emergencyCases,
    normalCases,
  });
};
