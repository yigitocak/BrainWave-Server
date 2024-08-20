import Users from "../models/Users.js";
import { generateTokenAndSetCookie } from "./helpers/token.js";

export const verifyUser = async (req, res) => {
  const { email, verificationCode, rememberMe } = req.body;

  try {
    const user = await Users.findOne({
      $or: [{ email }, { tempEmail: email }],
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found!",
        success: false,
      });
    }

    if (
      user.verificationCode !== verificationCode ||
      Date.now() > user.verificationCodeExpires
    ) {
      return res.status(400).json({
        message: "Invalid or expired verification code!",
        success: false,
      });
    }

    if (user.tempEmail && user.tempEmail === email) {
      user.email = user.tempEmail;
      user.tempEmail = undefined;
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    generateTokenAndSetCookie(user, rememberMe, res);

    return res.status(200).json({
      message: "Account verified successfully!",
      success: true,
    });
  } catch (e) {
    console.error("Internal Error during verification:", e);
    return res
      .status(500)
      .json({ message: "Internal Server Error!", success: false });
  }
};
