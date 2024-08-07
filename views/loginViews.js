import knex from "knex";
import knexfile from "../knexfile.js";
import bcrypt from "bcrypt";
const db = knex(knexfile.development);
import { generateTokenAndSetCookie } from "./helpers/token.js";
import "dotenv/config";

export const loginUserView = async (req, res) => {
  const { email, password, rememberMe } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Bad request body.",
    });
  }

  try {
    const user = await db("users").where({ email }).first();
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({
        message: "Invalid Login",
        success: false,
      });
    }

    generateTokenAndSetCookie(user, rememberMe, res);
    console.log(user.name);

    return res.status(200).json({
      success: true,
      tokenProvided: true,
      userName: user.name,
      message: rememberMe ? "Logged in for 7 days" : "Logged in for 12 hours",
    });
  } catch (e) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const decodeView = (req, res) => {
  return res.status(200).json({
    message: "Login Successful",
    success: true,
  });
};
