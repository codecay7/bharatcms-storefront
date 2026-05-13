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
    <div className="min-h-screen relative overflow-x-hidden" style={{ backgroundColor: "#0e1417" }}>

      {/* Ambient blobs */}
      <div className="pointer-events-none fixed top-0 right-0 w-96 h-96 rounded-full opacity-[0.12]"
        style={{ background: "radial-gradient(circle, #00d4ff 0%, transparent 70%)", filter: "blur(100px)", transform: "translate(30%, -30%)" }} />
      <div className="pointer-events-none fixed bottom-0 left-0 w-80 h-80 rounded-full opacity-[0.08]"
        style={{ background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)", filter: "blur(90px)", transform: "translate(-30%, 30%)" }} />

      <div className="relative z-10 max-w-2xl mx-auto py-12 px-4">

        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <Link href="/store"
            className="flex items-center gap-1.5 text-sm font-medium transition-colors"
            style={{ color: "#859398" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#a8e8ff")}
            onMouseLeave={e => (e.currentTarget.style.color = "#859398")}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </Link>
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
          <h1 className="text-xl font-bold" style={{ color: "#dde3e7", letterSpacing: "-0.02em" }}>Your Cart</h1>
          {cart.length > 0 && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.2)", color: "#a8e8ff" }}>
              {cart.length}
            </span>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-5">
            <div className="w-24 h-24 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <span style={{ fontSize: 44 }}>🛒</span>
            </div>
            <div className="text-center">
              <p className="text-base font-semibold mb-1" style={{ color: "#dde3e7" }}>Your cart is empty</p>
              <p className="text-sm" style={{ color: "#859398" }}>Add some products to get started</p>
            </div>
            <Link href="/store"
              className="px-6 py-3 rounded-lg font-bold text-sm transition-all active:scale-95"
              style={{
                background: "#a8e8ff",
                color: "#001f27",
                border: "2px solid rgba(255,255,255,0.2)",
                boxShadow: "4px 4px 0px 0px rgba(0,212,255,1)",
              }}>
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            {/* Cart items */}
            <div className="flex flex-col gap-3 mb-8">
              {cart.map((item) => (
                <div key={item.id}
                  className="flex items-center justify-between p-4 rounded-xl"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(255,255,255,0.09)",
                  }}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "linear-gradient(135deg, rgba(0,212,255,0.08), rgba(124,58,237,0.08))", border: "1px solid rgba(255,255,255,0.08)" }}>
                      <span style={{ fontSize: 22 }}>📦</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "#dde3e7" }}>{item.name}</p>
                      <p className="text-xs mt-0.5" style={{ color: "#859398" }}>Qty: {item.qty || 1}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-base font-bold" style={{ color: "#a8e8ff" }}>
                      ₹{(item.price * (item.qty || 1)).toLocaleString("en-IN")}
                    </span>
                    <button onClick={() => remove(item.id)}
                      className="text-xs font-semibold px-2.5 py-1 rounded-lg transition-all"
                      style={{ color: "#859398", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#f87171"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(248,113,113,0.3)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#859398"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; }}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order summary */}
            <div className="rounded-2xl p-6 mb-5"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)" }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#3c494e" }}>Order Summary</p>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm" style={{ color: "#859398" }}>Subtotal ({cart.length} items)</span>
                <span className="text-sm font-semibold" style={{ color: "#bbc9cf" }}>₹{total.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between items-center mb-4 pb-4"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <span className="text-sm" style={{ color: "#859398" }}>Shipping</span>
                <span className="text-sm font-semibold" style={{ color: "#4ade80" }}>Free</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold" style={{ color: "#dde3e7" }}>Total</span>
                <span className="text-2xl font-extrabold" style={{ color: "#a8e8ff", letterSpacing: "-0.03em" }}>
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <Link href="/store/checkout"
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-lg font-bold text-sm transition-all active:scale-95"
              style={{
                background: "#a8e8ff",
                color: "#001f27",
                border: "2px solid rgba(255,255,255,0.2)",
                boxShadow: "4px 4px 0px 0px rgba(0,212,255,1)",
              }}>
              Proceed to Checkout
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
