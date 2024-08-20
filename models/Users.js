import { Schema, model } from "mongoose";

const usersSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    tempEmail: { type: String, unique: true, sparse: true },
    password: { type: String, required: true },
    solvedQuestions: [String],
    onGoingQuestions: [Object],
    threads: [Object],
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    verificationCode: { type: String },
    verificationCodeExpires: { type: Date },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const Users = model("Users", usersSchema);

export default Users;
