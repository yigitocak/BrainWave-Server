import Users from "../models/Users.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendVerificationEmail } from "./helpers/sendVerificationEmail.js";

export const updateAccountView = async (req, res) => {
  const reqUser = req.user;
  const { username, email, password } = req.body;

  if (!reqUser) {
    return res.status(401).json({ message: "Unauthorized", success: false });
  }

  if (!username || !email) {
    return res.status(400).json({ message: "Bad request", success: false });
  }

  if (password && password.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters",
      success: false,
    });
  }

  try {
    const user = await Users.findOne({ email: reqUser.email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    let usernameChanged = false;
    if (username !== user.name) {
      user.name = username;
      usernameChanged = true;
    }

    let needsVerification = false;
    if (email !== reqUser.email) {
      const existingEmail = await Users.findOne({ email });

      if (existingEmail) {
        return res
          .status(409)
          .json({ message: "Email already exists!", success: false });
      }

      const verificationCode = crypto
        .randomBytes(3)
        .toString("hex")
        .toUpperCase();
      user.verificationCode = verificationCode;
      user.verificationCodeExpires = Date.now() + 3600000;
      user.tempEmail = email;
      user.isVerified = false;

      await sendVerificationEmail(email, verificationCode);
      needsVerification = true;
    }

    if (password) {
      const saltRounds = 10;
      user.password = await bcrypt.hash(password, saltRounds);
    }

    await user.save();

    return res.status(200).json({
      message: needsVerification
        ? "Email updated. Please verify your new email."
        : "Account updated successfully!",
      success: true,
      needsVerification: needsVerification,
      updatedUser: {
        username: user.name,
        email: needsVerification ? user.tempEmail : user.email,
      },
    });
  } catch (e) {
    console.error("Error updating account:", e);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};
