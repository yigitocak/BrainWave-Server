import express from "express";
const login = express.Router();
import { loginUserView, decodeView } from "../views/loginViews.js";
import authenticateToken from "../middlewares/authenticateToken.js";

login.post("/", loginUserView);
login.get("/auth", authenticateToken, decodeView);

export default login;
