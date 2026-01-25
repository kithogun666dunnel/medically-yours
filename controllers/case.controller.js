import { Case } from "../models/Case.model.ts";
import CaseEvent from "../models/CaseEvent.model.ts";

const closeCase = async (req, res) => {
  // console.log("🔥 closeCase controller HIT");
  // console.log("👉 req.params.id =", req.params.id);
  // console.log("👉 Case model collection =", Case.collection.name);

  try {
    const { id } = req.params;

    const patientCase = await Case.findById(id);
    // console.log("👉 findById result =", patientCase);

    if (!patientCase) {
      return res.status(404).json({ error: "Case not found" });
    }

    if (patientCase.status === "CLOSED") {
      return res.status(409).json({ error: "Case already closed" });
    }

    patientCase.status = "CLOSED";
    patientCase.closedAt = new Date();
    await patientCase.save();

    await CaseEvent.create({
      caseId: patientCase._id,
      type: "CASE_CLOSED",
    });

    return res.json({ success: true, status: "CLOSED" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to close case" });
  }
};

export { closeCase };
