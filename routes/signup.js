import express from "express";
const signup = express.Router();
import { signUpUser } from "../views/signupViews.js";

signup.post("/", signUpUser);

export default signup;
