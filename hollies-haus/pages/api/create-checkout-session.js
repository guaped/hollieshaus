import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const { items } = req.body;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: items.map((cd) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: `${cd.title} — ${cd.artist}`,
        },
        unit_amount: Math.round(cd.price * 100),
      },
      quantity: 1,
    })),
    success_url: `${req.headers.origin}/success`,
    cancel_url: `${req.headers.origin}/`,
  });

  res.json({ id: session.id });
}
