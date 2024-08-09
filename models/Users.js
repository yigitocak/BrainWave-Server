import { Schema, model } from "mongoose";

const usersSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    solvedQuestions: [String],
  },
  { timestamps: true },
);

const Users = model("Users", usersSchema);

export default Users;
