import connectDB from "./config/db.js";
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import signup from "./routes/signup.js";
import resume from "./routes/resume.js";
import login from "./routes/login.js";
import logout from "./routes/logout.js";
import del from "./routes/delete.js";
import questions from "./routes/questions.js";
import update from "./routes/update.js";
import verify from "./routes/verify.js";
import resendVerification from "./routes/resendVerification.js";
import reset from "./routes/reset.js";

connectDB();

const app = express();
const PORT = process.env.PORT || 5050;

const allowedOrigins = [process.env.FRONTEND_URL];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.static("public"));

app.use("/signup", signup);
app.use("/resume", resume);
app.use("/login", login);
app.use("/logout", logout);
app.use("/update", update);
app.use("/delete", del);
app.use("/questions", questions);
app.use("/verify", verify);
app.use("/resendVerification", resendVerification);
app.use("/forgot", reset);

// Only run the app if the connection to Database is successful
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");

  app.listen(PORT, () => {
    console.log(
      `Running on: ${process.env.NODE_ENV === "development" ? `http://localhost:${PORT}` : process.env.FRONTEND_URL}`,
    );
  });
});
