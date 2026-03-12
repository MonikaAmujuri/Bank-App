import Counter from "../models/Counter.js";

export const generateUserId = async () => {
  const counter = await Counter.findOneAndUpdate(
    { name: "userId" },
    { $inc: { sequence: 1 } },
    { new: true, upsert: true }
  );

  const paddedNumber = String(counter.sequence).padStart(4, "0");

  return `USR${paddedNumber}`;
};