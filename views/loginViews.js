import Users from "../models/Users.js";
import bcrypt from "bcrypt";
import { generateTokenAndSetCookie } from "./helpers/token.js";
import { sendVerificationEmail } from "./helpers/sendVerificationEmail.js";
import crypto from "crypto";

export const loginUserView = async (req, res) => {
  const { email, password, rememberMe } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Bad request body! Email and password are required.",
      success: false,
    });
  }

  try {
    const user = await Users.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found!", success: false });
    }

    if (!user.isVerified) {
      const newVerificationCode = crypto
        .randomBytes(3)
        .toString("hex")
        .toUpperCase();
      user.verificationCode = newVerificationCode;
      user.verificationCodeExpires = Date.now() + 3600000;
      await user.save();

      await sendVerificationEmail(user.email, newVerificationCode);

      return res.status(200).json({
        message:
          "User not verified! Please verify your account. A new verification code has been sent to your email.",
        success: false,
        isVerified: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Invalid credentials.",
        success: false,
      });
    }

    await generateTokenAndSetCookie(user, rememberMe, res);

    return res.status(200).json({
      message: "Login successful!",
      success: true,
      tokenProvided: true,
      username: user.name,
      isVerified: true,
    });
  } catch (e) {
    console.error("Internal Error during login:", e);
    return res
      .status(500)
      .json({ message: "Internal Server Error!", success: false });
  }
};

export const decodeView = (req, res) => {
  return res.status(200).json({
    decoded: req.user,
    success: true,
  });
};
