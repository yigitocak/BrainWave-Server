import express from "express";
import authenticateToken from "../middlewares/authenticateToken.js";
import { deleteAccountView } from "../views/deleteViews.js";
const del = express.Router();

del.delete("/account", authenticateToken, deleteAccountView);

export default del;
