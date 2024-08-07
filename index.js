import express from "express";
import cors from "cors";
import morgan from "morgan";
import "dotenv/config";
import cookieParser from "cookie-parser";
import signup from "./routes/signup.js";
import resume from "./routes/resume.js";
import login from "./routes/login.js";
import logout from "./routes/logout.js";

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

app.use(morgan("dev"));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.static("public"));

app.use("/signup", signup);
app.use("/resume", resume);
app.use("/login", login);
app.use("/logout", logout);

app.listen(PORT, () => {
  console.log(
    `Running on: ${process.env.NODE_ENV === "development" ? `http://localhost:${PORT}` : process.env.FRONTEND_URL}`,
  );
});
