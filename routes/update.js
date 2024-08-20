import express from "express";
import authenticateToken from "../middlewares/authenticateToken.js";
import { updateAccountView } from "../views/updateViews.js";
const update = express.Router();

update.post("/", authenticateToken, updateAccountView);

export default update;
