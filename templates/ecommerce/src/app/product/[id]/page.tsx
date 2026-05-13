"use client";
import { use, useEffect, useState } from "react";
import Link from "next/link";

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<any>(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"}/api/storefront/products`)
      .then(r => r.json())
      .then(data => {
        const found = data.find((p: any) => String(p.id) === String(id));
        setProduct(found || null);
      });
  }, [id]);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const exists = cart.find((i: any) => i.id === product.id);
    if (!exists) cart.push({ id: product.id, name: product.name, price: product.price, qty: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));
    setAdded(true);
  };

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#0e1417" }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "rgba(0,212,255,0.4)", borderTopColor: "transparent" }} />
        <p className="text-sm font-medium" style={{ color: "#859398" }}>Loading product…</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ backgroundColor: "#0e1417" }}>

      {/* Ambient glow blobs */}
      <div className="pointer-events-none fixed top-0 right-0 w-96 h-96 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #00d4ff 0%, transparent 70%)", filter: "blur(100px)", transform: "translate(30%, -30%)" }} />
      <div className="pointer-events-none fixed bottom-0 left-0 w-80 h-80 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)", filter: "blur(90px)", transform: "translate(-30%, 30%)" }} />

      <div className="relative z-10 max-w-2xl mx-auto py-12 px-4">

        {/* Back link */}
        <Link
          href="/store"
          className="inline-flex items-center gap-2 text-sm font-medium mb-8 transition-colors group"
          style={{ color: "#859398" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#a8e8ff")}
          onMouseLeave={e => (e.currentTarget.style.color = "#859398")}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Store
        </Link>

        {/* Card */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          {/* Product image area */}
          <div
            className="relative h-64 flex items-center justify-center overflow-hidden"
            style={{ background: "linear-gradient(135deg, rgba(0,212,255,0.06) 0%, rgba(124,58,237,0.06) 100%)" }}
          >
            {/* Grid texture */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: "linear-gradient(rgba(0,212,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.6) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
            {/* Glowing ring behind icon */}
            <div
              className="absolute w-32 h-32 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(0,212,255,0.12) 0%, transparent 70%)", filter: "blur(16px)" }}
            />
            <div
              className="relative z-10 w-24 h-24 rounded-2xl flex items-center justify-center"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(0,212,255,0.2)",
                boxShadow: "0 0 32px rgba(0,212,255,0.08)",
              }}
            >
              <span style={{ fontSize: 44 }}>📦</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">

            {/* Name + description */}
            <h1
              className="text-2xl font-bold mb-2"
              style={{ color: "#dde3e7", letterSpacing: "-0.02em", lineHeight: 1.3 }}
            >
              {product.name}
            </h1>
            <p className="text-sm leading-relaxed mb-8" style={{ color: "#859398" }}>
              {product.description}
            </p>

            {/* Divider */}
            <div className="mb-6" style={{ height: "1px", background: "rgba(255,255,255,0.07)" }} />

            {/* Price + CTA row */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#3c494e" }}>Price</p>
                <span
                  className="text-4xl font-extrabold"
                  style={{ color: "#a8e8ff", letterSpacing: "-0.03em" }}
                >
                  ₹{product.price?.toLocaleString?.("en-IN") ?? product.price}
                </span>
              </div>

              <button
                onClick={addToCart}
                disabled={added}
                className="px-7 py-3 rounded-lg font-bold text-sm tracking-wide transition-all active:scale-95 disabled:opacity-70"
                style={{
                  backgroundColor: added ? "rgba(0,212,255,0.15)" : "#a8e8ff",
                  color: added ? "#a8e8ff" : "#001f27",
                  border: added ? "2px solid rgba(0,212,255,0.3)" : "2px solid rgba(255,255,255,0.2)",
                  boxShadow: added ? "none" : "4px 4px 0px 0px rgba(0,212,255,1)",
                }}
              >
                {added ? "✅ Added to Cart" : "Add to Cart"}
              </button>
            </div>

            {/* Go to cart link */}
            {added && (
              <div className="mt-5 pt-5" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                <Link
                  href="/store/cart"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-lg text-sm font-semibold transition-all"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    color: "#bbc9cf",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLElement).style.color = "#dde3e7"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; (e.currentTarget as HTMLElement).style.color = "#bbc9cf"; }}
                >
                  View Cart
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            )}

          </div>
        </div>

        {/* Trust row */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            { icon: "🚀", label: "Fast Delivery" },
            { icon: "🔒", label: "Secure Pay" },
            { icon: "↩️", label: "Easy Returns" },
          ].map(({ icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 py-3 rounded-xl"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <span style={{ fontSize: 18 }}>{icon}</span>
              <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: "#3c494e" }}>{label}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
