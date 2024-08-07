import express from "express";
const login = express.Router();
import { loginViews } from "../views/loginViews.js";

login.post("/", loginViews);

export default login;
