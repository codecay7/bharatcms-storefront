"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useRazorpay from "../hooks/useRazorpay";

export default function CheckoutPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { openCheckout } = useRazorpay();

  useEffect(() => {
    const c = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(c);
  }, []);

  const total = cart.reduce((s, it) => s + (it.price || 0) * (it.qty || 1), 0);

  const onPay = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"}/api/storefront/orders/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart, subtotal: total, total, tenant: null }),
      });
      const data = await res.json();
      if (!data.razorpay_order_id) throw new Error("No order id");
      openCheckout({
        amount: data.amount || Math.round(total * 100),
        planName: "purchase",
        userEmail: "",
        userName: "",
        tenantId: null,
        onSuccess: async () => {
          localStorage.removeItem("cart");
          router.push("/checkout/success");
        },
        onFailure: (err: any) => {
          alert("Payment failed: " + err);
        },
      });
    } catch (e) {
      console.error(e);
      alert("Failed to initiate payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ backgroundColor: "#0e1417" }}>

      {/* Ambient blobs */}
      <div className="pointer-events-none fixed top-0 right-0 w-96 h-96 rounded-full opacity-[0.12]"
        style={{ background: "radial-gradient(circle, #00d4ff 0%, transparent 70%)", filter: "blur(100px)", transform: "translate(30%, -30%)" }} />
      <div className="pointer-events-none fixed bottom-0 left-0 w-80 h-80 rounded-full opacity-[0.08]"
        style={{ background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)", filter: "blur(90px)", transform: "translate(-30%, 30%)" }} />

      <div className="relative z-10 max-w-3xl mx-auto py-12 px-4">

        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <button onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm font-medium transition-colors"
            style={{ color: "#859398" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#a8e8ff")}
            onMouseLeave={e => (e.currentTarget.style.color = "#859398")}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </button>
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
          <h1 className="text-xl font-bold" style={{ color: "#dde3e7", letterSpacing: "-0.02em" }}>Checkout</h1>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <span style={{ fontSize: 44 }}>��</span>
            <p className="text-sm font-medium" style={{ color: "#859398" }}>Your cart is empty</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">

            {/* Left — item list */}
            <div className="md:col-span-3 flex flex-col gap-3">
              <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#3c494e" }}>
                Order Items
              </p>
              {cart.map((it, i) => (
                <div key={i}
                  className="flex items-center justify-between p-4 rounded-xl"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(255,255,255,0.09)",
                  }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "linear-gradient(135deg, rgba(0,212,255,0.08), rgba(124,58,237,0.08))", border: "1px solid rgba(255,255,255,0.08)" }}>
                      <span style={{ fontSize: 18 }}>📦</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "#dde3e7" }}>{it.name}</p>
                      <p className="text-xs mt-0.5" style={{ color: "#859398" }}>Qty: {it.qty || 1}</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold" style={{ color: "#a8e8ff" }}>
                    ₹{((it.price || 0) * (it.qty || 1)).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>

            {/* Right — summary + pay */}
            <div className="md:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#3c494e" }}>
                Summary
              </p>
              <div className="rounded-2xl p-5 mb-4"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)" }}>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm" style={{ color: "#859398" }}>Subtotal</span>
                  <span className="text-sm font-semibold" style={{ color: "#bbc9cf" }}>₹{total.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between items-center mb-4 pb-4"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                  <span className="text-sm" style={{ color: "#859398" }}>GST</span>
                  <span className="text-sm font-semibold" style={{ color: "#859398" }}>Included</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold" style={{ color: "#dde3e7" }}>Total</span>
                  <span className="text-xl font-extrabold" style={{ color: "#a8e8ff", letterSpacing: "-0.03em" }}>
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <button onClick={onPay} disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-lg font-bold text-sm transition-all active:scale-95 disabled:opacity-60"
                style={{
                  background: loading ? "rgba(168,232,255,0.2)" : "#a8e8ff",
                  color: loading ? "#a8e8ff" : "#001f27",
                  border: "2px solid rgba(255,255,255,0.2)",
                  boxShadow: loading ? "none" : "4px 4px 0px 0px rgba(0,212,255,1)",
                }}>
                {loading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
                      style={{ borderColor: "rgba(168,232,255,0.4)", borderTopColor: "transparent" }} />
                    Processing…
                  </>
                ) : (
                  <>
                    Pay ₹{total.toLocaleString("en-IN")}
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </>
                )}
              </button>

              <p className="text-center text-xs mt-3" style={{ color: "#3c494e" }}>
                🔒 Secured by Razorpay
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
