import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser"
import couponRoutes from "./routes/coupon.route.js";
import paymentRoutes from "./routes/payment.route.js";
import analyticsRoutes from "./routes/analytics.route.js";

const app = express();

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true
}));

const _dirname = path.resolve();
app.use(express.json({ limit : '10mb'}));
app.use(cookieParser());

console.log("✅ Middleware loaded");

// Mount routes
app.use("/api/auth", authRoutes);
console.log("✅ Auth routes mounted");

app.use("/api/products", productRoutes);
console.log("✅ product routes mounted");

app.use("/api/cart", cartRoutes);
console.log("✅ cart routes mounted");

app.use("/api/coupon", couponRoutes);
console.log("✅ coupon routes mounted");

app.use("/api/payment", paymentRoutes);
console.log("✅ payment routes mounted");

app.use("/api/analytics", analyticsRoutes);
console.log("✅ analytics routes mounted");

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(_dirname, '/frontend/vite-project/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(_dirname, 'frontend', 'vite-project', 'dist', 'index.html'));
  } );  
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("✅ Server running on http://localhost:" + PORT);
  connectDB();
});
