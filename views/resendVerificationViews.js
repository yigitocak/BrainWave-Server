import Users from "../models/Users.js";
import { sendVerificationEmail } from "./helpers/sendVerificationEmail.js";
import crypto from "crypto";

export const resendVerificationCode = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      message: "Bad request body! Email is required.",
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

    if (user.isVerified) {
      return res.status(400).json({
        message: "This account is already verified.",
        success: false,
      });
    }

    const verificationCode = crypto
      .randomBytes(3)
      .toString("hex")
      .toUpperCase();
    const verificationCodeExpires = Date.now() + 3600000;

    user.verificationCode = verificationCode;
    user.verificationCodeExpires = verificationCodeExpires;

    await user.save();

    await sendVerificationEmail(email, verificationCode);

    return res.status(200).json({
      message: "Verification code resent successfully!",
      success: true,
    });
  } catch (e) {
    console.error("Internal Error during resending verification:", e);
    return res
      .status(500)
      .json({ message: "Internal Server Error!", success: false });
  }
};
