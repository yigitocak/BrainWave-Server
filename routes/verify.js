import express from "express";
const verify = express.Router();
import { verifyUser } from "../views/verifyViews.js";

verify.post("/", verifyUser);

export default verify;
