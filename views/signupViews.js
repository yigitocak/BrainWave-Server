import knex from "knex";
import knexFile from "../knexfile.js";
import bcrypt from "bcrypt";
const db = knex(knexFile.development);
import { generateTokenAndSetCookie } from "./helpers/token.js";

export const signUpUser = async (req, res) => {
  const { name, email, password, rememberMe = false } = req.body;

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
    const userExists = await db("users").where({ email }).first();
    if (userExists) {
      return res
        .status(409)
        .json({ message: "Email already exists!", success: false });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await db("users").insert({
      email,
      name,
      password: hashedPassword,
    });

    generateTokenAndSetCookie(user, rememberMe, res);

    return res
      .status(201)
      .json({ message: "Account created successfully!", success: true });
  } catch (e) {
    console.error("Internal Error when creating user:", e);
    return res
      .status(500)
      .json({ message: "Internal Server Error!", success: false });
  }
};
