import knex from "knex";
import knexFile from "../knexfile.js";
import bcrypt from "bcrypt";
const db = knex(knexFile.development);

export const signUpUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(401)
      .json({ message: "Bad request body!", success: false });
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    return res.status(401).json({ message: "Invalid email!", success: false });
  }

  if (password.length < 6)
    return res.status(401).json({
      message: "Password must be at least 6 characters.",
      success: false,
    });

  const userExists = await db("users").where({ email }).first();
  if (userExists)
    return res
      .status(409)
      .json({ message: "Email already exist!", success: false });

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  try {
    await db("users").insert({
      email,
      name,
      password: hashedPassword,
    });
    return res
      .status(200)
      .json({ message: "Account created successfully!", success: true });
  } catch (e) {
    console.log("Error:", e);
    return res
      .status(500)
      .json({ message: "Internal Server Error!", success: false });
  }
};
