import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_your_key_here");  