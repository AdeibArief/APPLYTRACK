import { configDotenv } from "dotenv";
import connectDB from "./config/db.js";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import jobRoutes from "./routes/jobs.js";
import extractRoute from "./routes/extract.js";

configDotenv();
connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URI }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/extract", extractRoute);


app.get("/", (req, res) => res.send("APPLYTRACK API IS RUNNING"));
app.get;
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log("SERVER PORT IS RUNNING"));
