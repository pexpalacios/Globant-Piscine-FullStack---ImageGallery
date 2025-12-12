//run express and middleware
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./auth.ts";
import photosRouter from "./photos.ts";

console.log("Starting backend...");

//Get environment
dotenv.config();

const app = express();
const PORT = process.env.APP_PORT ?? 3000;

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());

//Routes
app.use("/auth", authRouter);
app.use("/api/photos", photosRouter);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});