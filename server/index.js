import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import router from "./routes/routes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api",router);
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});