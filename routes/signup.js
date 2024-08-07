import express from "express"
const signup = express.Router()
import {signUpUser} from "../views/signupViews.js"

signup.use(express.json())

signup.post("/", signUpUser)

export default signup