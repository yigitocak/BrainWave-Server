import jwt from "jsonwebtoken";
import knex from "knex";
import knexFile from "../knexfile.js";
import bcrypt from "bcrypt";
const db = knex(knexFile.development);

export const loginViews = async (req, res) => {
  const { email, password, rememberMe } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: "Bad request body! Email and password are required.",
      success: false,
    });
  }

  try {
    const user = await db("users").where({ email }).first();
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found!", success: false });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res
        .status(401)
        .json({ message: "Password doesn't match", success: false });
    }

    const SECRET_KEY = process.env.SECRET_KEY;
    if (!SECRET_KEY) {
      return res.status(500).json({
        message: "Internal server error. SECRET_KEY is not defined.",
        success: false,
      });
    }

    const expiresIn = rememberMe ? "7d" : "12h";
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      SECRET_KEY,
      { expiresIn },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 12 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: rememberMe ? "Logged in for 7 days" : "Logged in for 12 hours",
    });
  } catch (e) {
    console.error("Internal Error when logging user:", e);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};
