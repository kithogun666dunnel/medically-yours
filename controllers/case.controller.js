import Case from "../models/CaseSchema.model.js";

const getCases = async (req, res) => {
  try {
    const { status } = req.query;

    const query = {};
    if (status) query.status = status;

    const cases = await Case.find(query).sort(
      status === "CLOSED" ? { closedAt: -1 } : { updatedAt: -1 },
    );

    res.json(cases);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cases" });
  }
};

const closeCase = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Case.findByIdAndUpdate(
      id,
      {
        status: "CLOSED",
        closedAt: new Date(),
      },
      { new: true },
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to close case" });
  }
};
const updateCaseNotes = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const updated = await Case.findByIdAndUpdate(id, { notes }, { new: true });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update notes" });
  }
};

export { getCases, closeCase, updateCaseNotes };
