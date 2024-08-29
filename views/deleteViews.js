import Users from "../models/Users.js";
import bcrypt from "bcrypt";

export const deleteAccountView = async (req, res) => {
  const { password } = req.body;
  const reqUser = req.user;
  const { email } = reqUser;

  if (!reqUser) {
    return res.status(404).json({ message: "User not found", success: false });
  }

  if (!password) {
    return res
      .status(400)
      .json({ message: "Bad request body.", success: false });
  }

  try {
    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "Users not found!",
        success: false,
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({
        message: "Password Incorrect",
        success: false,
      });
    }

    await Users.deleteOne({ email });

    res.clearCookie("authToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    return res.status(200).json({ message: "Account deleted", success: true });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};
