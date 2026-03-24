import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import couponRoutes from "./routes/couponRoutes";
import settingsRoutes from "./routes/settingRoutes";
import cartRoutes from "./routes/cartRoutes";
import addressRoutes from "./routes/addressRoutes";
import orderRoutes from "./routes/orderRoutes";
import { sendError } from "./utils/response";
const app = express();
const PORT = process.env.PORT || 3002;

import fs from "fs";
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

const corsOptions = {
  origin: [
    process.env.CLIENT_URL || "http://localhost:3000",
    "https://voren.vercel.app",
    "http://localhost:3000"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - Headers:`, req.headers.cookie ? "Cookies present" : "No cookies");
  next();
});

export const prisma = new PrismaClient();

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/coupon", couponRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/order", orderRoutes);

app.get("/", (req, res) => {
  res.send("Hello from E-Commerce backend");
});


app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Global Error Handler:", err);
  sendError(res, err.status || 500, err.message || "An unexpected error occurred");
});

app.listen(PORT, () => {
  console.log(`Server is now running on port ${PORT}`);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit();
});
