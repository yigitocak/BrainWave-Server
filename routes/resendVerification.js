import express from "express";
const resendVerification = express.Router();
import { resendVerificationCode } from "../views/resendVerificationViews.js";

resendVerification.post("/", resendVerificationCode);

export default resendVerification;
