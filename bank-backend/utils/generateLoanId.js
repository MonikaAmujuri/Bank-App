import Counter from "../models/Counter.js";

export const generateLoanId = async () => {
  const counter = await Counter.findOneAndUpdate(
    { name: "loanId" },
    { $inc: { sequence: 1 } },
    { new: true, upsert: true }
  );

  const paddedNumber = String(counter.sequence).padStart(4, "0");

  return `LOAN${paddedNumber}`;
};