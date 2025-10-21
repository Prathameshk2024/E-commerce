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
const allowedOrigins = process.env.NODE_ENV === "production" 
  ? [process.env.CLIENT_URL || "https://e-commerce-4-ogqr.onrender.com"]
  : ["http://localhost:5173", "http://localhost:5174"];

app.use(
  cors({
    origin: allowedOrigins,
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

// ✅ Serve frontend build
const distPath = path.join(__dirname, "../frontend/vite-project/dist");

console.log("📂 Environment:", process.env.NODE_ENV);
console.log("📂 __dirname:", __dirname);
console.log("📂 distPath:", distPath);

// Serve static files
app.use(express.static(distPath));
console.log("✅ Serving static files from:", distPath);

// Catch-all handler for client-side routing - must be last!
app.use((req, res) => {
  const indexPath = path.join(distPath, "index.html");
  console.log("📄 Serving index.html for:", req.url);
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error("❌ Error serving index.html:", err);
      res.status(500).json({ 
        error: "Frontend not found",
        message: "Make sure the build was successful and dist folder exists",
        path: indexPath 
      });
    }
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  connectDB();
});
