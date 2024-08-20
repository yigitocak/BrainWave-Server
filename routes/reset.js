import express from "express";
import {
  sendPasswordResetLink,
  resetPassword,
} from "../views/controllers/passwordResetController.js";

const resetRouter = express.Router();

resetRouter.post("/send", sendPasswordResetLink);
resetRouter.post("/reset/:token", resetPassword);

export default resetRouter;
