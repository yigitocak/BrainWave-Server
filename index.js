import express from "express";
import cors from "cors";
import morgan from "morgan";
import "dotenv/config";
import signup from "./routes/signup.js";
import resume from "./routes/resume.js";

const app = express();
const PORT = process.env.PORT;

app.use(morgan("dev"));
app.use(cors());
app.use(express.static("public"));

app.use("/signup", signup);
app.use("/resume", resume);

app.listen(PORT || 5050, () => {
  console.log(`Running on: http://localhost:${PORT}`);
});
