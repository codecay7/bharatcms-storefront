"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const c = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(c);
  }, []);

  const removeItem = (index: number) => {
    const c = [...cart];
    c.splice(index, 1);
    setCart(c);
    localStorage.setItem("cart", JSON.stringify(c));
  };

  const goToCheckout = () => {
    router.push('/checkout');
  };

  const total = cart.reduce((s, it) => s + (it.price || 0) * (it.qty || 1), 0);

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-semibold mb-4">Cart</h1>
      {cart.length === 0 ? <div>Your cart is empty</div> : (
        <div>
          <ul>
            {cart.map((it, i) => (
              <li key={i} className="flex items-center justify-between py-2 border-b">
                <div>
                  <div className="font-medium">{it.name}</div>
                  <div className="text-sm text-gray-600">Qty: {it.qty}</div>
                </div>
                <div>
                  <div className="font-semibold">₹{(it.price||0).toFixed(2)}</div>
                  <button onClick={() => removeItem(i)} className="text-sm text-red-500">Remove</button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between">
            <div className="font-semibold">Total: ₹{total.toFixed(2)}</div>
            <div>
              <button onClick={goToCheckout} className="px-4 py-2 bg-black text-white rounded">Checkout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
