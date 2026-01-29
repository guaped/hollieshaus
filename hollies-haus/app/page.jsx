"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Disc3 } from "lucide-react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY
);

export default function HolliesHaus() {
  const [cart, setCart] = useState([]);
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    setInventory([
      {
        id: 1,
        title: "OK Computer",
        artist: "Radiohead",
        price: 9.99,
        condition: "Very Good",
        stock: 1,
        image_url: "/placeholder.jpg",
      },
    ]);
  }, []);

  const addToCart = (cd) => setCart([...cart, cd]);

  const checkout = async () => {
    const stripe = await stripePromise;
    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cart }),
    });
    const session = await res.json();
    await stripe.redirectToCheckout({ sessionId: session.id });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-8">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Disc3 /> Hollies Haus
        </h1>
        <Button onClick={checkout}>Checkout ({cart.length})</Button>
      </header>

      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {inventory.map((cd) => (
          <Card key={cd.id}>
            <CardContent className="p-4">
              <img
                src={cd.image_url}
                alt={cd.title}
                className="h-40 w-full object-cover"
              />
              <h2>{cd.title}</h2>
              <p>{cd.artist}</p>
              <p>{cd.condition}</p>
              <Button onClick={() => addToCart(cd)}>Add</Button>
            </CardContent>
          </Card>
        ))}
      </motion.div>
    </div>
  );
}
