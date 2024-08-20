import Users from "../models/Users.js";
import bcrypt from "bcrypt";
import { sendVerificationEmail } from "./helpers/sendVerificationEmail.js";
import crypto from "crypto";

export const signUpUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Bad request body! Name, email, and password are required.",
      success: false,
    });
  }

  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ message: "Invalid email format!", success: false });
  }

  if (password.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters.",
      success: false,
    });
  }

  try {
    const userExists = await Users.findOne({ email });
    if (userExists) {
      return res
        .status(409)
        .json({ message: "Email already exists!", success: false });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const verificationCode = crypto
      .randomBytes(3)
      .toString("hex")
      .toUpperCase();
    const verificationCodeExpires = Date.now() + 3600000;

    const user = await Users.create({
      name,
      email,
      password: hashedPassword,
      verificationCode,
      verificationCodeExpires,
      solvedQuestions: [],
      onGoingQuestions: [],
      threads: [],
    });

    await sendVerificationEmail(email, verificationCode);

    return res.status(201).json({
      message: "Account created successfully! Please verify your email.",
      success: true,
      needsVerification: true,
    });
  } catch (e) {
    console.error("Internal Error when creating user:", e);
    return res
      .status(500)
      .json({ message: "Internal Server Error!", success: false });
  }
};
