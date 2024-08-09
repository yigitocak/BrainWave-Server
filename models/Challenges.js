import { Schema, model } from "mongoose";

const challengesSchema = new Schema({
  questionId: { type: String, required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  peopleSolved: { type: Number, required: true },
});

const Challenges = model("Challenges", challengesSchema);

export default Challenges;
