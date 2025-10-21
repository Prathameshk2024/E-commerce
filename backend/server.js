import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
import paymentRoutes from "./routes/payment.route.js";
import analyticsRoutes from "./routes/analytics.route.js";
import { connectDB } from "./lib/db.js";

// ✅ Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ✅ Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

console.log("✅ Middleware loaded");

// ✅ Mount routes
app.use("/api/auth", authRoutes);
console.log("✅ Auth routes mounted");

app.use("/api/products", productRoutes);
console.log("✅ Product routes mounted");

app.use("/api/cart", cartRoutes);
console.log("✅ Cart routes mounted");

app.use("/api/coupon", couponRoutes);
console.log("✅ Coupon routes mounted");

app.use("/api/payment", paymentRoutes);
console.log("✅ Payment routes mounted");

app.use("/api/analytics", analyticsRoutes);
console.log("✅ Analytics routes mounted");

// ✅ Serve frontend build in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/vite-project/dist")));

  app.get("*", (req, res) => {
    res.sendFile(
      path.resolve(__dirname, "../frontend/vite-project/dist/index.html")
    );
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  connectDB();
});
