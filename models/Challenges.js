import { Schema, model } from "mongoose";

const challengesSchema = new Schema({
  questionId: { type: String, required: true, unique: true },
  question: { type: String, required: true },
  difficulty: { type: String, required: true },
  peopleSolved: { type: Number, required: true },
  title: { type: String, required: true },
});

const Challenges = model("Challenges", challengesSchema);

export default Challenges;
