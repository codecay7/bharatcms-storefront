"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    try {
      setCart(JSON.parse(localStorage.getItem("cart") || "[]"));
    } catch { setCart([]); }
  }, []);

  const remove = (id: number) => {
    const updated = cart.filter((i) => i.id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const total = cart.reduce((s, i) => s + i.price * (i.qty || 1), 0);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0e1417" }}>
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/store" className="text-slate-400 hover:text-white text-sm">← Back</Link>
          <h1 className="text-2xl font-bold text-white">Your Cart</h1>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-20">
            <div style={{ fontSize: 48 }}>🛒</div>
            <p className="text-slate-400 mt-4">Your cart is empty</p>
            <Link href="/store" className="inline-block mt-6 px-6 py-2 rounded-lg font-bold text-sm"
              style={{ backgroundColor: "#00d4ff", color: "#0e1417" }}>Browse Products</Link>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 rounded-xl border border-white/10"
                  style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(16px)" }}>
                  <div>
                    <p className="text-white font-semibold">{item.name}</p>
                    <p className="text-slate-400 text-sm">Qty: {item.qty || 1}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold" style={{ color: "#00d4ff" }}>₹{item.price}</span>
                    <button onClick={() => remove(item.id)} className="text-slate-500 hover:text-red-400 text-sm">Remove</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 rounded-2xl border border-white/10 mb-6"
              style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(16px)" }}>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Total</span>
                <span className="text-2xl font-bold" style={{ color: "#00d4ff" }}>₹{total.toFixed(2)}</span>
              </div>
            </div>

            <Link href="/store/checkout"
              className="w-full block text-center py-3 rounded-xl font-bold text-sm transition-all active:scale-95"
              style={{ backgroundColor: "#00d4ff", color: "#0e1417" }}>
              Proceed to Checkout →
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
